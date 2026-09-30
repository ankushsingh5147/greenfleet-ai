/**
 * GREENFLEET AI - Classical Baseline Optimizer
 * Problem Statement: SIH26138
 *
 * Implements a conventional classical population-based search with elite local mutation/hill-climbing.
 * Serves as an honest, unvarnished baseline to benchmark against QIEA on identical maritime scenarios.
 */

import {
  VesselType,
  FuelType,
  OptimizationWeights,
  VoyageParameters,
  CandidateSolution,
  CandidateEvaluation,
  OptimizationResult,
  ConvergencePoint,
} from "@/types";
import { VESSEL_SPECS } from "./config";
import { predictVoyageMetrics, FuelModelOverrides } from "./physics-model";

interface ClassicalOptions {
  weights: OptimizationWeights;
  populationSize?: number;
  nIterations?: number;
  seed?: number;
  overrides?: FuelModelOverrides;
  onProgress?: (step: number, total: number, status: string, bestScore: number) => void;
}

class SeededRandom {
  private seed: number;
  constructor(seed: number = 42) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
  uniform(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  choice<T>(arr: T[]): T {
    const idx = Math.floor(this.next() * arr.length);
    return arr[idx];
  }
}

export class ClassicalBaselineOptimizer {
  private weights: OptimizationWeights;
  private populationSize: number;
  private nIterations: number;
  private rng: SeededRandom;
  private overrides?: FuelModelOverrides;

  constructor(options: ClassicalOptions) {
    this.weights = options.weights;
    this.populationSize = Math.max(15, options.populationSize || 36);
    this.nIterations = Math.max(10, options.nIterations || 32);
    this.rng = new SeededRandom(options.seed || 42);
    this.overrides = options.overrides;
  }

  private sampleRandomCandidate(
    allowedVessels: VesselType[],
    allowedFuels: FuelType[],
    speedBounds: [number, number]
  ): CandidateSolution {
    const chosenVessel = this.rng.choice(allowedVessels);
    const spec = VESSEL_SPECS[chosenVessel];

    const [minV, maxV] = speedBounds;
    const vMin = Math.max(minV, spec.minSpeed);
    const vMax = Math.min(maxV, spec.maxSpeed);
    const chosenSpeed = this.rng.uniform(vMin, vMax);

    const compFuels = allowedFuels.filter((f) => spec.compatibleFuels.includes(f));
    const chosenFuel =
      compFuels.length > 0 ? this.rng.choice(compFuels) : ("Diesel" as FuelType);

    const chosenSp = this.rng.next() > 0.5;
    const fleetCount = Math.floor(this.rng.uniform(1, 5.99));

    return {
      vesselType: chosenVessel,
      speedKnots: Math.round(chosenSpeed * 10) / 10,
      fuelType: chosenFuel,
      shorePower: chosenSp,
      fleetCount,
    };
  }

  private mutateCandidate(
    cand: CandidateSolution,
    allowedVessels: VesselType[],
    allowedFuels: FuelType[]
  ): CandidateSolution {
    const mutated = { ...cand };
    const spec = VESSEL_SPECS[mutated.vesselType];

    // 60% chance to perturb cruising speed locally
    if (this.rng.next() < 0.6) {
      const deltaV = this.rng.uniform(-0.9, 0.9);
      const newV = Math.min(spec.maxSpeed, Math.max(spec.minSpeed, mutated.speedKnots + deltaV));
      mutated.speedKnots = Math.round(newV * 10) / 10;
    }

    // 25% chance to toggle shore power
    if (this.rng.next() < 0.25) {
      mutated.shorePower = !mutated.shorePower;
    }

    // 20% chance to change fleet count
    if (this.rng.next() < 0.2) {
      const deltaCount = this.rng.next() > 0.5 ? 1 : -1;
      mutated.fleetCount = Math.min(5, Math.max(1, mutated.fleetCount + deltaCount));
    }

    // 15% chance to switch compatible fuel
    if (this.rng.next() < 0.15) {
      const comp = allowedFuels.filter((f) => spec.compatibleFuels.includes(f));
      if (comp.length > 0) {
        mutated.fuelType = this.rng.choice(comp);
      }
    }

    return mutated;
  }

