/**
 * GREENFLEET AI - Central Configuration and Constants
 */

import {
  VesselType,
  FuelType,
  WeatherCondition,
  VesselSpec,
  FuelData,
  WeatherProfile,
  ShorePowerDefaults,
  OptimizationWeights,
  VoyageParameters,
  PresetScenario,
  PortLocation,
} from "@/types";

export const KNOTS_TO_KMH = 1.852;
export const DEFAULT_CARBON_PRICE_USD_TONNE = 80.0;

export const VESSEL_SPECS: Record<VesselType, VesselSpec> = {
  "General Cargo": {
    description: "Multipurpose breakbulk & general cargo freighter",
    minCapacity: 3000,
    maxCapacity: 15000,
    defaultCapacity: 10000,
    minPower: 3000,
    maxPower: 10000,
    defaultPower: 6500,
    minSpeed: 10.0,
    maxSpeed: 19.0,
    defaultSpeed: 15.0,
    compatibleFuels: ["Diesel", "LNG", "Methanol", "Hydrogen", "Ammonia"],
    hotelPowerKw: 400.0,
    capacityUnit: "Tonnes DWT",
    dwtTypical: 10000,
  },
  "Container Ship": {
    description: "High-speed cellular container liner (Sub-Panamax / Panamax)",
    minCapacity: 10000,
    maxCapacity: 60000,
    defaultCapacity: 30000,
    minPower: 15000,
    maxPower: 55000,
    defaultPower: 32000,
    minSpeed: 13.0,
    maxSpeed: 24.0,
    defaultSpeed: 19.5,
    compatibleFuels: ["Diesel", "LNG", "Methanol", "Hydrogen"],
    hotelPowerKw: 1200.0,
    capacityUnit: "TEU Equivalent (DWT)",
    dwtTypical: 30000,
  },
  "Bulk Carrier": {
    description: "Dry bulk carrier for ore, grain, coal and mineral transport",
    minCapacity: 20000,
    maxCapacity: 90000,
    defaultCapacity: 55000,
    minPower: 7000,
    maxPower: 18000,
    defaultPower: 11000,
    minSpeed: 10.0,
    maxSpeed: 16.5,
    defaultSpeed: 13.5,
    compatibleFuels: ["Diesel", "LNG", "Methanol", "Ammonia"],
    hotelPowerKw: 500.0,
    capacityUnit: "Tonnes DWT",
    dwtTypical: 55000,
  },
  "Oil Tanker": {
    description: "Liquid bulk crude & refined petroleum product carrier",
    minCapacity: 25000,
    maxCapacity: 110000,
    defaultCapacity: 70000,
    minPower: 9000,
    maxPower: 24000,
    defaultPower: 15000,
    minSpeed: 10.5,
    maxSpeed: 16.5,
    defaultSpeed: 14.0,
    compatibleFuels: ["Diesel", "LNG", "Methanol", "Ammonia"],
    hotelPowerKw: 750.0,
    capacityUnit: "Tonnes DWT",
    dwtTypical: 70000,
  },
  "Ro-Ro Ferry": {
    description: "Roll-on/roll-off passenger vehicle and rolling freight vessel",
    minCapacity: 2000,
    maxCapacity: 12000,
    defaultCapacity: 6000,
    minPower: 8000,
    maxPower: 26000,
    defaultPower: 16000,
    minSpeed: 14.0,
    maxSpeed: 23.0,
    defaultSpeed: 18.5,
    compatibleFuels: ["Diesel", "LNG", "Methanol", "Hydrogen"],
    hotelPowerKw: 900.0,
    capacityUnit: "Lane Meters / DWT",
    dwtTypical: 6000,
  },
};

export const WEATHER_PROFILES: Record<WeatherCondition, WeatherProfile> = {
  Calm: {
    windSpeedRange: [1.0, 7.0],
    waveHeightRange: [0.2, 1.2],
    currentSpeedRange: [-0.8, 0.8],
    resistanceFactor: 1.0,
    description: "Smooth sea state (Beaufort 1-3). Negligible wind and wave resistance.",
  },
  Moderate: {
    windSpeedRange: [7.0, 15.0],
    waveHeightRange: [1.2, 2.8],
    currentSpeedRange: [-1.5, 1.5],
    resistanceFactor: 1.15,
    description: "Moderate sea with whitecaps (Beaufort 4-5). +15% resistance penalty.",
  },
  Rough: {
    windSpeedRange: [15.0, 23.0],
    waveHeightRange: [2.8, 5.0],
    currentSpeedRange: [-2.5, 2.5],
    resistanceFactor: 1.35,
    description: "Rough sea with heavy swells (Beaufort 6-7). +35% resistance penalty.",
  },
  Storm: {
    windSpeedRange: [23.0, 34.0],
    waveHeightRange: [5.0, 8.5],
    currentSpeedRange: [-3.5, 3.5],
    resistanceFactor: 1.7,
    description: "Gale/Severe storm (Beaufort 8+). High air drag and wave resistance (+70%).",
  },
};

