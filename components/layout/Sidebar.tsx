"use client";

import React from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import {
  LayoutDashboard,
  Gauge,
  Cpu,
  Flame,
  GitCompare,
  FlaskConical,
  BookOpen,
  Anchor,
  Terminal,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export function Sidebar() {
  const { activeTab, setActiveTab, isLandingView, setIsLandingView } = useVoyage();

  const navItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "prediction", label: "Prediction", icon: Gauge },
    {
      id: "optimizer",
      label: "Fleet Optimizer",
      icon: Cpu,
      badge: "QIEA",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    },
    { id: "fuels", label: "Fuel Scenarios", icon: Flame },
    { id: "benchmark", label: "Benchmark", icon: GitCompare },
    { id: "scenario_lab", label: "Scenario Lab", icon: FlaskConical },
    { id: "methodology", label: "Methodology", icon: BookOpen },
  ];

  const handleNavClick = (tabId: string) => {
    if (isLandingView) setIsLandingView(false);
    setActiveTab(tabId);
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-cyan-950/60 bg-[#060913] flex flex-col justify-between select-none">
      {/* Top Section */}
      <div className="p-4 space-y-6">
        {/* Environment Tag */}
        <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-slate-900/90 to-cyan-950/40 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300 font-mono">
              VESSEL COMMAND
            </span>
          </div>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !isLandingView && activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/50 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? "text-cyan-400"
                        : "text-slate-400 group-hover:text-cyan-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                      item.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-slate-900/80 space-y-3 bg-[#04060d]">
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
              Runtime Core
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono">
              Online
            </span>
          </div>

          <p className="text-[10px] text-slate-400 leading-tight">
            Quantum-inspired search executed on classical hardware simulation.
          </p>

          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/40">
            <span>Status</span>
            <span className="text-cyan-400">Prototype Env</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-center font-mono">
          SIH26138 • Smart India Hackathon
        </div>
      </div>
    </aside>
  );
}