  private evaluateCandidate(
    candidate: CandidateSolution,
    context: VoyageParameters
  ): CandidateEvaluation {
    const spec = VESSEL_SPECS[candidate.vesselType];
    const fleetCount = candidate.fleetCount;
    const capacityPerShip = spec.defaultCapacity;
    const totalFleetCapacity = capacityPerShip * fleetCount;

    const cargoDemand = context.cargoDemandTonnes;
    const cargoLoadPercent = Math.min(
      100.0,
      totalFleetCapacity > 0 ? (cargoDemand / totalFleetCapacity) * 100.0 : 100.0
    );

    const singleShipVoyage: VoyageParameters = {
      ...context,
      vesselType: candidate.vesselType,
      capacityTonnes: capacityPerShip,
      enginePowerKw: spec.defaultPower,
      speedKnots: candidate.speedKnots,
      cargoLoadPercent,
      fuelType: candidate.fuelType,
      shorePower: candidate.shorePower,
    };

    const singleResult = predictVoyageMetrics(singleShipVoyage, this.overrides);

    const totalFuelL = singleResult.fuelConsumptionL * fleetCount;
    const totalFuelMassTonnes = singleResult.fuelMassTonnes * fleetCount;
    const totalFuelCostUsd = singleResult.fuelCostUsd * fleetCount;
    const totalFuelAndPowerCostUsd = singleResult.totalFuelAndPowerCostUsd * fleetCount;
    const totalTtwCo2e = singleResult.ttwCo2eTonnes * fleetCount;
    const totalWtwCo2e = singleResult.wtwCo2eTonnes * fleetCount;
    const totalCarbonCostUsd = singleResult.carbonCostUsd * fleetCount;
    const totalOperatingCostUsd = singleResult.totalOperatingCostUsd * fleetCount;
    const travelTimeHours = singleResult.travelTimeHours;

    // Constraints check
    const violations: string[] = [];
    let penalty = 0.0;

    if (totalFleetCapacity < cargoDemand) {
      const deficit = cargoDemand - totalFleetCapacity;
      violations.push(`Capacity deficit: ${deficit.toLocaleString()} tonnes short`);
      penalty += 15.0 * (deficit / cargoDemand);
    }

    if (
      candidate.speedKnots < spec.minSpeed - 0.01 ||
      candidate.speedKnots > spec.maxSpeed + 0.01
    ) {
      violations.push(`Speed outside envelope [${spec.minSpeed}, ${spec.maxSpeed}]`);
      penalty += 6.0;
    }

    const deadline = context.scheduleDeadlineHours || 48.0;
    if (travelTimeHours > deadline) {
      const delay = travelTimeHours - deadline;
      violations.push(`Schedule delay: ${delay.toFixed(1)} hrs over deadline`);
      penalty += 10.0 * (delay / deadline);
    }

    if (!spec.compatibleFuels.includes(candidate.fuelType)) {
      violations.push(`${candidate.fuelType} incompatible with ${candidate.vesselType}`);
      penalty += 25.0;
    }

    if (context.emissionCapTonnes && totalWtwCo2e > context.emissionCapTonnes) {
      const excess = totalWtwCo2e - context.emissionCapTonnes;
      violations.push(`Emissions cap exceeded: +${excess.toFixed(1)} t CO2e`);
      penalty += 8.0 * (excess / context.emissionCapTonnes);
    }

    const isFeasible = violations.length === 0;

    const normFuel = totalFuelL / 40000.0;
    const normCost = totalOperatingCostUsd / 45000.0;
    const normEmissions = totalWtwCo2e / 120.0;
    const normTime = travelTimeHours / 36.0;

    const weightedObjective =
      this.weights.fuel * normFuel +
      this.weights.cost * normCost +
      this.weights.emissions * normEmissions +
      this.weights.schedule * normTime;

    const fitnessScore = weightedObjective + penalty;

    return {
      candidate,
      fitnessScore: Math.round(fitnessScore * 10000) / 10000,
      weightedObjective: Math.round(weightedObjective * 10000) / 10000,
      isFeasible,
      violations,
      penalty: Math.round(penalty * 100) / 100,
      metrics: {
        fuelConsumptionL: Math.round(totalFuelL * 10) / 10,
        fuelMassTonnes: Math.round(totalFuelMassTonnes * 100) / 100,
        fuelCostUsd: Math.round(totalFuelCostUsd * 100) / 100,
        totalFuelAndPowerCostUsd: Math.round(totalFuelAndPowerCostUsd * 100) / 100,
        ttwCo2eTonnes: Math.round(totalTtwCo2e * 100) / 100,
        wtwCo2eTonnes: Math.round(totalWtwCo2e * 100) / 100,
        carbonCostUsd: Math.round(totalCarbonCostUsd * 100) / 100,
        totalOperatingCostUsd: Math.round(totalOperatingCostUsd * 100) / 100,
        travelTimeHours: Math.round(travelTimeHours * 10) / 10,
        totalFleetCapacity,
        cargoLoadPercent: Math.round(cargoLoadPercent * 10) / 10,
        fleetCount,
        vesselType: candidate.vesselType,
        fuelType: candidate.fuelType,
        cruisingSpeedKnots: candidate.speedKnots,
        shorePower: candidate.shorePower,
      },
    };
  }

