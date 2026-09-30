/**
 * GREENFLEET AI - Comparative Benchmark Suite
 *
 * Runs Quantum-Inspired Evolutionary Optimizer (QIEA) and Classical Baseline
 * under identical voyage conditions and provides side-by-side metric audits.
 * Strictly adheres to empirical truth: no fabricated claims.
 */

import {
  VoyageParameters,
  OptimizationWeights,
  BenchmarkComparison,
} from "@/types";
import { QuantumInspiredEvolutionaryOptimizer } from "./quantum-optimizer";
import { ClassicalBaselineOptimizer } from "./classical-optimizer";
import { FuelModelOverrides } from "./physics-model";

export interface BenchmarkOptions {
  context: VoyageParameters;
  weights: OptimizationWeights;
  populationSize?: number;
  nIterations?: number;
  seed?: number;
  overrides?: FuelModelOverrides;
  onProgress?: (algorithm: string, step: number, total: number) => void;
}

export async function runBenchmarkComparison(
  options: BenchmarkOptions
): Promise<BenchmarkComparison> {
  const { context, weights, populationSize = 36, nIterations = 32, seed = 42, overrides, onProgress } = options;

  // 1. Run Quantum-Inspired Evolutionary Optimizer
  const qOpt = new QuantumInspiredEvolutionaryOptimizer({
    weights,
    populationSize,
    nIterations,
    seed,
    overrides,
  });

  const quantumResult = await qOpt.optimize(context, (step, total) => {
    if (onProgress) onProgress("Quantum-Inspired (QIEA)", step, total);
  });

  // 2. Run Classical Baseline Optimizer on exact same inputs
  const cOpt = new ClassicalBaselineOptimizer({
    weights,
    populationSize,
    nIterations,
    seed,
    overrides,
  });

  const classicalResult = await cOpt.optimize(context, (step, total) => {
    if (onProgress) onProgress("Classical Baseline", step, total);
  });

  const qm = quantumResult.metrics;
  const cm = classicalResult.metrics;

  const calcDelta = (valQ: number, valC: number): number => {
    if (valC === 0) return 0;
    return Math.round(((valQ - valC) / Math.abs(valC)) * 1000) / 10;
  };

  const determineBetter = (valQ: number, valC: number, lowerIsBetter: boolean = true): string => {
    if (Math.abs(valQ - valC) < 0.001) return "Parity (Equal)";
    if (lowerIsBetter) {
      return valQ < valC ? "Quantum-Inspired" : "Classical Baseline";
    } else {
      return valQ > valC ? "Quantum-Inspired" : "Classical Baseline";
    }
  };

  const summaryRows = [
    {
      metric: "Weighted Objective Score",
      classicalValue: classicalResult.bestScore,
      quantumValue: quantumResult.bestScore,
      differencePercent: calcDelta(quantumResult.bestScore, classicalResult.bestScore),
      betterAlgorithm: determineBetter(quantumResult.bestScore, classicalResult.bestScore, true),
      unit: "Index",
    },
    {
      metric: "Predicted Fuel Consumption",
      classicalValue: cm.fuelConsumptionL,
      quantumValue: qm.fuelConsumptionL,
      differencePercent: calcDelta(qm.fuelConsumptionL, cm.fuelConsumptionL),
      betterAlgorithm: determineBetter(qm.fuelConsumptionL, cm.fuelConsumptionL, true),
      unit: "Liters",
    },
    {
      metric: "Total Operating Cost",
      classicalValue: cm.totalOperatingCostUsd,
      quantumValue: qm.totalOperatingCostUsd,
      differencePercent: calcDelta(qm.totalOperatingCostUsd, cm.totalOperatingCostUsd),
      betterAlgorithm: determineBetter(qm.totalOperatingCostUsd, cm.totalOperatingCostUsd, true),
      unit: "USD ($)",
    },
    {
      metric: "Lifecycle CO2e Emissions",
      classicalValue: cm.wtwCo2eTonnes,
      quantumValue: qm.wtwCo2eTonnes,
      differencePercent: calcDelta(qm.wtwCo2eTonnes, cm.wtwCo2eTonnes),
      betterAlgorithm: determineBetter(qm.wtwCo2eTonnes, cm.wtwCo2eTonnes, true),
      unit: "Tonnes",
    },
    {
      metric: "Voyage Travel Time",
      classicalValue: cm.travelTimeHours,
      quantumValue: qm.travelTimeHours,
      differencePercent: calcDelta(qm.travelTimeHours, cm.travelTimeHours),
      betterAlgorithm: determineBetter(qm.travelTimeHours, cm.travelTimeHours, true),
      unit: "Hours",
    },
    {
      metric: "Algorithm Runtime",
      classicalValue: classicalResult.runtimeSeconds,
      quantumValue: quantumResult.runtimeSeconds,
      differencePercent: calcDelta(quantumResult.runtimeSeconds, classicalResult.runtimeSeconds),
      betterAlgorithm: determineBetter(
        quantumResult.runtimeSeconds,
        classicalResult.runtimeSeconds,
        true
      ),
      unit: "Seconds",
    },
    {
      metric: "Constraint Satisfaction",
      classicalValue: classicalResult.isFeasible ? "All Satisfied" : "Violations",
      quantumValue: quantumResult.isFeasible ? "All Satisfied" : "Violations",
      differencePercent: "—",
      betterAlgorithm:
        quantumResult.isFeasible && !classicalResult.isFeasible
          ? "Quantum-Inspired"
          : !quantumResult.isFeasible && classicalResult.isFeasible
          ? "Classical Baseline"
          : "Both Feasible",
      unit: "Status",
    },
  ];

  // Merge convergence trajectories
  const maxIters = Math.min(
    quantumResult.convergenceHistory.length,
    classicalResult.convergenceHistory.length
  );
  const convergencePoints = [];
  for (let i = 0; i < maxIters; i++) {
    convergencePoints.push({
      iteration: i + 1,
      quantumBest: quantumResult.convergenceHistory[i].bestScore,
      classicalBest: classicalResult.convergenceHistory[i].bestScore,
    });
  }

  return {
    quantumResult,
    classicalResult,
    summaryRows,
    convergencePoints,
  };
}
