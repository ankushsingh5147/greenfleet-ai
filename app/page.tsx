"use client";

import React from "react";
import { VoyageProvider } from "@/components/context/VoyageContext";
import { AppShell } from "@/components/AppShell";

export default function Home() {
  return (
    <VoyageProvider>
      <AppShell />
    </VoyageProvider>
  );
}
