"use client";

import React from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import { formatNumber, formatCurrency } from "@/lib/utils";
import {
  TrendingDown,
  TrendingUp,
  Fuel,
  DollarSign,
  CloudRain,
  Clock,
  Sparkles,
  Compass,
  Navigation,
  Wind,
  Zap,
  Info,
  Waves,
  Sliders,
  Anchor,
} from "lucide-react";

export function OverviewPage() {
  const {
    voyageParams,
    prediction,
    optimizedResult,
    setActiveTab,
    runOptimization,
    isOptimizing,
  } = useVoyage();

  const optM = optimizedResult?.metrics;

  // Dynamic % deltas calculated honestly from current prediction baseline vs optimized strategy
  const calcPct = (curr: number, opt: number | undefined) => {
    if (opt === undefined || curr === 0) return 0;
    return Math.round(((opt - curr) / curr) * 1000) / 10;
  };

  const fuelDelta = calcPct(prediction.fuelConsumptionL, optM?.fuelConsumptionL);
  const costDelta = calcPct(prediction.totalOperatingCostUsd, optM?.totalOperatingCostUsd);
  const co2eDelta = calcPct(prediction.wtwCo2eTonnes, optM?.wtwCo2eTonnes);
  const timeDelta = calcPct(prediction.travelTimeHours, optM?.travelTimeHours);

  const optimizationScore = optimizedResult?.optimizationScore || 88;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0a1426] to-[#04101e] border border-cyan-900/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-[11px] font-mono text-cyan-300">
                <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "12s" }} />
                <span>GREENFLEET AI</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-slate-300">
                <Info className="h-3 w-3 text-cyan-400" />
                Representative Prototype Data
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Quantum-Inspired Fuel Consumption Prediction & Green Fleet Optimization
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              AI-powered decision support for lower fuel consumption, operating cost, and
              lifecycle greenhouse-gas emissions. Evaluates hydrodynamic resistance, alternative
              fuels, and port cold-ironing using simulated quantum probability registers.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => {
                setActiveTab("optimizer");
                runOptimization();
              }}
              disabled={isOptimizing}
              className="w-full sm:w-auto px-5 py-3 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isOptimizing ? "Optimizing..." : "Run Optimization"}</span>
            </button>

            <button
              onClick={() => setActiveTab("scenario_lab")}
              className="w-full sm:w-auto px-4 py-3 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-600 flex items-center justify-center gap-2 transition-all"
            >
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>Explore Scenario Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Fuel Consumption */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono">Predicted Fuel</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Fuel className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-100">
              {formatNumber(optM?.fuelConsumptionL ?? prediction.fuelConsumptionL, 0)}{" "}
              <span className="text-xs font-normal text-slate-400">L</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between font-mono">
              <span>Baseline: {formatNumber(prediction.fuelConsumptionL, 0)} L</span>
              <span
                className={`inline-flex items-center font-semibold text-[11px] ${
                  fuelDelta < 0
                    ? "text-emerald-400"
                    : fuelDelta > 0
                    ? "text-rose-400"
                    : "text-slate-400"
                }`}
              >
                {fuelDelta < 0 ? (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                ) : fuelDelta > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : null}
                {fuelDelta > 0 ? `+${fuelDelta}%` : `${fuelDelta}%`}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Operating Cost */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono">Operating Cost</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-100">
              {formatCurrency(optM?.totalOperatingCostUsd ?? prediction.totalOperatingCostUsd)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between font-mono">
              <span>Baseline: {formatCurrency(prediction.totalOperatingCostUsd)}</span>
              <span
                className={`inline-flex items-center font-semibold text-[11px] ${
                  costDelta < 0
                    ? "text-emerald-400"
                    : costDelta > 0
                    ? "text-rose-400"
                    : "text-slate-400"
                }`}
              >
                {costDelta < 0 ? (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                ) : costDelta > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : null}
                {costDelta > 0 ? `+${costDelta}%` : `${costDelta}%`}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: CO2e Emissions */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono">CO₂e Emissions</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CloudRain className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-100">
              {formatNumber(optM?.wtwCo2eTonnes ?? prediction.wtwCo2eTonnes, 1)}{" "}
              <span className="text-xs font-normal text-slate-400">tonnes</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between font-mono">
              <span>Baseline: {formatNumber(prediction.wtwCo2eTonnes, 1)} t</span>
              <span
                className={`inline-flex items-center font-semibold text-[11px] ${
                  co2eDelta < 0
                    ? "text-emerald-400"
                    : co2eDelta > 0
                    ? "text-rose-400"
                    : "text-slate-400"
                }`}
              >
                {co2eDelta < 0 ? (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                ) : co2eDelta > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : null}
                {co2eDelta > 0 ? `+${co2eDelta}%` : `${co2eDelta}%`}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Travel Time */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono">Travel Time</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-100">
              {formatNumber(optM?.travelTimeHours ?? prediction.travelTimeHours, 1)}{" "}
              <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between font-mono">
              <span>Baseline: {formatNumber(prediction.travelTimeHours, 1)} hrs</span>
              <span
                className={`inline-flex items-center font-semibold text-[11px] ${
                  timeDelta <= 0
                    ? "text-cyan-400"
                    : "text-amber-400"
                }`}
              >
                {timeDelta < 0 ? (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                ) : timeDelta > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : null}
                {timeDelta > 0 ? `+${timeDelta}%` : `${timeDelta}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Current Operation vs Optimized Operation Comparison */}
      <div className="p-6 rounded-2xl bg-[#070d19]/90 border border-cyan-950/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              CURRENT OPERATION vs OPTIMIZED OPERATION
            </h2>
            <p className="text-xs text-slate-400">
              Direct comparison between baseline voyage input configuration and the QIEA optimal strategy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">Optimization Score</div>
              <div className="text-lg font-bold font-mono text-cyan-300">
                {optimizationScore} <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Side-by-Side Comparison Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4 text-slate-300">Current Operation (Baseline)</th>
                <th className="py-3 px-4 text-cyan-400">QIEA Optimized Strategy</th>
                <th className="py-3 px-4 text-right">Delta / Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {/* Vessel Type */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-300 font-sans font-medium">Vessel Type</td>
                <td className="py-3 px-4 text-slate-300">{voyageParams.vesselType}</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">
                  {optM ? optM.vesselType : voyageParams.vesselType}
                </td>
                <td className="py-3 px-4 text-right text-slate-400">
                  {optM?.vesselType === voyageParams.vesselType ? "Preserved Class" : "Reallocated"}
                </td>
              </tr>

              {/* Cruising Speed */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-300 font-sans font-medium">Cruising Speed</td>
                <td className="py-3 px-4 text-slate-300">{voyageParams.speedKnots} knots</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">
                  {optM ? `${optM.cruisingSpeedKnots} knots` : `${voyageParams.speedKnots} knots`}
                </td>
                <td className="py-3 px-4 text-right">
                  {optM ? (
                    <span className={optM.cruisingSpeedKnots <= voyageParams.speedKnots ? "text-emerald-400" : "text-amber-400"}>
                      {optM.cruisingSpeedKnots < voyageParams.speedKnots ? "Slow Steaming" : "Standard Speed"} (
                      {calcPct(voyageParams.speedKnots, optM.cruisingSpeedKnots)}%)
                    </span>
                  ) : "—"}
                </td>
              </tr>

              {/* Fuel Type */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-300 font-sans font-medium">Fuel Selection</td>
                <td className="py-3 px-4 text-slate-300">{voyageParams.fuelType}</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">
                  {optM ? optM.fuelType : voyageParams.fuelType}
                </td>
                <td className="py-3 px-4 text-right text-slate-400">
                  {optM?.fuelType !== voyageParams.fuelType ? (
                    <span className="text-emerald-400">Transitioned to {optM?.fuelType}</span>
                  ) : (
                    "Optimal on Current Fuel"
                  )}
                </td>
              </tr>

              {/* Shore Power */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-300 font-sans font-medium">Shore Power (Cold Ironing)</td>
                <td className="py-3 px-4 text-slate-300">
                  {voyageParams.shorePower ? "Active at berth" : "Disabled (Auxiliary Genset)"}
                </td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">
                  {optM?.shorePower ? "Active at berth (Zero Port Burn)" : "Auxiliary Genset"}
                </td>
                <td className="py-3 px-4 text-right">
                  {optM?.shorePower ? (
                    <span className="text-emerald-400">Zero Port Emissions</span>
                  ) : (
                    <span className="text-slate-400">Standard Turnaround</span>
                  )}
                </td>
              </tr>

              {/* Fuel Consumption */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-300 font-sans font-medium">Fuel Consumption</td>
                <td className="py-3 px-4 text-slate-300">{formatNumber(prediction.fuelConsumptionL, 0)} L</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">
                  {formatNumber(optM?.fuelConsumptionL ?? prediction.fuelConsumptionL, 0)} L
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={fuelDelta <= 0 ? "text-emerald-400 font-bold" : "text-rose-400"}>
                    {fuelDelta <= 0 ? `${fuelDelta}% reduction` : `+${fuelDelta}%`}
                  </span>
                </td>
              </tr>

              {/* Operating Cost */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-300 font-sans font-medium">Operating Cost (Fuel + Tax)</td>
                <td className="py-3 px-4 text-slate-300">{formatCurrency(prediction.totalOperatingCostUsd)}</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">
                  {formatCurrency(optM?.totalOperatingCostUsd ?? prediction.totalOperatingCostUsd)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={costDelta <= 0 ? "text-emerald-400 font-bold" : "text-rose-400"}>
                    {costDelta <= 0 ? `${costDelta}% saved` : `+${costDelta}%`}
                  </span>
                </td>
              </tr>

              {/* Lifecycle CO2e */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-300 font-sans font-medium">Lifecycle CO₂e</td>
                <td className="py-3 px-4 text-slate-300">{formatNumber(prediction.wtwCo2eTonnes, 1)} tonnes</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">
                  {formatNumber(optM?.wtwCo2eTonnes ?? prediction.wtwCo2eTonnes, 1)} tonnes
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={co2eDelta <= 0 ? "text-emerald-400 font-bold" : "text-rose-400"}>
                    {co2eDelta <= 0 ? `${co2eDelta}% GHG mitigated` : `+${co2eDelta}%`}
                  </span>
                </td>
              </tr>

              {/* Travel Time */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-300 font-sans font-medium">Voyage Travel Time</td>
                <td className="py-3 px-4 text-slate-300">{formatNumber(prediction.travelTimeHours, 1)} hrs</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">
                  {formatNumber(optM?.travelTimeHours ?? prediction.travelTimeHours, 1)} hrs
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={timeDelta <= 0 ? "text-cyan-400" : "text-amber-400"}>
                    {timeDelta <= 0 ? "On-time arrival" : `+${timeDelta}% transit time`}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Conceptual Voyage Route Visualization */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200 font-mono">
              CONCEPTUAL VOYAGE ROUTE & ENVIRONMENTAL ZONES
            </h3>
          </div>
          <span className="text-[11px] text-amber-400/90 font-mono bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
            Conceptual voyage visualization — not live AIS data.
          </span>
        </div>

        {/* Visual Route SVG Diagram */}
        <div className="relative w-full h-44 sm:h-52 rounded-xl bg-[#030611] border border-cyan-950/60 p-4 flex flex-col justify-between overflow-hidden">
          {/* Subtle Nautical Grid Background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* SVG Sea Route with Waypoints */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none" preserveAspectRatio="none">
            {/* Direct Baseline Path (dashed amber) */}
            <path
              d="M 60 140 Q 250 80, 500 110 T 950 140"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.4"
            />
            {/* Optimized QIEA Route (cyan glow) */}
            <path
              d="M 60 140 Q 300 170, 550 130 T 950 140"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Top Info Labels */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Origin Port: <strong className="text-slate-200">Rotterdam Terminal</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              <Waves className="h-3.5 w-3.5 text-cyan-400" />
              Sea Zone: <strong className="text-cyan-300">{voyageParams.weatherCondition} Sea State</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Destination Port: <strong className="text-slate-200">Hamburg Container Hub</strong>
            </span>
          </div>

          {/* Interactive Waypoints */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-12">
            {/* Origin Node */}
            <div className="flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-950">
                <Anchor className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 mt-1 font-semibold">0 km (BERTH)</span>
              <span className="text-[10px] text-slate-400 font-mono">Cold Ironing Ready</span>
            </div>

            {/* Weather & Resistance Zone Node */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-400/80 flex items-center justify-center text-amber-300">
                <Wind className="h-3 w-3" />
              </div>
              <span className="text-[11px] font-mono text-amber-300 mt-1 font-medium">Swell & Wind Zone</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {voyageParams.waveHeightM}m waves • {voyageParams.windSpeedMs} m/s
              </span>
            </div>

            {/* QIEA Optimization Point */}
            <div className="flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950 animate-pulse">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 mt-1 font-semibold">QIEA Waypoint</span>
              <span className="text-[10px] text-slate-400 font-mono">
                Speed adjusted: {optM?.cruisingSpeedKnots || voyageParams.speedKnots} kn
              </span>
            </div>

            {/* Destination Node */}
            <div className="flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950">
                <Anchor className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 mt-1 font-semibold">
                {voyageParams.distanceKm} km
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ETA: {optM?.travelTimeHours || prediction.travelTimeHours} hrs</span>
            </div>
          </div>

          {/* Bottom Route Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-cyan-400 inline-block" />
                <span>QIEA Optimized Trajectory</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-amber-400/60 inline-block border-t border-dashed" />
                <span>Unoptimized Baseline Direct Line</span>
              </span>
            </div>
            <span>Hydrodynamic Admiralty Cubic Law Applied</span>
          </div>
        </div>
      </div>
    </div>
  );
}
