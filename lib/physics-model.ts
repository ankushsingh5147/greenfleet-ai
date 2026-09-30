/**
 * GREENFLEET AI - Deterministic Hydrodynamic Fuel & Emissions Model
 *
 * Implements transparent, physically grounded marine engineering formulas:
 * - Admiralty cubic resistance power law: P ~ Displacement^(2/3) * Speed^3.15
 * - Aerodynamic and wave resistance scaling
 * - Fuel lower heating value (LHV) and density conversions
 * - IMO Tank-to-Wake and Well-to-Wake lifecycle GHG calculations
 * - Cold ironing (shore power) port hoteling economics
 */

import {
  VoyageParameters,
  PredictionResult,
  FuelType,
  FuelData,
} from "@/types";
import {
  VESSEL_SPECS,
  WEATHER_PROFILES,
  INITIAL_FUEL_DATA,
  SHORE_POWER_DEFAULTS,
  KNOTS_TO_KMH,
  DEFAULT_CARBON_PRICE_USD_TONNE,
} from "./config";

export interface FuelModelOverrides {
  customFuelPrices?: Partial<Record<FuelType, number>>;
  customFuelData?: Partial<Record<FuelType, Partial<FuelData>>>;
  carbonPriceUsdPerTonne?: number;
}

/**
 * Predicts fuel consumption and emissions for a single voyage profile.
 */