export const INITIAL_FUEL_DATA: Record<FuelType, FuelData> = {
  Diesel: {
    displayName: "Marine Gas Oil (MGO / Diesel)",
    lhvMjKg: 42.7,
    densityKgL: 0.85,
    defaultPriceUsdPerTonne: 820.0,
    ttwFactor: 3.17, // IMO Tank-to-Wake kg CO2e / kg fuel
    wtwMultiplier: 1.22, // Lifecycle Well-to-Wake multiplier (+22% upstream)
    relativeVolumeFactor: 1.0,
    maturity: "Commercial Standard",
    description: "Conventional marine fossil fuel; high emissions, subject to IMO carbon taxation.",
    colorHex: "#f59e0b", // Amber
  },
  LNG: {
    displayName: "Liquefied Natural Gas (LNG)",
    lhvMjKg: 49.0,
    densityKgL: 0.45,
    defaultPriceUsdPerTonne: 780.0,
    ttwFactor: 2.75, // Factoring combustion CO2 and controlled methane slip
    wtwMultiplier: 1.18,
    relativeVolumeFactor: 1.7,
    maturity: "Commercial Transition",
    description: "Fossil transition fuel; lower SOx/NOx and -20% direct CO2, but methane slip must be mitigated.",
    colorHex: "#06b6d4", // Cyan
  },
  Methanol: {
    displayName: "E-Methanol / Bio-Methanol",
    lhvMjKg: 19.9,
    densityKgL: 0.79,
    defaultPriceUsdPerTonne: 650.0,
    ttwFactor: 1.37, // Biogenic/synthetic carbon neutral offset potential
    wtwMultiplier: 0.65, // Significant lifecycle carbon credit
    relativeVolumeFactor: 2.1,
    maturity: "Scaling Commercial",
    description: "Liquid fuel at ambient room temperature; easy bunkering, 60-80% lifecycle GHG reduction when synthesized from green hydrogen.",
    colorHex: "#10b981", // Emerald
  },
  Hydrogen: {
    displayName: "Green Liquid Hydrogen (LH2)",
    lhvMjKg: 120.0,
    densityKgL: 0.071,
    defaultPriceUsdPerTonne: 4500.0,
    ttwFactor: 0.0, // Zero exhaust tailpipe emissions
    wtwMultiplier: 0.3, // Upstream green renewable electrolysis footprint
    relativeVolumeFactor: 4.3,
    maturity: "Emerging Pilot",
    description: "Zero tailpipe greenhouse emissions; requires cryogenic storage (-253°C) and substantial capital investment.",
    colorHex: "#38bdf8", // Sky blue
  },
  Ammonia: {
    displayName: "Green Ammonia (e-NH3)",
    lhvMjKg: 18.6,
    densityKgL: 0.68,
    defaultPriceUsdPerTonne: 1100.0,
    ttwFactor: 0.0, // Zero carbon tailpipe
    wtwMultiplier: 0.35, // Haber-Bosch synthesis upstream lifecycle
    relativeVolumeFactor: 2.7,
    maturity: "Demonstration Phase",
    description: "Zero carbon molecule suited for deep-sea routes; requires strict toxicity handling and N2O slip catalyst.",
    colorHex: "#a855f7", // Purple
  },
};

export const SHORE_POWER_DEFAULTS: ShorePowerDefaults = {
  defaultPriceUsdPerKwh: 0.18,
  gridEmissionFactorKgPerKwh: 0.45, // Average port electric grid emissions
  averagePortHours: 12.0, // Port hoteling turnaround hours
  dieselAuxBurnRateLPerHour: 140.0, // Auxiliary genset fuel burn rate in port without shore power
};

export const DEFAULT_WEIGHTS: OptimizationWeights = {
  fuel: 0.3,
  cost: 0.2,
  emissions: 0.35,
  schedule: 0.15,
};

