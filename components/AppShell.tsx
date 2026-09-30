"use client";

import React, { useState } from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { LandingView } from "@/components/views/LandingView";
import { OverviewPage } from "@/components/views/OverviewPage";
import { PredictionPage } from "@/components/views/PredictionPage";
import { FleetOptimizerPage } from "@/components/views/FleetOptimizerPage";
import { FuelScenariosPage } from "@/components/views/FuelScenariosPage";
import { BenchmarkPage } from "@/components/views/BenchmarkPage";
import { ScenarioLabPage } from "@/components/views/ScenarioLabPage";
import { MethodologyPage } from "@/components/views/MethodologyPage";
import {
  LayoutDashboard,
  Gauge,
  Cpu,
  Flame,
  GitCompare,
  FlaskConical,
  BookOpen,
  Menu,
  X,
} from "lucide-react";

export function AppShell() {
  const { activeTab, setActiveTab, isLandingView } = useVoyage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileNavItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "prediction", label: "Prediction", icon: Gauge },
    { id: "optimizer", label: "Optimizer", icon: Cpu },
    { id: "fuels", label: "Fuels", icon: Flame },
    { id: "benchmark", label: "Benchmark", icon: GitCompare },
    { id: "scenario_lab", label: "Scenarios", icon: FlaskConical },
    { id: "methodology", label: "Methodology", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100">
      {/* Top Header */}
      <Header />

      {/* If Landing View is toggled, display landing page with smooth transition */}
      {isLandingView ? (
        <main className="flex-1">
          <LandingView />
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Sidebar (hidden on small screens) */}
          <div className="hidden lg:flex">
            <Sidebar />
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative w-64 bg-[#060913] border-r border-slate-800 flex flex-col justify-between z-10 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-sm font-mono text-cyan-400">
                      GREENFLEET AI
                    </span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {mobileNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                            isActive
                              ? "bg-cyan-950/80 text-cyan-300 border border-cyan-700/50"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Mobile menu trigger bar */}
            <div className="lg:hidden flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400"
              >
                <Menu className="h-4 w-4" />
                <span>Modules Menu</span>
              </button>
              <span className="text-xs font-mono text-slate-400 uppercase">
                {mobileNavItems.find((n) => n.id === activeTab)?.label || "Overview"}
              </span>
            </div>

            {/* Dynamic View Switcher */}
            {activeTab === "overview" && <OverviewPage />}
            {activeTab === "prediction" && <PredictionPage />}
            {activeTab === "optimizer" && <FleetOptimizerPage />}
            {activeTab === "fuels" && <FuelScenariosPage />}
            {activeTab === "benchmark" && <BenchmarkPage />}
            {activeTab === "scenario_lab" && <ScenarioLabPage />}
            {activeTab === "methodology" && <MethodologyPage />}
          </main>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
