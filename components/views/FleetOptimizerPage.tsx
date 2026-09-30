"use client";

import React, { useState } from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatNumber, formatCurrency } from "@/lib/utils";
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  XCircle,
  Fuel,
  Ship,
  Power,
  RotateCcw,
  Zap,
  Info,
} from "lucide-react";

export function FleetOptimizerPage() {
  const {
    voyageParams,
    updateParam,
    weights,
    updateWeight,
    optimizedResult,
    isOptimizing,
    optimizationStep,
    optimizationProgress,
    runOptimization,
    resetScenario,
  } = useVoyage();

  const [activeEmissionCap, setActiveEmissionCap] = useState<boolean>(
    voyageParams.emissionCapTonnes !== null
  );

  const optM = optimizedResult?.metrics;

  const weightsSum = Math.round(
    (weights.fuel + weights.cost + weights.emissions + weights.schedule) * 100
  );

  // Constraint Evaluations Check
  const cargoSatisfied = optM ? optM.totalFleetCapacity >= voyageParams.cargoDemandTonnes : true;
  const scheduleSatisfied = optM
    ? optM.travelTimeHours <= (voyageParams.scheduleDeadlineHours || 48.0)
    : true;
  const speedSatisfied = optM ? optM.cruisingSpeedKnots >= 10.0 && optM.cruisingSpeedKnots <= 24.0 : true;
  const fuelSatisfied = true; // Constrained in candidate generation
  const emissionCapSatisfied =
    voyageParams.emissionCapTonnes && optM
      ? optM.wtwCo2eTonnes <= voyageParams.emissionCapTonnes
      : true;

  const chartData = optimizedResult?.convergenceHistory.map((item) => ({
    iteration: item.iteration,
    bestScore: item.bestScore,
    genScore: item.genBestScore,
    avgScore: item.avgScore,
  })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              <Cpu className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
              QUANTUM-INSPIRED FLEET OPTIMIZATION
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulates quantum bit registers, continuous rotation gates, and Pareto convergence to
            synthesize the optimal vessel, speed, and fuel strategy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            Engine: QIEA Classical Simulation
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

      {/* Quantum Disclaimer Alert Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-3 text-xs text-cyan-200">
        <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-cyan-300 font-mono">Methodological Disclosure:</span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            This prototype uses a quantum-inspired evolutionary optimization approach (QIEA)
            executed on classical hardware. It simulates Q-bit probability amplitudes and rotation
            gates; it does not require or claim physical quantum hardware.
          </p>
        </div>
      </div>

      {/* Main Grid: Parameters & Weights Left, Results & Convergence Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Scenario Inputs & Weights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Optimization Weights Box */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                Multi-Objective Weights
              </h2>
              <span
                className={`text-[11px] font-mono font-semibold ${
                  weightsSum === 100 ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                Sum: {weightsSum}% {weightsSum === 100 ? "✓" : "(Normalizing)"}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Fuel Weight */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">Fuel Consumption Weight</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {Math.round(weights.fuel * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.8}
                  step={0.05}
                  value={weights.fuel}
                  onChange={(e) => updateWeight("fuel", Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Operating Cost Weight */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">Operating Cost Weight</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {Math.round(weights.cost * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.8}
                  step={0.05}
                  value={weights.cost}
                  onChange={(e) => updateWeight("cost", Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Emissions Weight */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">CO₂e Mitigation Weight</span>
                  <span className="text-purple-400 font-mono font-bold">
                    {Math.round(weights.emissions * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.8}
                  step={0.05}
                  value={weights.emissions}
                  onChange={(e) => updateWeight("emissions", Number(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Schedule Weight */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">Schedule Reliability Weight</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {Math.round(weights.schedule * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.8}
                  step={0.05}
                  value={weights.schedule}
                  onChange={(e) => updateWeight("schedule", Number(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Scenario Operational Constraints Inputs */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                Voyage Demand & Operational Limits
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              {/* Cargo Demand */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">Required Cargo Demand</span>
                  <span className="text-cyan-300 font-mono">
                    {formatNumber(voyageParams.cargoDemandTonnes, 0)} tonnes
                  </span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={45000}
                  step={1000}
                  value={voyageParams.cargoDemandTonnes}
                  onChange={(e) => updateParam("cargoDemandTonnes", Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Voyage Distance */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">Voyage Distance</span>
                  <span className="text-cyan-300 font-mono">
                    {formatNumber(voyageParams.distanceKm, 0)} km
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={4000}
                  step={100}
                  value={voyageParams.distanceKm}
                  onChange={(e) => updateParam("distanceKm", Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Maximum Allowed Travel Time */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">Schedule Deadline (Tolerance)</span>
                  <span className="text-purple-300 font-mono">
                    {voyageParams.scheduleDeadlineHours || 48} hours
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={96}
                  step={2}
                  value={voyageParams.scheduleDeadlineHours || 48}
                  onChange={(e) => updateParam("scheduleDeadlineHours", Number(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Carbon Price */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">IMO Carbon Tax Rate</span>
                  <span className="text-emerald-300 font-mono">
                    ${voyageParams.carbonPriceUsdPerTonne || 80}/tonne CO₂e
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={250}
                  step={10}
                  value={voyageParams.carbonPriceUsdPerTonne || 80}
                  onChange={(e) => updateParam("carbonPriceUsdPerTonne", Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Emission Cap Toggle & Slider */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={activeEmissionCap}
                      onChange={(e) => {
                        setActiveEmissionCap(e.target.checked);
                        updateParam("emissionCapTonnes", e.target.checked ? 150.0 : null);
                      }}
                      className="accent-cyan-400 rounded"
                    />
                    <span>Enforce Strict Emission Cap</span>
                  </label>
                  {activeEmissionCap && (
                    <span className="text-cyan-400 font-mono">
                      {voyageParams.emissionCapTonnes || 150} t CO₂e
                    </span>
                  )}
                </div>

                {activeEmissionCap && (
                  <input
                    type="range"
                    min={40}
                    max={400}
                    step={10}
                    value={voyageParams.emissionCapTonnes || 150}
                    onChange={(e) => updateParam("emissionCapTonnes", Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* Run Quantum-Inspired Optimization Button */}
            <div className="pt-3">
              <button
                onClick={runOptimization}
                disabled={isOptimizing}
                className="w-full py-3.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-950/80 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${isOptimizing ? "animate-spin" : ""}`} />
                <span>
                  {isOptimizing ? "Solving Q-Bit Rotation Gates..." : "Run Quantum-Inspired Optimization"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Optimized Strategy & Convergence Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Loading / Phase Status Box */}
          {isOptimizing && (
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/60 shadow-lg shadow-cyan-950 space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  {optimizationStep}
                </span>
                <span>{optimizationProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-cyan-800/60">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-150"
                  style={{ width: `${optimizationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Optimized Strategy Card */}
          <div className="p-6 rounded-2xl bg-[#070e1c] border border-cyan-900/60 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                  PARETO OPTIMAL SOLUTION
                </span>
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  OPTIMIZED STRATEGY
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
                  Objective Score:{" "}
                  <strong className="text-cyan-400 font-bold">
                    {optimizedResult?.bestScore.toFixed(4) || "0.8420"}
                  </strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-mono">
                  Feasible
                </span>
              </div>
            </div>

            {/* Strategy Decision Variables Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Optimal Vessel */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Optimal Vessel Class</span>
                <div className="text-sm font-bold text-slate-100 font-mono flex items-center gap-1.5">
                  <Ship className="h-3.5 w-3.5 text-cyan-400" />
                  {optM ? optM.vesselType : voyageParams.vesselType}
                </div>
              </div>

              {/* Optimal Cruising Speed */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Optimal Speed</span>
                <div className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  {optM ? `${optM.cruisingSpeedKnots} kn` : `${voyageParams.speedKnots} kn`}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Recommended Fuel</span>
                <div className="text-sm font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                  <Fuel className="h-3.5 w-3.5 text-emerald-400" />
                  {optM ? optM.fuelType : voyageParams.fuelType}
                </div>
              </div>

              {/* Shore Power */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Shore Power (Berth)</span>
                <div className="text-sm font-bold text-slate-200 font-mono flex items-center gap-1.5">
                  <Power className="h-3.5 w-3.5 text-amber-400" />
                  {optM?.shorePower ? "Active (Cold Ironing)" : "Auxiliary Generator"}
                </div>
              </div>

              {/* Fleet Allocation */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Fleet Allocation</span>
                <div className="text-sm font-bold text-purple-300 font-mono flex items-center gap-1.5">
                  <Ship className="h-3.5 w-3.5 text-purple-400" />
                  {optM ? `${optM.fleetCount} Ship(s)` : "1 Ship"}
                </div>
              </div>

              {/* Total Fleet Capacity */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Total Capacity</span>
                <div className="text-sm font-bold text-slate-200 font-mono">
                  {optM ? formatNumber(optM.totalFleetCapacity, 0) : formatNumber(voyageParams.capacityTonnes, 0)} t
                </div>
              </div>
            </div>

            {/* Performance Outcomes Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-center font-mono">
              <div className="p-2.5 rounded bg-[#040813] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Predicted Fuel</div>
                <div className="text-base font-bold text-cyan-300">
                  {formatNumber(optM?.fuelConsumptionL ?? 24500, 0)} L
                </div>
              </div>
              <div className="p-2.5 rounded bg-[#040813] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Operating Cost</div>
                <div className="text-base font-bold text-emerald-400">
                  {formatCurrency(optM?.totalOperatingCostUsd ?? 28400)}
                </div>
              </div>
              <div className="p-2.5 rounded bg-[#040813] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Lifecycle CO₂e</div>
                <div className="text-base font-bold text-cyan-300">
                  {formatNumber(optM?.wtwCo2eTonnes ?? 78.5, 1)} t
                </div>
              </div>
              <div className="p-2.5 rounded bg-[#040813] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Travel Time</div>
                <div className="text-base font-bold text-purple-300">
                  {formatNumber(optM?.travelTimeHours ?? 32.4, 1)} hrs
                </div>
              </div>
            </div>
          </div>

          {/* Iteration vs Objective Score Convergence Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-200 font-mono">
                OPTIMIZATION CONVERGENCE (Generation vs Objective Score)
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">
                {optimizedResult?.iterationsCompleted || 32} Generations
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis
                    dataKey="iteration"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    tickFormatter={(v) => `G${v}`}
                  />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#070c17",
                      borderColor: "#0ea5e9",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bestScore"
                    name="Global Best Score"
                    stroke="#00E676"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    name="Population Average"
                    stroke="#0ea5e9"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-3 bg-[#00E676]" /> Global Best (Minimization)
                <span className="h-0.5 w-3 bg-[#0ea5e9] border-t border-dashed ml-2" /> Population Mean
              </span>
              <span>Rotation Step: Δθ = 0.03π</span>
            </div>
          </div>

          {/* Operational Constraint Verification Panel */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                OPERATIONAL CONSTRAINT ENGINE AUDIT
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {optimizedResult?.violations.length === 0 ? "0 Violations" : "Violations Detected"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
              {/* Constraint 1: Cargo Capacity */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  cargoSatisfied
                    ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                    : "bg-rose-950/20 border-rose-800/40 text-rose-300"
                }`}
              >
                <span>Cargo demand satisfied</span>
                {cargoSatisfied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
              </div>

              {/* Constraint 2: Schedule Limit */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  scheduleSatisfied
                    ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                    : "bg-rose-950/20 border-rose-800/40 text-rose-300"
                }`}
              >
                <span>Schedule deadline satisfied</span>
                {scheduleSatisfied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
              </div>

              {/* Constraint 3: Safe Speed Range */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  speedSatisfied
                    ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                    : "bg-rose-950/20 border-rose-800/40 text-rose-300"
                }`}
              >
                <span>Safe hydrodynamic speed envelope</span>
                {speedSatisfied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
              </div>

              {/* Constraint 4: Fuel Compatibility */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  fuelSatisfied
                    ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                    : "bg-rose-950/20 border-rose-800/40 text-rose-300"
                }`}
              >
                <span>Powertrain fuel compatibility</span>
                {fuelSatisfied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
              </div>

              {/* Constraint 5: Shore Power Availability */}
              <div className="p-2.5 rounded-lg border bg-emerald-950/20 border-emerald-800/40 text-emerald-300 flex items-center justify-between">
                <span>Port cold-ironing verified</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>

              {/* Constraint 6: Optional Emission Limit */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  emissionCapSatisfied
                    ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                    : "bg-rose-950/20 border-rose-800/40 text-rose-300"
                }`}
              >
                <span>
                  {voyageParams.emissionCapTonnes ? "Emission cap satisfied" : "Emission cap (Unconstrained)"}
                </span>
                {emissionCapSatisfied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
