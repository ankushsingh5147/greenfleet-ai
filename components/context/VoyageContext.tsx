"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import confetti from "canvas-confetti";
import {
  VoyageParameters,
  PredictionResult,
  OptimizationResult,
  OptimizationWeights,
  FuelType,
} from "@/types";
import {
  DEFAULT_VOYAGE_PARAMS,
  DEFAULT_WEIGHTS,
  INITIAL_FUEL_DATA,
  PRESET_SCENARIOS,
  VESSEL_SPECS,
} from "@/lib/config";
import { predictVoyageMetrics, FuelModelOverrides } from "@/lib/physics-model";
import { QuantumInspiredEvolutionaryOptimizer } from "@/lib/quantum-optimizer";

interface VoyageContextType {
  voyageParams: VoyageParameters;
  setVoyageParams: React.Dispatch<React.SetStateAction<VoyageParameters>>;
  updateParam: <K extends keyof VoyageParameters>(key: K, value: VoyageParameters[K]) => void;
  prediction: PredictionResult;
  optimizedResult: OptimizationResult | null;
  weights: OptimizationWeights;
  setWeights: React.Dispatch<React.SetStateAction<OptimizationWeights>>;
  updateWeight: (key: keyof OptimizationWeights, value: number) => void;
  isOptimizing: boolean;
  optimizationStep: string;
  optimizationProgress: number;
  activePresetId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLandingView: boolean;
  setIsLandingView: (val: boolean) => void;
  customFuelPrices: Record<FuelType, number>;
  setCustomFuelPrices: React.Dispatch<React.SetStateAction<Record<FuelType, number>>>;
  updateFuelPrice: (fuel: FuelType, price: number) => void;
  runOptimization: () => Promise<OptimizationResult>;
  loadPreset: (presetId: string) => void;
  loadDemoScenario: () => void;
  resetScenario: () => void;
}

const VoyageContext = createContext<VoyageContextType | undefined>(undefined);

