"use client";

import React, { useState } from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import { VesselType, FuelType, WeatherCondition } from "@/types";
import { VESSEL_SPECS, INITIAL_FUEL_DATA } from "@/lib/config";
import { formatNumber, formatCurrency } from "@/lib/utils";
import {
  Gauge,
  Fuel,
  DollarSign,
  CloudRain,
  Clock,
  Zap,
  Sliders,
  CheckCircle2,
  Wind,
  Ship,
  Power,
  RotateCcw,
} from "lucide-react";

export function PredictionPage() {
  const {
    voyageParams,
    updateParam,
    prediction,
    resetScenario,
  } = useVoyage();

  const [isPredicting, setIsPredicting] = useState(false);

  const handleRunPrediction = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
    }, 350);
  };

  const vesselTypes: VesselType[] = [
    "General Cargo",
    "Container Ship",
    "Bulk Carrier",
    "Oil Tanker",
    "Ro-Ro Ferry",
  ];

  const fuelTypes: FuelType[] = ["Diesel", "LNG", "Methanol", "Hydrogen", "Ammonia"];
  const weatherOptions: WeatherCondition[] = ["Calm", "Moderate", "Rough", "Storm"];

  const spec = VESSEL_SPECS[voyageParams.vesselType];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              <Gauge className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
              FUEL CONSUMPTION PREDICTION
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic marine hydrodynamic regression pipeline implementing displacement, speed
            cubics, weather drag, and fuel chemistry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
            Model: Prototype analytical prediction model
          </span>
          <button
            onClick={resetScenario}
            title="Reset parameters"
            className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs Left, Prediction Output Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Input Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Vessel Profile Section */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Ship className="h-3.5 w-3.5" />
                Vessel & Powertrain Specifications
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Envelope: [{spec.minSpeed} - {spec.maxSpeed} kn]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Vessel Type */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Vessel Type</label>
                <select
                  value={voyageParams.vesselType}
                  onChange={(e) => updateParam("vesselType", e.target.value as VesselType)}
                  className="w-full bg-[#030611] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                >
                  {vesselTypes.map((v) => (
                    <option key={v} value={v}>
                      {v} ({VESSEL_SPECS[v].defaultCapacity.toLocaleString()} t)
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Fuel Selection</label>
                <select
                  value={voyageParams.fuelType}
                  onChange={(e) => updateParam("fuelType", e.target.value as FuelType)}
                  className="w-full bg-[#030611] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                >
                  {fuelTypes.map((f) => (
                    <option key={f} value={f}>
                      {INITIAL_FUEL_DATA[f].displayName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vessel Capacity */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-slate-300 font-medium">Design Capacity</label>
                  <span className="text-cyan-400 font-mono">
                    {formatNumber(voyageParams.capacityTonnes, 0)} tonnes
                  </span>
                </div>
                <input
                  type="range"
                  min={spec.minCapacity}
                  max={spec.maxCapacity}
                  step={500}
                  value={voyageParams.capacityTonnes}
                  onChange={(e) => updateParam("capacityTonnes", Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Engine Power */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-slate-300 font-medium">Engine Power (MCR)</label>
                  <span className="text-cyan-400 font-mono">
                    {formatNumber(voyageParams.enginePowerKw, 0)} kW
                  </span>
                </div>
                <input
                  type="range"
                  min={spec.minPower}
                  max={spec.maxPower}
                  step={500}
                  value={voyageParams.enginePowerKw}
                  onChange={(e) => updateParam("enginePowerKw", Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 2. Voyage & Hydrodynamic Parameters */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                Operational & Speed Parameters
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Cruising Speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-slate-300 font-medium">Cruising Speed</label>
                  <span className="text-cyan-300 font-mono font-bold">
                    {voyageParams.speedKnots.toFixed(1)} knots
                  </span>
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
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Slow: {(spec.minSpeed - 2).toFixed(1)} kn</span>
                  <span>Rated: {spec.defaultSpeed} kn</span>
                  <span>Max: {(spec.maxSpeed + 2).toFixed(1)} kn</span>
                </div>
              </div>

              {/* Voyage Distance */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-slate-300 font-medium">Voyage Distance</label>
                  <span className="text-cyan-300 font-mono">
                    {formatNumber(voyageParams.distanceKm, 0)} km
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={voyageParams.distanceKm}
                  onChange={(e) => updateParam("distanceKm", Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Cargo Load % */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-slate-300 font-medium">Cargo Load Factor</label>
                  <span className="text-cyan-300 font-mono">
                    {voyageParams.cargoLoadPercent.toFixed(0)}% (
                    {Math.round((voyageParams.capacityTonnes * voyageParams.cargoLoadPercent) / 100).toLocaleString()} t)
                  </span>
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

              {/* Route Congestion Factor */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-slate-300 font-medium">Route Factor</label>
                  <span className="text-cyan-300 font-mono">
                    {voyageParams.routeFactor.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={1.3}
                  step={0.01}
                  value={voyageParams.routeFactor}
                  onChange={(e) => updateParam("routeFactor", Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 3. Weather & Port Infrastructure */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Wind className="h-3.5 w-3.5" />
                Sea Weather & Port Infrastructure
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Weather Condition */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Weather Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {weatherOptions.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => updateParam("weatherCondition", cond)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                        voyageParams.weatherCondition === cond
                          ? "bg-cyan-950/80 border-cyan-500/80 text-cyan-300"
                          : "bg-[#030611] border-slate-700/80 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shore Power Cold Ironing Toggle */}
              <div className="space-y-2">
                <label className="text-slate-300 font-medium">Port Shore Power (Cold Ironing)</label>
                <div
                  onClick={() => updateParam("shorePower", !voyageParams.shorePower)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    voyageParams.shorePower
                      ? "bg-emerald-950/40 border-emerald-600/60 text-emerald-300"
                      : "bg-[#030611] border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Power className={`h-4 w-4 ${voyageParams.shorePower ? "text-emerald-400" : "text-slate-500"}`} />
                    <div>
                      <div className="font-semibold text-xs text-slate-200">
                        {voyageParams.shorePower ? "Cold Ironing Enabled" : "Aux Genset at Berth"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {voyageParams.shorePower
                          ? "Auxiliary engines off, zero port fuel"
                          : "Consumes bunker fuel at port"}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      voyageParams.shorePower
                        ? "border-emerald-400 bg-emerald-500/30 text-emerald-300"
                        : "border-slate-600"
                    }`}
                  >
                    {voyageParams.shorePower && "✓"}
                  </span>
                </div>
              </div>
            </div>

            {/* Run Prediction Button */}
            <div className="pt-2">
              <button
                onClick={handleRunPrediction}
                disabled={isPredicting}
                className="w-full py-3 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-950 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Gauge className={`h-4 w-4 ${isPredicting ? "animate-spin" : ""}`} />
                <span>{isPredicting ? "Calculating Hydrodynamics..." : "Run Prediction"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Prediction Result Workspace (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Prediction Gauge Card */}
          <div className="p-6 rounded-2xl bg-[#070e1c] border border-cyan-900/60 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  PREDICTION RESULT
                </span>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-cyan-400" />
                  Fuel Consumption
                </h3>
              </div>

              {/* Model Confidence Badge */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Model Confidence</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono">
                  <CheckCircle2 className="h-3 w-3" />
                  {prediction.confidenceScore}%
                </span>
              </div>
            </div>

            {/* Primary Predicted Number Display */}
            <div className="text-center py-2 space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 font-mono tracking-tight">
                {formatNumber(prediction.fuelConsumptionL, 1)}
                <span className="text-lg font-normal text-slate-400 ml-2">Liters</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Equivalent to <strong>{formatNumber(prediction.fuelMassTonnes, 2)} metric tonnes</strong>{" "}
                of {prediction.fuelType}
              </div>
            </div>

            {/* Key Metrics Quad */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Cost */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/70 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <DollarSign className="h-3 w-3 text-emerald-400" />
                  Total Operating Cost
                </div>
                <div className="text-lg font-bold font-mono text-emerald-400">
                  {formatCurrency(prediction.totalOperatingCostUsd)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Fuel: {formatCurrency(prediction.totalFuelAndPowerCostUsd)}
                </div>
              </div>

              {/* Lifecycle Emissions */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/70 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <CloudRain className="h-3 w-3 text-cyan-400" />
                  Lifecycle CO₂e (WTW)
                </div>
                <div className="text-lg font-bold font-mono text-cyan-300">
                  {formatNumber(prediction.wtwCo2eTonnes, 1)}{" "}
                  <span className="text-xs text-slate-400">t</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Direct TTW: {formatNumber(prediction.ttwCo2eTonnes, 1)} t
                </div>
              </div>

              {/* Travel Time */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/70 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3 text-purple-400" />
                  Voyage Duration
                </div>
                <div className="text-lg font-bold font-mono text-purple-300">
                  {formatNumber(prediction.travelTimeHours, 1)}{" "}
                  <span className="text-xs text-slate-400">hrs</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Effective: {prediction.effectiveSpeedKnots} kn
                </div>
              </div>

              {/* Energy Consumed */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/70 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Zap className="h-3 w-3 text-amber-400" />
                  Propulsion Energy
                </div>
                <div className="text-lg font-bold font-mono text-amber-300">
                  {formatNumber(prediction.propulsionEnergyMj / 1000, 1)}{" "}
                  <span className="text-xs text-slate-400">GJ</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  LHV: {INITIAL_FUEL_DATA[prediction.fuelType].lhvMjKg} MJ/kg
                </div>
              </div>
            </div>

            {/* Model Metadata & Transparency Box */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Model Pipeline</span>
                <span className="text-cyan-400">{prediction.modelMetadata}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Derived deterministically using naval hydrodynamic drag, wave resistance, and IMO
                MEPC fuel emission factors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
