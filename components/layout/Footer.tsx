"use client";

import React from "react";
import { Anchor, Info } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-cyan-950/40 bg-[#040711] py-4 px-6 text-xs text-slate-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono font-medium">
            <Anchor className="h-3.5 w-3.5 text-cyan-400" />
            <span>GREENFLEET AI</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">AI-Powered Maritime Decarbonization</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Info className="h-3 w-3 text-cyan-400" />
            Representative Prototype Data & Hydrodynamic Models
          </span>
          <span className="rounded bg-slate-900 px-2 py-0.5 border border-slate-800 text-slate-400 font-mono">
            Vercel Ready
          </span>
        </div>
      </div>
    </footer>
  );
}