  public async optimize(
    context: VoyageParameters,
    onProgress?: (step: number, total: number, status: string, bestScore: number) => void
  ): Promise<OptimizationResult> {
    const startTime = performance.now();

    const allowedVessels: VesselType[] = [
      "General Cargo",
      "Container Ship",
      "Bulk Carrier",
      "Oil Tanker",
      "Ro-Ro Ferry",
    ];
    const allowedFuels: FuelType[] = ["Diesel", "LNG", "Methanol", "Hydrogen", "Ammonia"];

    const minV = Math.min(...allowedVessels.map((v) => VESSEL_SPECS[v].minSpeed));
    const maxV = Math.max(...allowedVessels.map((v) => VESSEL_SPECS[v].maxSpeed));
    const speedBounds: [number, number] = [minV, maxV];

    // Initial random population
    let population: CandidateEvaluation[] = [];
    for (let i = 0; i < this.populationSize; i++) {
      const cand = this.sampleRandomCandidate(allowedVessels, allowedFuels, speedBounds);
      population.push(this.evaluateCandidate(cand, context));
    }

    population.sort((a, b) => a.fitnessScore - b.fitnessScore);
    let bestOverall = population[0];

    const convergenceHistory: ConvergencePoint[] = [];

    for (let it = 0; it < this.nIterations; it++) {
      const nextGen: CandidateEvaluation[] = [];

      // Elitism: retain top 20%
      const nElites = Math.max(2, Math.floor(0.2 * this.populationSize));
      nextGen.push(...population.slice(0, nElites));

      // Local mutation exploitation (50%)
      while (nextGen.length < Math.floor(0.7 * this.populationSize)) {
        const parent = this.rng.choice(population.slice(0, nElites));
        const mutated = this.mutateCandidate(parent.candidate, allowedVessels, allowedFuels);
        nextGen.push(this.evaluateCandidate(mutated, context));
      }

      // Random exploration (30%)
      while (nextGen.length < this.populationSize) {
        const rnd = this.sampleRandomCandidate(allowedVessels, allowedFuels, speedBounds);
        nextGen.push(this.evaluateCandidate(rnd, context));
      }

      population = nextGen.sort((a, b) => a.fitnessScore - b.fitnessScore);
      const currentGenBest = population[0];

      if (currentGenBest.isFeasible && !bestOverall.isFeasible) {
        bestOverall = currentGenBest;
      } else if (currentGenBest.isFeasible === bestOverall.isFeasible) {
        if (currentGenBest.fitnessScore < bestOverall.fitnessScore) {
          bestOverall = currentGenBest;
        }
      }

      const avgScore =
        population.reduce((sum, item) => sum + item.fitnessScore, 0) / population.length;

      convergenceHistory.push({
        iteration: it + 1,
        bestScore: Math.round(bestOverall.fitnessScore * 10000) / 10000,
        genBestScore: Math.round(currentGenBest.fitnessScore * 10000) / 10000,
        avgScore: Math.round(avgScore * 10000) / 10000,
        fuelL: bestOverall.metrics.fuelConsumptionL,
        costUsd: bestOverall.metrics.totalOperatingCostUsd,
        wtwCo2e: bestOverall.metrics.wtwCo2eTonnes,
        timeHours: bestOverall.metrics.travelTimeHours,
        isFeasible: bestOverall.isFeasible,
      });

      if (onProgress) {
        onProgress(it + 1, this.nIterations, "Classical local hill-climbing search", bestOverall.fitnessScore);
        if (it % 8 === 0) {
          await new Promise((r) => setTimeout(r, 15));
        }
      }
    }

    const endTime = performance.now();
    const runtimeSeconds = Math.round((endTime - startTime) / 10) / 100;

    const baseIndex = Math.max(
      40,
      Math.min(99, Math.round(100 - (bestOverall?.weightedObjective || 1.0) * 45))
    );
    const penaltyDeduction = bestOverall?.isFeasible ? 0 : 25;
    const optimizationScore = Math.max(20, baseIndex - penaltyDeduction);

    return {
      algorithm: "Classical Baseline (Random + Local Hill Climbing)",
      bestCandidate: bestOverall.candidate,
      bestScore: bestOverall.fitnessScore,
      isFeasible: bestOverall.isFeasible,
      violations: bestOverall.violations,
      metrics: bestOverall.metrics,
      convergenceHistory,
      runtimeSeconds,
      iterationsCompleted: this.nIterations,
      populationSize: this.populationSize,
      optimizationScore,
    };
  }
}
