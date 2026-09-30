/**
 * GREENFLEET AI - Domain Type Definitions
 * SIH 2026 Submission - Problem Statement: SIH26138
 */

export type VesselType =
  | "General Cargo"
  | "Container Ship"
  | "Bulk Carrier"
  | "Oil Tanker"
  | "Ro-Ro Ferry";

export type FuelType =
  | "Diesel"
  | "LNG"
  | "Methanol"
  | "Hydrogen"
  | "Ammonia";

export type WeatherCondition =
  | "Calm"
  | "Moderate"
  | "Rough"
  | "Storm";

export interface VesselSpec {
  description: string;
  minCapacity: number;
  maxCapacity: number;
  defaultCapacity: number;
  minPower: number;
  maxPower: number;
  defaultPower: number;
  minSpeed: number;
  maxSpeed: number;
  defaultSpeed: number;
  compatibleFuels: FuelType[];
  hotelPowerKw: number;
  capacityUnit: string;
  dwtTypical: number;
}

export interface FuelData {
  displayName: string;
  lhvMjKg: number;
  densityKgL: number;
  defaultPriceUsdPerTonne: number;
  ttwFactor: number; // Tank-to-Wake (kg CO2e / kg fuel)
  wtwMultiplier: number; // Well-to-Wake lifecycle multiplier
  relativeVolumeFactor: number;
  maturity: string;
  description: string;
  colorHex: string;
}

export interface WeatherProfile {
  windSpeedRange: [number, number];
  waveHeightRange: [number, number];
  currentSpeedRange: [number, number];
  resistanceFactor: number;
  description: string;
}

export interface ShorePowerDefaults {
  defaultPriceUsdPerKwh: number;
  gridEmissionFactorKgPerKwh: number;
  averagePortHours: number;
  dieselAuxBurnRateLPerHour: number;
}

export interface OptimizationWeights {
  fuel: number;
  cost: number;
  emissions: number;
  schedule: number;
}

export interface VoyageParameters {
  vesselType: VesselType;
  capacityTonnes: number;
  enginePowerKw: number;
  speedKnots: number;
  distanceKm: number;
  cargoDemandTonnes: number;
  cargoLoadPercent: number;
  windSpeedMs: number;
  waveHeightM: number;
  currentSpeedKnots: number;
  weatherCondition: WeatherCondition;
  routeFactor: number;
  fuelType: FuelType;
  shorePower: boolean;
  scheduleDeadlineHours: number;
  emissionCapTonnes: number | null;
  carbonPriceUsdPerTonne: number;
}

export interface PredictionResult {
  vesselType: VesselType;
  fuelType: FuelType;
  fuelConsumptionL: number;
  fuelMassTonnes: number;
  fuelCostUsd: number;
  shorePowerActive: boolean;
  shoreEnergyKwh: number;
  shoreCostUsd: number;
  shoreCo2eTonnes: number;
  totalFuelAndPowerCostUsd: number;
  ttwCo2eTonnes: number;
  wtwCo2eTonnes: number;
  carbonCostUsd: number;
  totalOperatingCostUsd: number;
  travelTimeHours: number;
  effectiveSpeedKnots: number;
  propulsionEnergyMj: number;
  confidenceScore: number; // 0-100
  modelMetadata: string;
}

export interface CandidateSolution {
  vesselType: VesselType;
  speedKnots: number;
  fuelType: FuelType;
  shorePower: boolean;
  fleetCount: number;
  normSpeed?: number;
  vesselIdx?: number;
  fuelIdx?: number;
  fleetIdx?: number;
}

export interface CandidateEvaluation {
  candidate: CandidateSolution;
  fitnessScore: number;
  weightedObjective: number;
  isFeasible: boolean;
  violations: string[];
  penalty: number;
  metrics: {
    fuelConsumptionL: number;
    fuelMassTonnes: number;
    fuelCostUsd: number;
    totalFuelAndPowerCostUsd: number;
    ttwCo2eTonnes: number;
    wtwCo2eTonnes: number;
    carbonCostUsd: number;
    totalOperatingCostUsd: number;
    travelTimeHours: number;
    totalFleetCapacity: number;
    cargoLoadPercent: number;
    fleetCount: number;
    vesselType: VesselType;
    fuelType: FuelType;
    cruisingSpeedKnots: number;
    shorePower: boolean;
  };
}

export interface ConvergencePoint {
  iteration: number;
  bestScore: number;
  genBestScore: number;
  avgScore: number;
  fuelL: number;
  costUsd: number;
  wtwCo2e: number;
  timeHours: number;
  isFeasible: boolean;
}

export interface OptimizationResult {
  algorithm: string;
  bestCandidate: CandidateSolution;
  bestScore: number;
  isFeasible: boolean;
  violations: string[];
  metrics: CandidateEvaluation["metrics"];
  convergenceHistory: ConvergencePoint[];
  runtimeSeconds: number;
  iterationsCompleted: number;
  populationSize: number;
  optimizationScore: number; // 0-100 index
}

export interface BenchmarkComparison {
  quantumResult: OptimizationResult;
  classicalResult: OptimizationResult;
  summaryRows: {
    metric: string;
    classicalValue: number | string;
    quantumValue: number | string;
    differencePercent: number | string;
    betterAlgorithm: string;
    unit?: string;
  }[];
  convergencePoints: {
    iteration: number;
    quantumBest: number;
    classicalBest: number;
  }[];
}

export interface PresetScenario {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  vesselType: VesselType;
  distanceKm: number;
  cargoDemandTonnes: number;
  speedKnots: number;
  weatherCondition: WeatherCondition;
  fuelType: FuelType;
  shorePower: boolean;
  carbonPriceUsdPerTonne: number;
  customFuelPrices?: Partial<Record<FuelType, number>>;
  weights?: OptimizationWeights;
}

export interface PortLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  hasShorePower: boolean;
  bunkeringFuels: FuelType[];
}