export function predictVoyageMetrics(
  params: VoyageParameters,
  overrides?: FuelModelOverrides
): PredictionResult {
  const spec = VESSEL_SPECS[params.vesselType] || VESSEL_SPECS["General Cargo"];
  const weather = WEATHER_PROFILES[params.weatherCondition] || WEATHER_PROFILES["Moderate"];

  // Merge active fuel configuration
  const fuelBase = INITIAL_FUEL_DATA[params.fuelType] || INITIAL_FUEL_DATA["Diesel"];
  const customData = overrides?.customFuelData?.[params.fuelType];
  const activeFuel: FuelData = {
    ...fuelBase,
    ...customData,
    defaultPriceUsdPerTonne:
      overrides?.customFuelPrices?.[params.fuelType] ??
      customData?.defaultPriceUsdPerTonne ??
      fuelBase.defaultPriceUsdPerTonne,
  };

  // 1. Effective speed accounting for currents
  const effectiveSpeedKnots = Math.max(
    5.0,
    params.speedKnots - 0.5 * (params.currentSpeedKnots || 0)
  );

  // 2. Travel time at sea (hours)
  const speedKmh = Math.max(4.0, params.speedKnots) * KNOTS_TO_KMH;
  const travelTimeHours = params.distanceKm / speedKmh;

  // 3. Design speed ratio and displacement ratio
  const designSpeed = spec.defaultSpeed;
  const speedRatio = effectiveSpeedKnots / designSpeed;

  // Displacement = Lightweight (approx 28% capacity) + Deadweight carried
  const capacity = params.capacityTonnes || spec.defaultCapacity;
  const loadPercent = Math.min(100.0, Math.max(10.0, params.cargoLoadPercent || 70.0));
  const lightweight = capacity * 0.28;
  const actualDisplacement = lightweight + capacity * (loadPercent / 100.0);
  const baselineDisplacement = lightweight + capacity * 0.7;
  const displacementRatio = Math.pow(actualDisplacement / baselineDisplacement, 2.0 / 3.0);

  // 4. Environmental Resistance Multipliers
  const windMs = Math.max(0, params.windSpeedMs || 10.0);
  const waveM = Math.max(0, params.waveHeightM || 1.8);
  const airDrag = 1.0 + 0.0008 * Math.pow(windMs, 2);
  const waveAddedResistance = 1.0 + 0.045 * Math.pow(waveM, 1.6);
  const envResFactor = airDrag * waveAddedResistance * weather.resistanceFactor;

  // 5. Effective Propulsion Power (kW)
  // Ships typically operate around 65-85% Maximum Continuous Rating (MCR)
  const enginePowerKw = params.enginePowerKw || spec.defaultPower;
  const routeFactor = params.routeFactor || 1.05;
  const rawPowerKw =
    enginePowerKw *
    0.72 *
    Math.pow(speedRatio, 3.15) *
    displacementRatio *
    envResFactor *
    routeFactor;

  // Clip within physical bounds (15% idle to 105% maximum overload)
  const requiredPropulsionPowerKw = Math.min(
    enginePowerKw * 1.05,
    Math.max(enginePowerKw * 0.15, rawPowerKw)
  );

  // Auxiliary power for navigation, cooling, hoteling
  const auxFactor = loadPercent > 80 ? 1.1 : 1.0;
  const auxPowerKw = spec.hotelPowerKw * auxFactor;
  const totalOperatingPowerKw = requiredPropulsionPowerKw + auxPowerKw;

  // 6. Energy Consumption at Sea (MegaJoules)
  // Marine 2-stroke / 4-stroke efficiency ~48% -> ~7,500 kJ per kWh
  const propulsionEnergyMj = totalOperatingPowerKw * travelTimeHours * 7.5;

  // 7. Port Hoteling Energy & Shore Power
  const portHours = SHORE_POWER_DEFAULTS.averagePortHours;
  let portFuelMassKg = 0.0;
  let shoreEnergyKwh = 0.0;
  let shoreCostUsd = 0.0;
  let shoreCo2eTonnes = 0.0;

  if (params.shorePower) {
    // Cold Ironing: Auxiliary generator shut down, 100% powered by port grid
    shoreEnergyKwh = spec.hotelPowerKw * portHours;
    shoreCostUsd = shoreEnergyKwh * SHORE_POWER_DEFAULTS.defaultPriceUsdPerKwh;
    shoreCo2eTonnes =
      (shoreEnergyKwh * SHORE_POWER_DEFAULTS.gridEmissionFactorKgPerKwh) / 1000.0;
    portFuelMassKg = 0.0;
  } else {
    // Auxiliary engines running on marine fuel in port
    const portEnergyMj = spec.hotelPowerKw * portHours * 8.2;
    portFuelMassKg = portEnergyMj / activeFuel.lhvMjKg;
  }

  // 8. Fuel Consumption Mass & Volume
  const voyageFuelMassKg = propulsionEnergyMj / activeFuel.lhvMjKg + portFuelMassKg;
  const fuelMassTonnes = voyageFuelMassKg / 1000.0;
  const fuelConsumptionL = Math.max(20.0, voyageFuelMassKg / activeFuel.densityKgL);

  // 9. Voyage Fuel Cost
  const fuelCostUsd = fuelMassTonnes * activeFuel.defaultPriceUsdPerTonne;
  const totalFuelAndPowerCostUsd = fuelCostUsd + shoreCostUsd;

  // 10. Emissions Accounting
  // Tank-to-Wake (TTW) direct exhaust emissions (tonnes CO2e)
  const ttwCo2eTonnes = fuelMassTonnes * activeFuel.ttwFactor;

  // Well-to-Wake (WTW) lifecycle emissions (tonnes CO2e)
  const marineWtwCo2eTonnes = ttwCo2eTonnes * activeFuel.wtwMultiplier;
  const totalWtwCo2eTonnes = marineWtwCo2eTonnes + shoreCo2eTonnes;

  // 11. Carbon Tax Liability
  const carbonPrice =
    overrides?.carbonPriceUsdPerTonne ??
    params.carbonPriceUsdPerTonne ??
    DEFAULT_CARBON_PRICE_USD_TONNE;
  const carbonCostUsd = totalWtwCo2eTonnes * carbonPrice;
  const totalOperatingCostUsd = totalFuelAndPowerCostUsd + carbonCostUsd;

  // 12. Confidence Score (based on speed & load operational envelope adherence)
  let confidence = 94.0;
  if (params.speedKnots < spec.minSpeed || params.speedKnots > spec.maxSpeed) {
    confidence -= 18.0;
  }
  if (params.weatherCondition === "Storm") {
    confidence -= 8.0;
  }
  if (loadPercent > 95.0) {
    confidence -= 5.0;
  }
  const confidenceScore = Math.max(65.0, Math.min(99.0, confidence));

  return {
    vesselType: params.vesselType,
    fuelType: params.fuelType,
    fuelConsumptionL: Math.round(fuelConsumptionL * 10) / 10,
    fuelMassTonnes: Math.round(fuelMassTonnes * 100) / 100,
    fuelCostUsd: Math.round(fuelCostUsd * 100) / 100,
    shorePowerActive: params.shorePower,
    shoreEnergyKwh: Math.round(shoreEnergyKwh * 10) / 10,
    shoreCostUsd: Math.round(shoreCostUsd * 100) / 100,
    shoreCo2eTonnes: Math.round(shoreCo2eTonnes * 100) / 100,
    totalFuelAndPowerCostUsd: Math.round(totalFuelAndPowerCostUsd * 100) / 100,
    ttwCo2eTonnes: Math.round(ttwCo2eTonnes * 100) / 100,
    wtwCo2eTonnes: Math.round(totalWtwCo2eTonnes * 100) / 100,
    carbonCostUsd: Math.round(carbonCostUsd * 100) / 100,
    totalOperatingCostUsd: Math.round(totalOperatingCostUsd * 100) / 100,
    travelTimeHours: Math.round(travelTimeHours * 10) / 10,
    effectiveSpeedKnots: Math.round(effectiveSpeedKnots * 10) / 10,
    propulsionEnergyMj: Math.round(propulsionEnergyMj),
    confidenceScore: Math.round(confidenceScore),
    modelMetadata: "Prototype analytical prediction model",
  };
}

