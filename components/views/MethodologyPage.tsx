"use client";

import React from "react";
import {
  BookOpen,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Database,
  Binary,
  CheckCircle2,
  Ship,
  Info,
} from "lucide-react";

export function MethodologyPage() {
  const pipelineSteps = [
    {
      id: "01",
      title: "DATA GENERATION",
      desc: "Synthetic maritime hydrodynamic telemetry encompassing deadweight, power, and sea states.",
      icon: Database,
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/40",
    },
    {
      id: "02",
      title: "FEATURE ENGINEERING",
      desc: "Speed-to-design ratios, displacement factors, aerodynamic air drag, and wave resistance.",
      icon: Layers,
      color: "border-teal-500/40 text-teal-400 bg-teal-950/40",
    },
    {
      id: "03",
      title: "FUEL PREDICTION",
      desc: "Deterministic Admiralty cubic power law model augmented by LHV and density conversions.",
      icon: Zap,
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/40",
    },
    {
      id: "04",
      title: "MULTI-OBJECTIVE",
      desc: "Normalized cost function balancing Fuel, Operating Cost, CO₂e, and Schedule Penalty.",
      icon: Binary,
      color: "border-sky-500/40 text-sky-400 bg-sky-950/40",
    },
    {
      id: "05",
      title: "CONSTRAINT ENGINE",
      desc: "Strict verification of cargo capacity, safe speed envelopes, and schedule deadlines.",
      icon: ShieldCheck,
      color: "border-amber-500/40 text-amber-400 bg-amber-950/40",
    },
    {
      id: "06",
      title: "QUANTUM SEARCH",
      desc: "Continuous Q-bit registers, probability superposition, and Quantum Rotation Gates U(Δθ).",
      icon: Cpu,
      color: "border-purple-500/40 text-purple-400 bg-purple-950/40",
    },
    {
      id: "07",
      title: "BENCHMARKING",
      desc: "Controlled comparative audit against Classical Elite Mutation Baseline.",
      icon: Ship,
      color: "border-blue-500/40 text-blue-400 bg-blue-950/40",
    },
    {
      id: "08",
      title: "DECISION SUPPORT",
      desc: "Executive command dashboard with Pareto-optimal strategies and downloadable reports.",
      icon: CheckCircle2,
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/40",
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-cyan-950/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <BookOpen className="h-4 w-4" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
            TECHNICAL METHODOLOGY & ARCHITECTURE
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Algorithmic formulation, mathematical objective functions, Q-bit representations, and
          marine hydrodynamic principles underlying GREENFLEET AI.
        </p>
      </div>

      {/* End-to-End Pipeline Visualization */}
      <div className="p-6 rounded-2xl bg-[#060b17] border border-cyan-950/80 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="h-4 w-4" />
            END-TO-END SYSTEM PIPELINE ARCHITECTURE
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            8 Integrated Algorithmic Stages
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 relative group hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`h-8 w-8 rounded-lg border flex items-center justify-center ${step.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    STAGE {step.id}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-200 font-mono pt-1">
                  {step.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mathematical Formulations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objective Function Formulation */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 font-mono">
          <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-2">
            <Zap className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              1. Multi-Objective Cost Function (J)
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-[#030612] border border-cyan-950 text-xs text-slate-200 space-y-3">
            <p className="text-[11px] text-slate-400">
              The optimizer minimizes the aggregate scalar objective function:
            </p>
            <div className="text-center py-2 text-sm sm:text-base font-bold text-cyan-300 bg-cyan-950/40 rounded-lg border border-cyan-800/40">
              min J = w₁ · F_norm + w₂ · C_norm + w₃ · E_norm + w₄ · T_norm + Penalty
            </div>

            <div className="text-[11px] space-y-1.5 text-slate-300">
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span>w₁ + w₂ + w₃ + w₄ = 1.0</span>
                <span className="text-emerald-400">Normalized Weight Simplex</span>
              </div>
              <div>• F_norm = Total Fuel Consumption / F_ref</div>
              <div>• C_norm = Total Operating Cost ($) / C_ref</div>
              <div>• E_norm = Lifecycle Well-to-Wake CO₂e / E_ref</div>
              <div>• T_norm = Total Voyage Travel Time / T_ref</div>
            </div>
          </div>
        </div>

        {/* Quantum-Inspired Q-Bit Formulation */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 font-mono">
          <div className="flex items-center gap-2 text-purple-400 border-b border-slate-800 pb-2">
            <Cpu className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              2. Quantum Q-Bit State & Rotation Gate
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-[#030612] border border-purple-950 text-xs text-slate-200 space-y-3">
            <p className="text-[11px] text-slate-400">
              Each decision variable is encoded as a probability amplitude vector:
            </p>
            <div className="text-center py-2 text-sm sm:text-base font-bold text-purple-300 bg-purple-950/40 rounded-lg border border-purple-800/40">
              |ψ⟩ = cos(θ)|0⟩ + sin(θ)|1⟩, where |α|² + |β|² = 1
            </div>

            <div className="text-[11px] space-y-1.5 text-slate-300">
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span>Rotation Gate: θ_new = θ ± Δθ</span>
                <span className="text-purple-400">Δθ = 0.03π</span>
              </div>
              <div>• |0⟩ represents lower-bound / classical baseline state</div>
              <div>• |1⟩ represents higher-efficiency / optimal state</div>
              <div>• Clamped within [0.02π, 0.48π] to preserve quantum tunneling diversity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hydrodynamic Principles & Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydrodynamic Drag Model */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Ship className="h-4 w-4 text-emerald-400" />
            Naval Hydrodynamics (Admiralty Cubic Law)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The power required to propel a marine vessel scales with displacement to the 2/3 power
            and velocity to approximately the 3.15 power:
          </p>
          <div className="p-3 rounded-lg bg-[#030612] border border-slate-800 font-mono text-xs text-emerald-400 text-center">
            P_prop = P_MCR · 0.72 · (V / V_design)³.15 · (Δ / Δ_baseline)^(2/3) · C_env
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
            Environmental resistance factor C_env incorporates aerodynamic air drag (1 + 0.0008 ·
            wind²) and wave resistance (1 + 0.045 · wave^1.6).
          </p>
        </div>

        {/* Prototype Scope & Domain Assumptions */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Info className="h-4 w-4 text-cyan-400" />
            Prototype Scope & Road to Production
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            This platform represents a complete, mathematically grounded Minimum Viable Product
            designed for Hackathon evaluation and stakeholder validation:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Vessel Telemetry:</strong> Uses representative physical equations; production integration will interface with live NMEA/AIS data streams.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Hardware Agnostic:</strong> Runs QIEA on standard classical CPU without requiring cryogenic quantum processors.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Zero External Dependencies:</strong> 100% self-contained deterministic algorithms deployable directly to Vercel.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
