"use client";

import React, { useState, useEffect } from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import { runBenchmarkComparison } from "@/lib/benchmark";
import { BenchmarkComparison } from "@/types";
import { formatNumber } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  GitCompare,
  Zap,
  Play,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export function BenchmarkPage() {
  const { voyageParams, weights, customFuelPrices } = useVoyage();

  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkComparison | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runningStatus, setRunningStatus] = useState<string>("");

  const executeBenchmark = async () => {
    setIsRunning(true);
    setRunningStatus("Executing head-to-head algorithm audit...");

    try {
      const res = await runBenchmarkComparison({
        context: voyageParams,
        weights,
        populationSize: 36,
        nIterations: 32,
        seed: 42,
        overrides: { customFuelPrices },
        onProgress: (algo, step, total) => {
          setRunningStatus(`Running ${algo}: Generation ${step} of ${total}`);
        },
      });
      setBenchmarkResult(res);
    } finally {
      setIsRunning(false);
      setRunningStatus("");
    }
  };

  // Run initial benchmark on mount asynchronously
  useEffect(() => {
    let isMounted = true;
    runBenchmarkComparison({
      context: voyageParams,
      weights,
      populationSize: 36,
      nIterations: 32,
      seed: 42,
      overrides: { customFuelPrices },
    }).then((res) => {
      if (isMounted) setBenchmarkResult(res);
    });
    return () => {
      isMounted = false;
    };
  }, [voyageParams, weights, customFuelPrices]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              <GitCompare className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
              QUANTUM-INSPIRED VS CLASSICAL BENCHMARK
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical head-to-head comparison between Quantum-Inspired Evolutionary Optimization (QIEA)
            and a Classical Baseline (Random + Local Hill-Climbing) under identical constraints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={executeBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-950 transition-all disabled:opacity-50"
          >
            <Play className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Running Evaluation..." : "Rerun Benchmark"}</span>
          </button>
        </div>
      </div>

      {/* Honest Scientific Disclosure Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <AlertCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5 font-mono text-[11px]">
          <span className="font-semibold text-cyan-300">Prototype Benchmark Ground Rules:</span>
          <p className="text-slate-400 leading-relaxed font-sans">
            Results are reported honestly without fabricated superiority. Both algorithms run the
            identical objective evaluation function, random seed, and operational constraint engine
            on classical hardware.
          </p>
        </div>
      </div>

      {isRunning && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/50 flex items-center justify-between text-xs font-mono text-cyan-300 animate-pulse">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            {runningStatus}
          </span>
          <span>Computing Pareto Frontier...</span>
        </div>
      )}

      {/* Side-by-Side Summary Metric Audit Table */}
      {benchmarkResult && (
        <div className="p-6 rounded-2xl bg-[#070e1c] border border-cyan-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              HEAD-TO-HEAD METRIC AUDIT TABLE
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              32 Generations • 36 Candidates per Generation
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  <th className="py-3 px-3">Metric</th>
                  <th className="py-3 px-3 text-cyan-400">Quantum-Inspired (QIEA)</th>
                  <th className="py-3 px-3 text-sky-400">Classical Baseline</th>
                  <th className="py-3 px-3">Difference (%)</th>
                  <th className="py-3 px-3 text-right">Better Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {benchmarkResult.summaryRows.map((row: BenchmarkComparison["summaryRows"][number], idx: number) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 text-slate-200 font-sans font-medium">
                      {row.metric} {row.unit ? `(${row.unit})` : ""}
                    </td>
                    <td className="py-3 px-3 text-cyan-300 font-bold">
                      {typeof row.quantumValue === "number"
                        ? formatNumber(row.quantumValue, row.metric.includes("Cost") ? 0 : 2)
                        : row.quantumValue}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {typeof row.classicalValue === "number"
                        ? formatNumber(row.classicalValue, row.metric.includes("Cost") ? 0 : 2)
                        : row.classicalValue}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {typeof row.differencePercent === "number" ? (
                        <span
                          className={
                            row.differencePercent < 0
                              ? "text-emerald-400 font-bold"
                              : row.differencePercent > 0
                              ? "text-rose-400"
                              : "text-slate-400"
                          }
                        >
                          {row.differencePercent > 0 ? `+${row.differencePercent}%` : `${row.differencePercent}%`}
                        </span>
                      ) : (
                        row.differencePercent
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                          row.betterAlgorithm === "Quantum-Inspired"
                            ? "bg-cyan-950/80 text-cyan-300 border border-cyan-700/60"
                            : row.betterAlgorithm === "Classical Baseline"
                            ? "bg-sky-950/80 text-sky-300 border border-sky-700/60"
                            : "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}
                      >
                        {row.betterAlgorithm}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dual Convergence Trajectory Chart */}
      {benchmarkResult && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                CONVERGENCE SPEED TRAJECTORY (Lower Score is Better)
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Tracking optimal Pareto fitness progress across 32 iterative search cycles.
              </p>
            </div>
            <span className="text-[11px] text-cyan-400 font-mono">
              QIEA Rotation Gate vs Elite Mutation
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={benchmarkResult.convergencePoints}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis
                  dataKey="iteration"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(v) => `Gen ${v}`}
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
                <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                <Line
                  type="monotone"
                  dataKey="quantumBest"
                  name="Quantum-Inspired (QIEA)"
                  stroke="#00E676"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="classicalBest"
                  name="Classical Baseline"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
