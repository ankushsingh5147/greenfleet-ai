"use client";

import React, { useState } from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import { PRESET_SCENARIOS } from "@/lib/config";
import { exportScenarioToJson, exportScenarioToCsv } from "@/lib/export";
import {
  Compass,
  RotateCcw,
  Download,
  Sparkles,
  Layers,
  ChevronDown,
  FileJson,
  FileSpreadsheet,
  Globe,
} from "lucide-react";

export function Header() {
  const {
    voyageParams,
    prediction,
    optimizedResult,
    activePresetId,
    loadPreset,
    loadDemoScenario,
    resetScenario,
    isLandingView,
    setIsLandingView,
  } = useVoyage();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  const activePreset = PRESET_SCENARIOS.find((p) => p.id === activePresetId);

  const handleExportJson = () => {
    exportScenarioToJson({
      exportDate: new Date().toISOString(),
      problemStatement: "SIH26138 - Quantum-Inspired Fuel Consumption Prediction & Green Fleet Optimization",
      system: "GREENFLEET AI Prototype Environment",
      scenarioParameters: voyageParams,
      predictionBaseline: prediction,
      optimizedSolution: optimizedResult || undefined,
    });
    setShowExportMenu(false);
  };

  const handleExportCsv = () => {
    exportScenarioToCsv({
      exportDate: new Date().toISOString(),
      problemStatement: "SIH26138 - Quantum-Inspired Fuel Consumption Prediction & Green Fleet Optimization",
      system: "GREENFLEET AI Prototype Environment",
      scenarioParameters: voyageParams,
      predictionBaseline: prediction,
      optimizedSolution: optimizedResult || undefined,
    });
    setShowExportMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-950/60 bg-[#070b14]/90 backdrop-blur-md px-4 lg:px-6 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setIsLandingView(!isLandingView)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-sm shadow-cyan-500/10">
              <Compass className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wider text-slate-100 font-mono">
                  GREENFLEET<span className="text-cyan-400">.AI</span>
                </span>
                <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-800/60 font-mono">
                  SIH26138
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Quantum-Inspired Fleet Optimization
              </p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-slate-300 font-mono">
              QIEA Solver: <span className="text-emerald-400 font-medium">Ready</span>
            </span>
          </div>
        </div>

        {/* Center / Right: Scenario Controls & CTAs */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Preset Scenario Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all"
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden md:inline text-slate-400">Scenario:</span>
              <span className="text-cyan-300 font-medium max-w-[120px] sm:max-w-[180px] truncate">
                {activePreset?.name || "Baseline Voyage"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showPresetMenu && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-lg bg-slate-950/95 border border-slate-800 p-1.5 shadow-2xl z-50 backdrop-blur-xl"
                onMouseLeave={() => setShowPresetMenu(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 font-mono">
                  Select Preset Scenario
                </div>
                <div className="py-1 max-h-72 overflow-y-auto space-y-1">
                  {PRESET_SCENARIOS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        loadPreset(preset.id);
                        setShowPresetMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-colors flex flex-col gap-0.5 ${
                        activePresetId === preset.id
                          ? "bg-cyan-950/60 border border-cyan-700/50 text-cyan-200"
                          : "text-slate-300 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{preset.name}</span>
                        <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1 rounded">
                          {preset.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        {preset.tagline}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Demo Scenario Button */}
          <button
            onClick={loadDemoScenario}
            title="Load the SIH26138 Showcase Case Study"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-md shadow-cyan-950 transition-all active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-200 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Demo Scenario</span>
          </button>

          {/* Reset Scenario Button */}
          <button
            onClick={resetScenario}
            title="Reset parameters to official defaults"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Export Scenario Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-800 hover:border-cyan-600/50 hover:text-cyan-300 transition-all"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-950/95 border border-slate-800 p-1.5 shadow-2xl z-50 backdrop-blur-xl"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button
                  onClick={handleExportJson}
                  className="w-full text-left px-3 py-2 rounded-md text-xs text-slate-300 hover:bg-slate-900 flex items-center gap-2 hover:text-cyan-300 transition-colors"
                >
                  <FileJson className="h-4 w-4 text-cyan-400" />
                  <span>Download JSON Report</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  className="w-full text-left px-3 py-2 rounded-md text-xs text-slate-300 hover:bg-slate-900 flex items-center gap-2 hover:text-emerald-300 transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                  <span>Download CSV Summary</span>
                </button>
              </div>
            )}
          </div>

          {/* Toggle Landing / Command Center */}
          <button
            onClick={() => setIsLandingView(!isLandingView)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/40 transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden md:inline">
              {isLandingView ? "Command Center" : "Landing Intro"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
