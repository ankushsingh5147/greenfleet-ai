/**
 * GREENFLEET AI - Scenario Exporter
 *
 * Generates downloadable JSON and CSV reports capturing voyage parameters,
 * prediction metrics, optimization outputs, and constraint validation status.
 */

import { VoyageParameters, OptimizationResult, PredictionResult } from "@/types";

export interface ExportPayload {
  exportDate: string;
  problemStatement: string;
  system: string;
  scenarioParameters: VoyageParameters;
  predictionBaseline: PredictionResult;
  optimizedSolution?: OptimizationResult;
}

export function exportScenarioToJson(payload: ExportPayload): void {
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `greenfleet_scenario_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportScenarioToCsv(payload: ExportPayload): void {
  const { scenarioParameters, predictionBaseline, optimizedSolution } = payload;
  const optM = optimizedSolution?.metrics;

  const rows = [
    ["GREENFLEET AI - Maritime Voyage Report"],
    ["Generated At", payload.exportDate],
    ["Problem Statement", payload.problemStatement],
    ["System Status", payload.system],
    [],
    ["VOYAGE INPUT PARAMETERS"],
    ["Parameter", "Value", "Unit"],
    ["Vessel Type", scenarioParameters.vesselType, ""],
    ["Voyage Distance", scenarioParameters.distanceKm, "km"],
    ["Cargo Demand", scenarioParameters.cargoDemandTonnes, "tonnes"],
    ["Cruising Speed", scenarioParameters.speedKnots, "knots"],
    ["Weather Condition", scenarioParameters.weatherCondition, ""],
    ["Baseline Fuel Type", scenarioParameters.fuelType, ""],
    ["Shore Power Active", scenarioParameters.shorePower ? "Yes" : "No", ""],
    ["Carbon Price", scenarioParameters.carbonPriceUsdPerTonne, "USD/tonne CO2e"],
    [],
    ["METRIC COMPARISON", "BASELINE (CURRENT)", "QUANTUM-INSPIRED OPTIMIZED", "CHANGE (%)"],
    [
      "Cruising Speed (kn)",
      scenarioParameters.speedKnots,
      optM ? optM.cruisingSpeedKnots : "N/A",
      optM
        ? `${(((optM.cruisingSpeedKnots - scenarioParameters.speedKnots) / scenarioParameters.speedKnots) * 100).toFixed(1)}%`
        : "N/A",
    ],
    [
      "Fuel Consumption (L)",
      predictionBaseline.fuelConsumptionL,
      optM ? optM.fuelConsumptionL : "N/A",
      optM
        ? `${(((optM.fuelConsumptionL - predictionBaseline.fuelConsumptionL) / predictionBaseline.fuelConsumptionL) * 100).toFixed(1)}%`
        : "N/A",
    ],
    [
      "Operating Cost ($)",
      predictionBaseline.totalOperatingCostUsd,
      optM ? optM.totalOperatingCostUsd : "N/A",
      optM
        ? `${(((optM.totalOperatingCostUsd - predictionBaseline.totalOperatingCostUsd) / predictionBaseline.totalOperatingCostUsd) * 100).toFixed(1)}%`
        : "N/A",
    ],
    [
      "Lifecycle CO2e (tonnes)",
      predictionBaseline.wtwCo2eTonnes,
      optM ? optM.wtwCo2eTonnes : "N/A",
      optM
        ? `${(((optM.wtwCo2eTonnes - predictionBaseline.wtwCo2eTonnes) / predictionBaseline.wtwCo2eTonnes) * 100).toFixed(1)}%`
        : "N/A",
    ],
    [
      "Travel Time (hours)",
      predictionBaseline.travelTimeHours,
      optM ? optM.travelTimeHours : "N/A",
      optM
        ? `${(((optM.travelTimeHours - predictionBaseline.travelTimeHours) / predictionBaseline.travelTimeHours) * 100).toFixed(1)}%`
        : "N/A",
    ],
    [
      "Fuel Type",
      scenarioParameters.fuelType,
      optM ? optM.fuelType : "N/A",
      "",
    ],
    [
      "Shore Power (Cold Ironing)",
      scenarioParameters.shorePower ? "Active" : "Inactive",
      optM ? (optM.shorePower ? "Active" : "Inactive") : "N/A",
      "",
    ],
    [],
    ["OPTIMIZATION METADATA"],
    ["Optimizer Algorithm", optimizedSolution?.algorithm || "N/A"],
    ["Feasibility Status", optimizedSolution?.isFeasible ? "Feasible" : "Constraint Violations"],
    ["Runtime Seconds", optimizedSolution?.runtimeSeconds ?? "N/A"],
    ["Iterations Completed", optimizedSolution?.iterationsCompleted ?? "N/A"],
  ];

  const csvContent = rows
    .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `greenfleet_scenario_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