// Official Showcase Demo Case Study
export const DEFAULT_VOYAGE_PARAMS: VoyageParameters = {
  vesselType: "General Cargo",
  capacityTonnes: 10000,
  enginePowerKw: 6500,
  speedKnots: 18.0,
  distanceKm: 1000.0,
  cargoDemandTonnes: 7000.0,
  cargoLoadPercent: 70.0,
  windSpeedMs: 10.0,
  waveHeightM: 1.8,
  currentSpeedKnots: 0.5,
  weatherCondition: "Moderate",
  routeFactor: 1.05,
  fuelType: "Diesel",
  shorePower: false,
  scheduleDeadlineHours: 36.0,
  emissionCapTonnes: 150.0,
  carbonPriceUsdPerTonne: DEFAULT_CARBON_PRICE_USD_TONNE,
};

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "baseline",
    name: "Baseline Voyage",
    tagline: "Standard maritime coastal cargo transit",
    description: "Official case study: 1000 km voyage carrying 7000 tonnes at 18 knots in moderate sea conditions on Marine Gas Oil.",
    badge: "Case Study Default",
    vesselType: "General Cargo",
    distanceKm: 1000.0,
    cargoDemandTonnes: 7000.0,
    speedKnots: 18.0,
    weatherCondition: "Moderate",
    fuelType: "Diesel",
    shorePower: false,
    carbonPriceUsdPerTonne: 80.0,
  },
  {
    id: "high_fuel_price",
    name: "High Fuel Price Crisis",
    tagline: "Oil market spike + high carbon taxation",
    description: "Crude market disruption pushes MGO to $1,250/t and carbon penalties to $160/t CO2e. Heavy financial incentive for slow steaming and green fuel alternatives.",
    badge: "Cost Pressure",
    vesselType: "Container Ship",
    distanceKm: 1800.0,
    cargoDemandTonnes: 18000.0,
    speedKnots: 20.5,
    weatherCondition: "Moderate",
    fuelType: "Diesel",
    shorePower: true,
    carbonPriceUsdPerTonne: 160.0,
    customFuelPrices: {
      Diesel: 1250.0,
      LNG: 920.0,
      Methanol: 680.0,
    },
  },
  {
    id: "heavy_cargo",
    name: "Heavy Bulk Surge",
    tagline: "High displacement bulk logistics",
    description: "Full capacity bulk deployment (50,000 tonnes ore shipment over 2,400 km). Displacement drag heavily amplifies cubic wave resistance.",
    badge: "High Displacement",
    vesselType: "Bulk Carrier",
    distanceKm: 2400.0,
    cargoDemandTonnes: 50000.0,
    speedKnots: 14.5,
    weatherCondition: "Moderate",
    fuelType: "Diesel",
    shorePower: false,
    carbonPriceUsdPerTonne: 80.0,
  },
  {
    id: "bad_weather",
    name: "Storm Routing & Heavy Seas",
    tagline: "Adverse environmental resistance",
    description: "Severe Atlantic storm front: 26 m/s wind, 6.2 m swell height, adverse 2.8 kn head current. +70% hydrodynamic drag penalty.",
    badge: "Adverse Weather",
    vesselType: "Container Ship",
    distanceKm: 1400.0,
    cargoDemandTonnes: 22000.0,
    speedKnots: 19.0,
    weatherCondition: "Storm",
    fuelType: "Diesel",
    shorePower: false,
    carbonPriceUsdPerTonne: 80.0,
  },
  {
    id: "low_emission",
    name: "Decarbonization / Green Corridor",
    tagline: "IMO 2030/2050 Zero-Emission Compliance",
    description: "Stringent carbon cap of 45 tonnes CO2e with 60% weight allocated directly to greenhouse gas mitigation and mandatory cold-ironing.",
    badge: "Zero-Carbon Focus",
    vesselType: "General Cargo",
    distanceKm: 1000.0,
    cargoDemandTonnes: 7000.0,
    speedKnots: 14.0,
    weatherCondition: "Calm",
    fuelType: "Methanol",
    shorePower: true,
    carbonPriceUsdPerTonne: 120.0,
    weights: {
      fuel: 0.15,
      cost: 0.15,
      emissions: 0.6,
      schedule: 0.1,
    },
  },
  {
    id: "alternative_fuel",
    name: "Next-Gen Ammonia / LH2 Transition",
    tagline: "Deep-sea clean molecule feasibility testing",
    description: "Liquid hydrogen and green ammonia deployment test across international trading lanes with cryogenic storage logistics.",
    badge: "Clean Fuel Pilot",
    vesselType: "Container Ship",
    distanceKm: 2000.0,
    cargoDemandTonnes: 25000.0,
    speedKnots: 17.5,
    weatherCondition: "Calm",
    fuelType: "Ammonia",
    shorePower: true,
    carbonPriceUsdPerTonne: 95.0,
  },
];

export const MAJOR_PORTS: PortLocation[] = [
  {
    id: "rotterdam",
    name: "Port of Rotterdam",
    country: "Netherlands",
    lat: 51.95,
    lng: 4.13,
    hasShorePower: true,
    bunkeringFuels: ["Diesel", "LNG", "Methanol", "Hydrogen"],
  },
  {
    id: "singapore",
    name: "Port of Singapore",
    country: "Singapore",
    lat: 1.26,
    lng: 103.82,
    hasShorePower: true,
    bunkeringFuels: ["Diesel", "LNG", "Methanol", "Ammonia"],
  },
  {
    id: "jnpt_mumbai",
    name: "JNPA / Mumbai Port",
    country: "India",
    lat: 18.95,
    lng: 72.95,
    hasShorePower: true,
    bunkeringFuels: ["Diesel", "LNG", "Methanol"],
  },
  {
    id: "hamburg",
    name: "Port of Hamburg",
    country: "Germany",
    lat: 53.54,
    lng: 9.98,
    hasShorePower: true,
    bunkeringFuels: ["Diesel", "LNG", "Methanol", "Hydrogen"],
  },
  {
    id: "shanghai",
    name: "Port of Shanghai (Yangshan)",
    country: "China",
    lat: 30.63,
    lng: 122.07,
    hasShorePower: true,
    bunkeringFuels: ["Diesel", "LNG", "Methanol"],
  },
];

export const PROTOTYPE_DISCLAIMER =
  "Prototype dataset & analytical model: utilizes deterministic marine hydrodynamics, empirical Admiralty cubic resistance equations, and configurable lifecycle emission factors for demonstration. Production deployment requires vessel telemetry and domain-validated fuel curves.";
