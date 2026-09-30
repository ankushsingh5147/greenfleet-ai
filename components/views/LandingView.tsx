"use client";

import React from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import {
  ArrowRight,
  Cpu,
  Gauge,
  Flame,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function LandingView() {
  const { setIsLandingView, setActiveTab, loadDemoScenario } = useVoyage();

  const handleEnterCommandCenter = () => {
    setIsLandingView(false);
    setActiveTab("overview");
  };

  const handleViewMethodology = () => {
    setIsLandingView(false);
    setActiveTab("methodology");
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-between bg-[#040711] text-slate-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden">
      {/* Background Maritime Grid & Radials */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full space-y-12 relative z-10 my-auto">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-950/50">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>GreenFleet AI Enterprise Platform</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <span>Classical Simulation of Quantum-Inspired Evolutionary Search</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Optimize Every Voyage.
            <span className="block bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent mt-1">
              Decarbonize Global Maritime Fleets.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered decision support for lower fuel consumption, operating cost, and
            lifecycle greenhouse-gas emissions using Quantum-Inspired Evolutionary Algorithms.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleEnterCommandCenter}
              className="px-6 py-3.5 rounded-lg text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Enter Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={handleViewMethodology}
              className="px-6 py-3.5 rounded-lg text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 flex items-center gap-2 transition-all"
            >
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>View Methodology</span>
            </button>

            <button
              onClick={loadDemoScenario}
              className="px-5 py-3.5 rounded-lg text-sm font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/60 flex items-center gap-2 transition-all"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Launch Demo Case Study</span>
            </button>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-cyan-500/40 transition-all space-y-3 group">
            <div className="h-10 w-10 rounded-lg bg-cyan-950/70 border border-cyan-800/50 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Gauge className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100 font-mono">
              1. Hydrodynamic Prediction
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent, deterministic physics model implementing Admiralty cubic power laws,
              displacement ratios, wave resistance, wind aerodynamics, and port cold-ironing.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
              <CheckCircle2 className="h-3 w-3" />
              <span>Physically Grounded Formulas</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-emerald-500/40 transition-all space-y-3 group">
            <div className="h-10 w-10 rounded-lg bg-emerald-950/70 border border-emerald-800/50 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100 font-mono">
              2. Quantum-Inspired Search
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continuous Q-bit state vectors $|\psi\rangle$ with Quantum Rotation Gates $U(\Delta\theta)$
              and probability amplitude superposition to explore multi-modal voyage decision spaces.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="h-3 w-3" />
              <span>Classical Simulation Core</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-purple-500/40 transition-all space-y-3 group">
            <div className="h-10 w-10 rounded-lg bg-purple-950/70 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100 font-mono">
              3. Green Fleet Transition
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-fuel lifecycle analysis comparing Marine Gas Oil, LNG, E-Methanol, Liquid Hydrogen,
              and Green Ammonia with Tank-to-Wake and Well-to-Wake carbon accounting.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-purple-400 font-mono">
              <CheckCircle2 className="h-3 w-3" />
              <span>IMO WTW Decarbonization</span>
            </div>
          </div>
        </div>

        {/* Live Metrics Showcase Banner */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 border border-slate-800 flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">5 Vessel Classes</div>
            <div className="text-[11px] text-slate-400">Cargo, Container, Tanker, Bulk, Ro-Ro</div>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">6 Alternative Fuels</div>
            <div className="text-[11px] text-slate-400">MGO, LNG, Methanol, H2, Ammonia, Shore</div>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-purple-400">6 Operational Constraints</div>
            <div className="text-[11px] text-slate-400">Capacity, Speed, Schedule, Fuel, Cap, Power</div>
          </div>
        </div>
      </div>
    </div>
  );
}
