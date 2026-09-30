"use client";

import React, { useState } from "react";
import { useVoyage } from "@/components/context/VoyageContext";
import { FuelType } from "@/types";
import { INITIAL_FUEL_DATA } from "@/lib/config";
import { predictVoyageMetrics } from "@/lib/physics-model";
import { formatNumber, formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Flame,
  Settings2,
  DollarSign,
  CloudRain,
  Power,
  AlertCircle,
} from "lucide-react";

export function FuelScenariosPage() {
  const {
    voyageParams,
    customFuelPrices,
    updateFuelPrice,
  } = useVoyage();

  const allFuels: FuelType[] = ["Diesel", "LNG", "Methanol", "Hydrogen", "Ammonia"];
  const [selectedFuels, setSelectedFuels] = useState<FuelType[]>(allFuels);
  const [includeShorePower, setIncludeShorePower] = useState<boolean>(true);
  const [showAssumptionsModal, setShowAssumptionsModal] = useState<boolean>(false);

  const toggleFuel = (fuel: FuelType) => {
    if (selectedFuels.includes(fuel)) {
      if (selectedFuels.length > 1) {
        setSelectedFuels(selectedFuels.filter((f) => f !== fuel));
      }
    } else {
      setSelectedFuels([...selectedFuels, fuel]);
    }
  };

  // Run predictions across all active fuels under current voyage parameters
  const baselineDiesel = predictVoyageMetrics({
    ...voyageParams,
    fuelType: "Diesel",
    shorePower: false,
  });

  const fuelComparisonResults = selectedFuels.map((fuel) => {
    const res = predictVoyageMetrics(
      {
        ...voyageParams,
        fuelType: fuel,
        shorePower: includeShorePower,
      },
      {
        customFuelPrices,
      }
    );

    const relativeCo2ePercent =
      baselineDiesel.wtwCo2eTonnes > 0
        ? Math.round(
            ((res.wtwCo2eTonnes - baselineDiesel.wtwCo2eTonnes) / baselineDiesel.wtwCo2eTonnes) *
              1000
          ) / 10
        : 0;

    return {
      fuel,
      displayName: INITIAL_FUEL_DATA[fuel].displayName,
      color: INITIAL_FUEL_DATA[fuel].colorHex,
      fuelConsumptionL: res.fuelConsumptionL,
      fuelMassTonnes: res.fuelMassTonnes,
      fuelCostUsd: res.fuelCostUsd,
      totalCostUsd: res.totalOperatingCostUsd,
      ttwCo2eTonnes: res.ttwCo2eTonnes,
      wtwCo2eTonnes: res.wtwCo2eTonnes,
      travelTimeHours: res.travelTimeHours,
      relativeCo2ePercent,
      maturity: INITIAL_FUEL_DATA[fuel].maturity,
      pricePerTonne: customFuelPrices[fuel] || INITIAL_FUEL_DATA[fuel].defaultPriceUsdPerTonne,
    };
  });

  // Recharts Data Formats
  const costChartData = fuelComparisonResults.map((item) => ({
    name: item.fuel,
    FuelCost: item.fuelCostUsd,
    CarbonTaxCost: Math.round(item.totalCostUsd - item.fuelCostUsd),
    TotalCost: item.totalCostUsd,
  }));

  const co2eChartData = fuelComparisonResults.map((item) => ({
    name: item.fuel,
    DirectTTW: item.ttwCo2eTonnes,
    LifecycleWTW: item.wtwCo2eTonnes,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              <Flame className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
              ALTERNATIVE FUEL SCENARIOS & DECARBONIZATION
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparative analysis of conventional and future marine fuels under identical voyage
            payload and hydrodynamic resistance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAssumptionsModal(!showAssumptionsModal)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 hover:bg-cyan-900/60 transition-colors"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Configure Assumptions</span>
          </button>
        </div>
      </div>

      {/* Assumptions Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-cyan-400 flex-shrink-0" />
          <span>
            Prototype assumptions: IMO MEPC emission factors & illustrative commodity prices.
          </span>
        </div>
        <span className="hidden sm:inline text-slate-400">
          Baseline Vessel: {voyageParams.vesselType} ({formatNumber(voyageParams.distanceKm, 0)} km)
        </span>
      </div>

      {/* Filter Chips & Shore Power Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 font-mono mr-2">Compare Fuels:</span>
          {allFuels.map((fuel) => {
            const isSelected = selectedFuels.includes(fuel);
            return (
              <button
                key={fuel}
                onClick={() => toggleFuel(fuel)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-950"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: INITIAL_FUEL_DATA[fuel].colorHex }}
                />
                <span>{fuel}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIncludeShorePower(!includeShorePower)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-colors ${
              includeShorePower
                ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                : "bg-slate-950 border-slate-800 text-slate-400"
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            <span>Cold Ironing: {includeShorePower ? "Active" : "Off"}</span>
          </button>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {fuelComparisonResults.map((item) => (
          <div
            key={item.fuel}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <h3 className="text-sm font-bold text-slate-100 font-mono">{item.fuel}</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                {item.maturity}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Fuel Mass / Liters</span>
                <span className="font-bold text-slate-200">
                  {formatNumber(item.fuelMassTonnes, 1)} t / {formatNumber(item.fuelConsumptionL, 0)} L
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Op Cost ($)</span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(item.totalCostUsd)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Lifecycle WTW CO₂e</span>
                <span className="font-bold text-cyan-300">
                  {formatNumber(item.wtwCo2eTonnes, 1)} t
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Emissions vs Diesel</span>
                <span
                  className={`font-bold ${
                    item.relativeCo2ePercent < 0
                      ? "text-emerald-400"
                      : item.relativeCo2ePercent > 0
                      ? "text-rose-400"
                      : "text-slate-400"
                  }`}
                >
                  {item.relativeCo2ePercent > 0
                    ? `+${item.relativeCo2ePercent}%`
                    : `${item.relativeCo2ePercent}%`}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between font-mono">
              <span>Bunker Price: ${item.pricePerTonne}/t</span>
              <span>LHV: {INITIAL_FUEL_DATA[item.fuel].lhvMjKg} MJ/kg</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Recharts: Cost & Emissions Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Comparison Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              TOTAL OPERATIONAL COST COMPARISON ($)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Fuel + Carbon Tax</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{
                    backgroundColor: "#070c17",
                    borderColor: "#0ea5e9",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                <Bar dataKey="FuelCost" name="Fuel / Power Expense" fill="#06b6d4" stackId="a" />
                <Bar dataKey="CarbonTaxCost" name="Carbon Tax Liability" fill="#f59e0b" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO2e Comparison Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5">
              <CloudRain className="h-4 w-4 text-cyan-400" />
              GREENHOUSE GAS EMISSIONS COMPARISON (Tonnes CO₂e)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">TTW vs WTW</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={co2eChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => `${Number(val).toFixed(1)} tonnes`}
                  contentStyle={{
                    backgroundColor: "#070c17",
                    borderColor: "#10b981",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                <Bar dataKey="DirectTTW" name="Tank-to-Wake (Combustion)" fill="#3b82f6" />
                <Bar dataKey="LifecycleWTW" name="Well-to-Wake (Lifecycle)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assumptions Configuration Drawer / Panel */}
      {showAssumptionsModal && (
        <div className="p-6 rounded-2xl bg-[#060b17] border border-cyan-800/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-cyan-400" />
              CONFIGURABLE FUEL COMMODITY ASSUMPTIONS ($ / Metric Tonne)
            </h3>
            <button
              onClick={() => setShowAssumptionsModal(false)}
              className="text-xs text-slate-400 hover:text-slate-200 font-mono"
            >
              Close [✕]
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {allFuels.map((fuel) => (
              <div key={fuel} className="space-y-1 p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-300 font-medium">{fuel}</span>
                  <span className="text-cyan-400 font-bold">${customFuelPrices[fuel]}/t</span>
                </div>
                <input
                  type="number"
                  min={100}
                  max={8000}
                  step={25}
                  value={customFuelPrices[fuel]}
                  onChange={(e) => updateFuelPrice(fuel, Number(e.target.value))}
                  className="w-full bg-[#030611] border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs font-mono"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
