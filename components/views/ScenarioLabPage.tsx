"use client";

import React, { useMemo } from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import { PRESET_SCENARIOS, VESSEL_SPECS } from "@/lib/config";
import { generateSensitivityCurve, predictVoyageMetrics } from "@/lib/physics-model";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { FuelType } from "@/types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  FlaskConical,
  Layers,
  Sliders,
  RotateCcw,
  TrendingUp,
  Fuel,
  DollarSign,
  CloudRain,
} from "lucide-react";

export function ScenarioLabPage() {
  const {
    voyageParams,
    updateParam,
    customFuelPrices,
    updateFuelPrice,
    activePresetId,
    loadPreset,
    resetScenario,
  } = useVoyage();

  const spec = VESSEL_SPECS[voyageParams.vesselType];

  // 1. Curve: Fuel vs Speed
  const speedCurveData = useMemo(() => {
    return generateSensitivityCurve(voyageParams, "speed", { customFuelPrices });
  }, [voyageParams, customFuelPrices]);

  // 2. Curve: Fuel vs Cargo Load
  const cargoCurveData = useMemo(() => {
    return generateSensitivityCurve(voyageParams, "cargo", { customFuelPrices });
  }, [voyageParams, customFuelPrices]);

  // 3. Curve: Cost vs Fuel Price
  const priceCurveData = useMemo(() => {
    return generateSensitivityCurve(voyageParams, "fuelPrice", { customFuelPrices });
  }, [voyageParams, customFuelPrices]);

  // 4. Comparison: CO2e vs Fuel Type
  const fuelCo2eData = useMemo(() => {
    const fuels: FuelType[] = ["Diesel", "LNG", "Methanol", "Hydrogen", "Ammonia"];
    return fuels.map((f) => {
      const pred = predictVoyageMetrics(
        { ...voyageParams, fuelType: f },
        { customFuelPrices }
      );
      return {
        fuel: f,
        CO2e: pred.wtwCo2eTonnes,
      };
    });
  }, [voyageParams, customFuelPrices]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              <FlaskConical className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
              SCENARIO WHAT-IF SENSITIVITY LAB
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time parametric exploration of naval cubic power curves, carbon tax volatility,
            cargo displacement drag, and multi-fuel lifecycle dynamics.
          </p>
        </div>

        <button
          onClick={resetScenario}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Preset Scenario Cards (Actually updates state!) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            SELECT DEMO PRESET SCENARIOS
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Clicking modifies parameters and updates all curves
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRESET_SCENARIOS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isActive
                    ? "bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-950 text-cyan-200"
                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 mb-1">{preset.badge}</div>
                  <div className="text-xs font-bold text-slate-100 font-mono line-clamp-1">
                    {preset.name}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 mt-2">
                  {preset.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Sliders Control Panel */}
      <div className="p-5 rounded-2xl bg-[#060b17] border border-cyan-950/80 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5" />
            Active Scenario Variables
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            Voyage: {voyageParams.vesselType} ({formatNumber(voyageParams.distanceKm, 0)} km)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Speed */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Cruising Speed</span>
              <span className="text-cyan-400 font-bold">{voyageParams.speedKnots.toFixed(1)} kn</span>
            </div>
            <input
              type="range"
              min={spec.minSpeed - 2.0}
              max={spec.maxSpeed + 2.0}
              step={0.5}
              value={voyageParams.speedKnots}
              onChange={(e) => updateParam("speedKnots", Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Cargo Load % */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Cargo Load</span>
              <span className="text-cyan-400 font-bold">{voyageParams.cargoLoadPercent.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={voyageParams.cargoLoadPercent}
              onChange={(e) => updateParam("cargoLoadPercent", Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Fuel Price */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">{voyageParams.fuelType} Price</span>
              <span className="text-emerald-400 font-bold">${customFuelPrices[voyageParams.fuelType]}/t</span>
            </div>
            <input
              type="range"
              min={300}
              max={3000}
              step={50}
              value={customFuelPrices[voyageParams.fuelType]}
              onChange={(e) => updateFuelPrice(voyageParams.fuelType, Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Carbon Tax */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">IMO Carbon Tax</span>
              <span className="text-purple-400 font-bold">${voyageParams.carbonPriceUsdPerTonne}/t</span>
            </div>
            <input
              type="range"
              min={20}
              max={250}
              step={10}
              value={voyageParams.carbonPriceUsdPerTonne}
              onChange={(e) => updateParam("carbonPriceUsdPerTonne", Number(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4 Dynamic Sensitivity Charts Quad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Fuel vs Speed (Admiralty Cubic Curve) */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              1. FUEL CONSUMPTION VS SPEED (Admiralty Cubic Power Law)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">P ∝ V³.15</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedCurveData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => `${formatNumber(Number(val), 0)} L`}
                  contentStyle={{
                    backgroundColor: "#070c17",
                    borderColor: "#06b6d4",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="fuelL"
                  name="Fuel Consumption (L)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 font-mono leading-tight">
            Exponential fuel burn surge occurs beyond hull design speed ({spec.defaultSpeed} kn).
          </p>
        </div>

        {/* Chart 2: CO2e vs Fuel Type */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5">
              <CloudRain className="h-4 w-4 text-emerald-400" />
              2. LIFECYCLE CO₂e EMISSIONS VS FUEL TYPE (Tonnes WTW)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">WTW Decarbonization</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelCo2eData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="fuel" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => `${Number(val).toFixed(1)} tonnes`}
                  contentStyle={{
                    backgroundColor: "#070c17",
                    borderColor: "#10b981",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Bar dataKey="CO2e" name="Lifecycle CO2e (t)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 font-mono leading-tight">
            E-Methanol, Hydrogen, and Ammonia yield up to 65–85% reduction in lifecycle emissions.
          </p>
        </div>

        {/* Chart 3: Cost vs Fuel Price */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-amber-400" />
              3. VOYAGE COST SENSITIVITY VS BUNKER FUEL PRICE ($/tonne)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Bunker Shock Analysis</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceCurveData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{
                    backgroundColor: "#070c17",
                    borderColor: "#f59e0b",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="costUsd"
                  name="Total Voyage Cost ($)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 font-mono leading-tight">
            Examines financial vulnerability to market oil shocks + compounding carbon tax liabilities.
          </p>
        </div>

        {/* Chart 4: Fuel vs Cargo Load */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5">
              <Fuel className="h-4 w-4 text-purple-400" />
              4. FUEL CONSUMPTION VS CARGO LOAD FACTOR (% DWT)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Displacement Drag</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cargoCurveData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => `${formatNumber(Number(val), 0)} L`}
                  contentStyle={{
                    backgroundColor: "#070c17",
                    borderColor: "#a855f7",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="fuelL"
                  name="Fuel Consumption (L)"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 font-mono leading-tight">
            Heavier deadweight increases wetted hull surface and wave-making hydrodynamic resistance.
          </p>
        </div>
      </div>
    </div>
  );
}
