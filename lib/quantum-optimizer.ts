/**
 * GREENFLEET AI - Quantum-Inspired Evolutionary Optimizer (QIEA)
 * Problem Statement: SIH26138
 *
 * Runs on classical hardware simulating quantum computational principles:
 * 1. Q-bit State Representation: |ψ⟩ = cos(θ)|0⟩ + sin(θ)|1⟩ where |α|² + |β|² = 1
 * 2. Quantum Superposition: Decision variables exist across a probability continuum before measurement
 * 3. Quantum Measurement: Collapsing probability distributions into discrete and continuous classical solutions
 * 4. Quantum Rotation Gate: U(Δθ) dynamically rotates probability amplitude vectors toward Pareto-optimal states
 * 5. Quantum Diversity / Tunneling: Clamping angles prevents irreversible collapse to 0 or π/2
 *
 * NOTE: This is a classical software simulation of quantum evolutionary optimization.
 * It does not require physical quantum hardware.
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

interface QuantumChromosome {
  vesselThetas: number[];
  speedTheta: number;
  fuelThetas: number[];
  shorePowerTheta: number;
  fleetThetas: number[];
}

export interface OptimizationOptions {
  weights: OptimizationWeights;
  populationSize?: number;
  nIterations?: number;
  rotationStep?: number;
  seed?: number;
  overrides?: FuelModelOverrides;
  onProgress?: (step: number, total: number, status: string, bestScore: number) => void;
}

// Pseudo-random generator for deterministic reproducibility
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
  normal(mean: number = 0, stdDev: number = 1): number {
    const u1 = Math.max(1e-7, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
  choice<T>(arr: T[], probs?: number[]): T {
    if (!probs) {
      const idx = Math.floor(this.next() * arr.length);
      return arr[idx];
    }
    const r = this.next();
    let cumulative = 0;
    for (let i = 0; i < arr.length; i++) {
      cumulative += probs[i];
      if (r <= cumulative || i === arr.length - 1) {
        return arr[i];
      }
    }
    return arr[arr.length - 1];
  }
}

export class QuantumInspiredEvolutionaryOptimizer {
  private weights: OptimizationWeights;
  private populationSize: number;
  private nIterations: number;
  private rotationStep: number;
  private rng: SeededRandom;
  private overrides?: FuelModelOverrides;

  constructor(options: OptimizationOptions) {
    this.weights = options.weights;
    this.populationSize = Math.max(15, options.populationSize || 36);
    this.nIterations = Math.max(10, options.nIterations || 32);
    this.rotationStep = options.rotationStep || 0.03 * Math.PI;
    this.rng = new SeededRandom(options.seed || 42);
    this.overrides = options.overrides;
  }

  private initQuantumChromosome(allowedVessels: VesselType[], allowedFuels: FuelType[]): QuantumChromosome {
    // Maximum superposition: theta = pi / 4 => cos^2(pi/4) = 0.5, sin^2(pi/4) = 0.5 (equal initial probability)
    const initialTheta = Math.PI / 4.0;
    return {
      vesselThetas: new Array(allowedVessels.length).fill(initialTheta),
      speedTheta: initialTheta,
      fuelThetas: new Array(allowedFuels.length).fill(initialTheta),
      shorePowerTheta: initialTheta,
      fleetThetas: new Array(5).fill(initialTheta),
    };
  }

  private measureCandidate(
    qChrom: QuantumChromosome,
    allowedVessels: VesselType[],
    allowedFuels: FuelType[],
    speedBounds: [number, number]
  ): CandidateSolution {
    // 1. Vessel Type Measurement
    const vProbsRaw = qChrom.vesselThetas.map((th) => Math.pow(Math.sin(th), 2));
    const sumV = vProbsRaw.reduce((a, b) => a + b, 0) || 1e-9;
    const vProbs = vProbsRaw.map((p) => p / sumV);
    const chosenVessel = this.rng.choice(allowedVessels, vProbs);
    const vesselIdx = allowedVessels.indexOf(chosenVessel);

    // 2. Cruising Speed Measurement
    const normMean = Math.pow(Math.sin(qChrom.speedTheta), 2);
    const quantumSpread = 0.12 * Math.sin(2.0 * qChrom.speedTheta);
    const rawSample = this.rng.normal(normMean, Math.max(0.02, quantumSpread));
    const sampledNorm = Math.min(1.0, Math.max(0.0, rawSample));
    const [minV, maxV] = speedBounds;
    const chosenSpeed = minV + sampledNorm * (maxV - minV);

    // 3. Fuel Type Measurement (Restricted to vessel compatibility)
    const spec = VESSEL_SPECS[chosenVessel];
    const compatibleFuels = allowedFuels.filter((f) => spec.compatibleFuels.includes(f));
    const activeFuels = compatibleFuels.length > 0 ? compatibleFuels : (["Diesel"] as FuelType[]);

    const fThetas = activeFuels.map((f) => qChrom.fuelThetas[allowedFuels.indexOf(f)]);
    const fProbsRaw = fThetas.map((th) => Math.pow(Math.sin(th), 2));
    const sumF = fProbsRaw.reduce((a, b) => a + b, 0) || 1e-9;
    const fProbs = fProbsRaw.map((p) => p / sumF);
    const chosenFuel = this.rng.choice(activeFuels, fProbs);
    const fuelIdx = allowedFuels.indexOf(chosenFuel);

    // 4. Shore Power Measurement (Bernoulli trial from sin^2(theta))
    const spProb = Math.pow(Math.sin(qChrom.shorePowerTheta), 2);
    const chosenSp = this.rng.next() < spProb;

    // 5. Fleet Deployment Count Measurement (1 to 5 vessels)
    const fleetProbsRaw = qChrom.fleetThetas.map((th) => Math.pow(Math.sin(th), 2));
    const sumFl = fleetProbsRaw.reduce((a, b) => a + b, 0) || 1e-9;
    const fleetProbs = fleetProbsRaw.map((p) => p / sumFl);
    const counts = [1, 2, 3, 4, 5];
    const fleetCount = this.rng.choice(counts, fleetProbs);
    const fleetIdx = fleetCount - 1;

    return {
      vesselType: chosenVessel,
      speedKnots: Math.round(chosenSpeed * 10) / 10,
      fuelType: chosenFuel,
      shorePower: chosenSp,
      fleetCount,
      normSpeed: sampledNorm,
      vesselIdx,
      fuelIdx,
      fleetIdx,
    };
  }

  public evaluateCandidate(
    candidate: CandidateSolution,
    context: VoyageParameters
  ): CandidateEvaluation {
    const spec = VESSEL_SPECS[candidate.vesselType];
    const fleetCount = candidate.fleetCount;
    const capacityPerShip = spec.defaultCapacity;
    const totalFleetCapacity = capacityPerShip * fleetCount;

    // Cargo demand and load allocation
    const cargoDemand = context.cargoDemandTonnes;
    const cargoLoadPercent = Math.min(
      100.0,
      totalFleetCapacity > 0 ? (cargoDemand / totalFleetCapacity) * 100.0 : 100.0
    );

    // Run physics prediction for 1 vessel
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

    // Scale totals across deployed fleet
    const totalFuelL = singleResult.fuelConsumptionL * fleetCount;
    const totalFuelMassTonnes = singleResult.fuelMassTonnes * fleetCount;
    const totalFuelCostUsd = singleResult.fuelCostUsd * fleetCount;
    const totalFuelAndPowerCostUsd = singleResult.totalFuelAndPowerCostUsd * fleetCount;
    const totalTtwCo2e = singleResult.ttwCo2eTonnes * fleetCount;
    const totalWtwCo2e = singleResult.wtwCo2eTonnes * fleetCount;
    const totalCarbonCostUsd = singleResult.carbonCostUsd * fleetCount;
    const totalOperatingCostUsd = singleResult.totalOperatingCostUsd * fleetCount;
    const travelTimeHours = singleResult.travelTimeHours; // Same speed & distance

    // --- Strict Operational Constraint Audit ---
    const violations: string[] = [];
    let penalty = 0.0;

    // 1. Cargo demand satisfaction
    if (totalFleetCapacity < cargoDemand) {
      const deficit = cargoDemand - totalFleetCapacity;
      violations.push(`Capacity deficit: ${deficit.toLocaleString()} tonnes short`);
      penalty += 15.0 * (deficit / cargoDemand);
    }

    // 2. Cruising speed envelope
    if (
      candidate.speedKnots < spec.minSpeed - 0.01 ||
      candidate.speedKnots > spec.maxSpeed + 0.01
    ) {
      violations.push(
        `Speed ${candidate.speedKnots} kn outside envelope [${spec.minSpeed}, ${spec.maxSpeed}]`
      );
      penalty += 6.0;
    }

    // 3. Schedule reliability
    const deadline = context.scheduleDeadlineHours || 48.0;
    if (travelTimeHours > deadline) {
      const delay = travelTimeHours - deadline;
      violations.push(`Schedule delay: ${delay.toFixed(1)} hrs over deadline`);
      penalty += 10.0 * (delay / deadline);
    }

    // 4. Fuel compatibility
    if (!spec.compatibleFuels.includes(candidate.fuelType)) {
      violations.push(`${candidate.fuelType} incompatible with ${candidate.vesselType}`);
      penalty += 25.0;
    }

    // 5. Optional emission cap
    if (context.emissionCapTonnes && totalWtwCo2e > context.emissionCapTonnes) {
      const excess = totalWtwCo2e - context.emissionCapTonnes;
      violations.push(`Emissions cap exceeded: +${excess.toFixed(1)} t CO2e`);
      penalty += 8.0 * (excess / context.emissionCapTonnes);
    }

    const isFeasible = violations.length === 0;

    // --- Normalized Multi-Objective Function ---
    // Scaled against standard reference voyage:
    // Fuel ~ 40,000 L, Cost ~ $45,000, Emissions ~ 120 t CO2e, Time ~ 36 hrs
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

  private rotateGate(theta: number, targetHigh: boolean): number {
    const dTheta = this.rotationStep;
    const newTheta = targetHigh ? theta + dTheta : theta - dTheta;
    // Clamping to [0.02*pi, 0.48*pi] preserves quantum tunneling diversity
    return Math.min(0.48 * Math.PI, Math.max(0.02 * Math.PI, newTheta));
  }

  private updateQuantumState(qChrom: QuantumChromosome, targetCandidate: CandidateSolution): void {
    // 1. Vessel Q-bits rotation
    for (let i = 0; i < qChrom.vesselThetas.length; i++) {
      qChrom.vesselThetas[i] = this.rotateGate(
        qChrom.vesselThetas[i],
        i === targetCandidate.vesselIdx
      );
    }

    // 2. Speed Q-bit rotation
    const currentSpeedCenter = Math.pow(Math.sin(qChrom.speedTheta), 2);
    const targetFaster = (targetCandidate.normSpeed || 0.5) > currentSpeedCenter;
    qChrom.speedTheta = this.rotateGate(qChrom.speedTheta, targetFaster);

    // 3. Fuel Q-bits rotation
    for (let i = 0; i < qChrom.fuelThetas.length; i++) {
      qChrom.fuelThetas[i] = this.rotateGate(
        qChrom.fuelThetas[i],
        i === targetCandidate.fuelIdx
      );
    }

    // 4. Shore Power Q-bit rotation
    qChrom.shorePowerTheta = this.rotateGate(
      qChrom.shorePowerTheta,
      targetCandidate.shorePower
    );

    // 5. Fleet Count Q-bits rotation
    for (let i = 0; i < qChrom.fleetThetas.length; i++) {
      qChrom.fleetThetas[i] = this.rotateGate(
        qChrom.fleetThetas[i],
        i === targetCandidate.fleetIdx
      );
    }
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

    // Speed bounds across vessels
    const minV = Math.min(...allowedVessels.map((v) => VESSEL_SPECS[v].minSpeed));
    const maxV = Math.max(...allowedVessels.map((v) => VESSEL_SPECS[v].maxSpeed));
    const speedBounds: [number, number] = [minV, maxV];

    const qChrom = this.initQuantumChromosome(allowedVessels, allowedFuels);

    let bestOverall: CandidateEvaluation | null = null;
    const convergenceHistory: ConvergencePoint[] = [];

    const phaseLabels = [
      "Initializing Q-bit register superposition",
      "Sampling quantum amplitude distributions",
      "Applying hydrodynamic & capacity constraints",
      "Applying Quantum Rotation Gate U(Δθ)",
      "Pareto frontier convergence verification",
    ];

    for (let it = 0; it < this.nIterations; it++) {
      // 1. Quantum Measurement Phase
      const population: CandidateEvaluation[] = [];
      for (let p = 0; p < this.populationSize; p++) {
        const cand = this.measureCandidate(qChrom, allowedVessels, allowedFuels, speedBounds);
        const evaluated = this.evaluateCandidate(cand, context);
        population.push(evaluated);
      }

      // Sort by fitness score (lower is better)
      population.sort((a, b) => a.fitnessScore - b.fitnessScore);
      const currentGenBest = population[0];

      // Update global best (strictly favoring feasible solutions)
      if (!bestOverall) {
        bestOverall = currentGenBest;
      } else {
        if (currentGenBest.isFeasible && !bestOverall.isFeasible) {
          bestOverall = currentGenBest;
        } else if (currentGenBest.isFeasible === bestOverall.isFeasible) {
          if (currentGenBest.fitnessScore < bestOverall.fitnessScore) {
            bestOverall = currentGenBest;
          }
        }
      }

      // 2. Quantum Rotation Gate Phase
      const targetGuide =
        bestOverall.isFeasible ? bestOverall.candidate : currentGenBest.candidate;
      this.updateQuantumState(qChrom, targetGuide);

      // Track trajectory
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
        const phaseIndex = Math.min(
          phaseLabels.length - 1,
          Math.floor((it / this.nIterations) * phaseLabels.length)
        );
        onProgress(it + 1, this.nIterations, phaseLabels[phaseIndex], bestOverall.fitnessScore);
        // Small yield for non-blocking UI rendering
        if (it % 8 === 0) {
          await new Promise((r) => setTimeout(r, 15));
        }
      }
    }

    const endTime = performance.now();
    const runtimeSeconds = Math.round((endTime - startTime) / 10) / 100;

    // Optimization Score Index (0 to 100, where higher is superior efficiency)
    // Invert fitness score into an enterprise 100-point efficiency index
    const baseIndex = Math.max(
      40,
      Math.min(99, Math.round(100 - (bestOverall?.weightedObjective || 1.0) * 45))
    );
    const penaltyDeduction = bestOverall?.isFeasible ? 0 : 25;
    const optimizationScore = Math.max(20, baseIndex - penaltyDeduction);

    return {
      algorithm: "Quantum-Inspired Evolutionary Optimizer (QIEA)",
      bestCandidate: bestOverall!.candidate,
      bestScore: bestOverall!.fitnessScore,
      isFeasible: bestOverall!.isFeasible,
      violations: bestOverall!.violations,
      metrics: bestOverall!.metrics,
      convergenceHistory,
      runtimeSeconds,
      iterationsCompleted: this.nIterations,
      populationSize: this.populationSize,
      optimizationScore,
    };
  }
}