export function VoyageProvider({ children }: { children: ReactNode }) {
  const [voyageParams, setVoyageParams] = useState<VoyageParameters>(DEFAULT_VOYAGE_PARAMS);
  const [weights, setWeights] = useState<OptimizationWeights>(DEFAULT_WEIGHTS);
  const [optimizedResult, setOptimizedResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationStep, setOptimizationStep] = useState<string>("");
  const [optimizationProgress, setOptimizationProgress] = useState<number>(0);
  const [activePresetId, setActivePresetId] = useState<string>("baseline");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isLandingView, setIsLandingView] = useState<boolean>(false);

  // Editable fuel prices
  const [customFuelPrices, setCustomFuelPrices] = useState<Record<FuelType, number>>({
    Diesel: INITIAL_FUEL_DATA.Diesel.defaultPriceUsdPerTonne,
    LNG: INITIAL_FUEL_DATA.LNG.defaultPriceUsdPerTonne,
    Methanol: INITIAL_FUEL_DATA.Methanol.defaultPriceUsdPerTonne,
    Hydrogen: INITIAL_FUEL_DATA.Hydrogen.defaultPriceUsdPerTonne,
    Ammonia: INITIAL_FUEL_DATA.Ammonia.defaultPriceUsdPerTonne,
  });

  const getOverrides = useCallback((): FuelModelOverrides => {
    return {
      customFuelPrices,
      carbonPriceUsdPerTonne: voyageParams.carbonPriceUsdPerTonne,
    };
  }, [customFuelPrices, voyageParams.carbonPriceUsdPerTonne]);

  // Dynamic deterministic prediction calculation for current voyageParams
  const prediction = useMemo(() => {
    return predictVoyageMetrics(voyageParams, getOverrides());
  }, [voyageParams, getOverrides]);

  const updateParam = useCallback(
    <K extends keyof VoyageParameters>(key: K, value: VoyageParameters[K]) => {
      setVoyageParams((prev) => {
        const next = { ...prev, [key]: value };
        // Sync cargo load % if cargoDemand or vessel changes
        if (key === "vesselType" || key === "cargoDemandTonnes") {
          const spec = VESSEL_SPECS[next.vesselType];
          const cap = spec.defaultCapacity;
          next.capacityTonnes = cap;
          next.enginePowerKw = spec.defaultPower;
          next.cargoLoadPercent = Math.min(100.0, Math.max(10.0, (next.cargoDemandTonnes / cap) * 100.0));
        }
        return next;
      });
    },
    []
  );

  const updateWeight = useCallback((key: keyof OptimizationWeights, value: number) => {
    setWeights((prev) => {
      const clamped = Math.max(0.05, Math.min(0.85, value));
      const otherKeys = (Object.keys(prev) as (keyof OptimizationWeights)[]).filter((k) => k !== key);
      const remainingWeight = 1.0 - clamped;
      const currentSumOthers = otherKeys.reduce((acc, k) => acc + prev[k], 0);

      const next = { ...prev, [key]: Math.round(clamped * 100) / 100 };
      if (currentSumOthers > 0) {
        otherKeys.forEach((k) => {
          next[k] = Math.round(((prev[k] / currentSumOthers) * remainingWeight) * 100) / 100;
        });
      }
      return next;
    });
  }, []);

  const updateFuelPrice = useCallback((fuel: FuelType, price: number) => {
    setCustomFuelPrices((prev) => ({
      ...prev,
      [fuel]: Math.max(10, Math.round(price)),
    }));
  }, []);

  const runOptimization = useCallback(async (): Promise<OptimizationResult> => {
    setIsOptimizing(true);
    setOptimizationProgress(5);
    setOptimizationStep("Initializing Q-bit register superposition |ψ⟩");

    try {
      const optimizer = new QuantumInspiredEvolutionaryOptimizer({
        weights,
        populationSize: 36,
        nIterations: 32,
        seed: 42,
        overrides: getOverrides(),
      });

      const result = await optimizer.optimize(voyageParams, (step, total, status) => {
        const pct = Math.round((step / total) * 100);
        setOptimizationProgress(pct);
        setOptimizationStep(status);
      });

      setOptimizedResult(result);
      setOptimizationStep("Optimization complete! Pareto optimal strategy locked.");
      setOptimizationProgress(100);

      // Fire celebratory micro-interaction
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#06b6d4", "#10b981", "#38bdf8"],
        });
      } catch {
        // ignore if window not available
      }

      return result;
    } finally {
      setIsOptimizing(false);
    }
  }, [weights, voyageParams, getOverrides]);

  // Initial optimization on mount to populate executive KPIs dynamically
  useEffect(() => {
    if (!optimizedResult) {
      const opt = new QuantumInspiredEvolutionaryOptimizer({
        weights: DEFAULT_WEIGHTS,
        populationSize: 25,
        nIterations: 20,
        seed: 42,
      });
      opt.optimize(DEFAULT_VOYAGE_PARAMS).then((res) => {
        setOptimizedResult(res);
      });
    }
  }, [optimizedResult]);

  const loadPreset = useCallback(
    (presetId: string) => {
      const preset = PRESET_SCENARIOS.find((p) => p.id === presetId);
      if (!preset) return;
      setActivePresetId(preset.id);

      const spec = VESSEL_SPECS[preset.vesselType];
      const newParams: VoyageParameters = {
        ...voyageParams,
        vesselType: preset.vesselType,
        capacityTonnes: spec.defaultCapacity,
        enginePowerKw: spec.defaultPower,
        distanceKm: preset.distanceKm,
        cargoDemandTonnes: preset.cargoDemandTonnes,
        cargoLoadPercent: Math.min(100, Math.max(10, (preset.cargoDemandTonnes / spec.defaultCapacity) * 100)),
        speedKnots: preset.speedKnots,
        weatherCondition: preset.weatherCondition,
        fuelType: preset.fuelType,
        shorePower: preset.shorePower,
        carbonPriceUsdPerTonne: preset.carbonPriceUsdPerTonne,
      };

      setVoyageParams(newParams);
      if (preset.weights) {
        setWeights(preset.weights);
      }
      if (preset.customFuelPrices) {
        setCustomFuelPrices((prev) => ({ ...prev, ...preset.customFuelPrices }));
      }

      // Re-run optimization for the new preset scenario
      const opt = new QuantumInspiredEvolutionaryOptimizer({
        weights: preset.weights || weights,
        populationSize: 30,
        nIterations: 25,
        seed: 42,
        overrides: {
          customFuelPrices: preset.customFuelPrices,
          carbonPriceUsdPerTonne: preset.carbonPriceUsdPerTonne,
        },
      });
      opt.optimize(newParams).then((res) => {
        setOptimizedResult(res);
      });
    },
    [voyageParams, weights]
  );

  const loadDemoScenario = useCallback(() => {
    loadPreset("baseline");
    setActiveTab("overview");
    setIsLandingView(false);
  }, [loadPreset]);

  const resetScenario = useCallback(() => {
    setVoyageParams(DEFAULT_VOYAGE_PARAMS);
    setWeights(DEFAULT_WEIGHTS);
    setActivePresetId("baseline");
    setCustomFuelPrices({
      Diesel: INITIAL_FUEL_DATA.Diesel.defaultPriceUsdPerTonne,
      LNG: INITIAL_FUEL_DATA.LNG.defaultPriceUsdPerTonne,
      Methanol: INITIAL_FUEL_DATA.Methanol.defaultPriceUsdPerTonne,
      Hydrogen: INITIAL_FUEL_DATA.Hydrogen.defaultPriceUsdPerTonne,
      Ammonia: INITIAL_FUEL_DATA.Ammonia.defaultPriceUsdPerTonne,
    });

    const opt = new QuantumInspiredEvolutionaryOptimizer({
      weights: DEFAULT_WEIGHTS,
      populationSize: 28,
      nIterations: 22,
      seed: 42,
    });
    opt.optimize(DEFAULT_VOYAGE_PARAMS).then((res) => {
      setOptimizedResult(res);
    });
  }, []);

  return (
    <VoyageContext.Provider
      value={{
        voyageParams,
        setVoyageParams,
        updateParam,
        prediction,
        optimizedResult,
        weights,
        setWeights,
        updateWeight,
        isOptimizing,
        optimizationStep,
        optimizationProgress,
        activePresetId,
        activeTab,
        setActiveTab,
        isLandingView,
        setIsLandingView,
        customFuelPrices,
        setCustomFuelPrices,
        updateFuelPrice,
        runOptimization,
        loadPreset,
        loadDemoScenario,
        resetScenario,
      }}
    >
      {children}
    </VoyageContext.Provider>
  );
}

export function useVoyage() {
  const context = useContext(VoyageContext);
  if (!context) {
    throw new Error("useVoyage must be used within a VoyageProvider");
  }
  return context;
}