/**
 * Calculates sensitivity sweeps for Scenario Lab charts.
 */
export function generateSensitivityCurve(
  baseParams: VoyageParameters,
  paramName: "speed" | "cargo" | "fuelPrice" | "distance",
  overrides?: FuelModelOverrides
) {
  const points = [];
  const spec = VESSEL_SPECS[baseParams.vesselType];

  if (paramName === "speed") {
    const minS = Math.max(8.0, spec.minSpeed - 2.0);
    const maxS = spec.maxSpeed + 1.0;
    const step = (maxS - minS) / 8;
    for (let s = minS; s <= maxS + 0.01; s += step) {
      const p = predictVoyageMetrics({ ...baseParams, speedKnots: s }, overrides);
      points.push({
        label: `${s.toFixed(1)} kn`,
        speed: Math.round(s * 10) / 10,
        fuelL: p.fuelConsumptionL,
        costUsd: p.totalOperatingCostUsd,
        emissions: p.wtwCo2eTonnes,
        timeHours: p.travelTimeHours,
      });
    }
  } else if (paramName === "cargo") {
    for (let c = 20; c <= 100; c += 10) {
      const p = predictVoyageMetrics({ ...baseParams, cargoLoadPercent: c }, overrides);
      points.push({
        label: `${c}%`,
        cargoPercent: c,
        fuelL: p.fuelConsumptionL,
        costUsd: p.totalOperatingCostUsd,
        emissions: p.wtwCo2eTonnes,
      });
    }
  } else if (paramName === "fuelPrice") {
    const prices = [500, 700, 900, 1100, 1300, 1500, 1800];
    for (const pr of prices) {
      const p = predictVoyageMetrics(baseParams, {
        ...overrides,
        customFuelPrices: { [baseParams.fuelType]: pr },
      });
      points.push({
        label: `$${pr}/t`,
        price: pr,
        costUsd: p.totalOperatingCostUsd,
        fuelCost: p.fuelCostUsd,
      });
    }
  } else if (paramName === "distance") {
    for (let d = 300; d <= 3000; d += 450) {
      const p = predictVoyageMetrics({ ...baseParams, distanceKm: d }, overrides);
      points.push({
        label: `${d} km`,
        distance: d,
        fuelL: p.fuelConsumptionL,
        costUsd: p.totalOperatingCostUsd,
        timeHours: p.travelTimeHours,
      });
    }
  }

  return points;
}
