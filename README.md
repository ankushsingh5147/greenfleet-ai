# GREENFLEET AI
### Quantum-Inspired Fuel Consumption Prediction & Green Fleet Optimization
**AI-powered maritime fuel consumption prediction and green fleet optimization**

![Next.js](https://img.shields.io/badge/Next.js-15%2F16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)
![Deployment](https://img.shields.io/badge/Vercel-Ready-cyan?logo=vercel)

---

## 🌊 Overview

**GREENFLEET AI** is an intelligent maritime decision-support platform designed to assist fleet managers, voyage dispatchers, and port authorities in minimizing maritime fuel consumption, total operating expenditure, and lifecycle greenhouse gas (GHG) emissions.

By combining deterministic naval hydrodynamics (Admiralty cubic resistance power laws), Well-to-Wake (WTW) lifecycle emissions accounting, and a **Quantum-Inspired Evolutionary Algorithm (QIEA)** running on classical hardware, GREENFLEET AI uncovers Pareto-optimal cruising speeds, powertrain fuels, and port cold-ironing schedules.

---

## 🎯 Problem Statement

Commercial shipping contributes approximately **3% of global greenhouse gas emissions**. Tightening International Maritime Organization (IMO) carbon taxation, FuelEU Maritime mandates, and rising bunker fuel prices necessitate next-generation voyage optimization that goes beyond simple static lookup tables.

Current dispatch tools suffer from:
1. **Unrealistic Black-Box Models:** Inability to inspect naval drag and weather resistance physics.
2. **Exponential Decision Spaces:** Combinatorial explosion of speed, ship class, alternative fuels, and berth power variables.
3. **Rigid Single-Objective Optimization:** Failure to balance conflicting commercial constraints (fuel vs. schedule vs. emissions vs. cost).

---

## ⚡ Key Features

| Module | Purpose | Highlights |
| :--- | :--- | :--- |
| **Executive Overview** | Instant C-suite & dispatcher situational awareness | Dynamic KPI comparison, live baseline vs. optimized delta %, conceptual voyage visualizer |
| **Fuel Prediction Studio** | Real-time single voyage inference | 5 vessel classes, continuous displacement curves, wave and aerodynamic drag, shore power toggle |
| **Quantum-Inspired Optimizer** | Multi-objective Pareto strategy solver | Continuous Q-bit state registers, rotation gates $U(\Delta\theta)$, 6 operational constraints |
| **Fuel Scenarios Workspace** | Clean alternative fuel transition analysis | Diesel (MGO), LNG, E-Methanol, Liquid Hydrogen, Green Ammonia, configurable commodity assumptions |
| **Comparative Benchmark** | Honest scientific validation | QIEA vs. Classical Baseline (Random + Local Hill-Climbing) with convergence trajectory graphs |
| **Scenario Lab (What-If)** | Parametric sensitivity laboratory | 6 instant presets, dynamic Admiralty cubic curves ($P \propto V^{3.15}$), bunker shock analysis |
| **Technical Methodology** | Transparent scientific architecture | 8-stage pipeline, formal LaTeX math formulations, Q-bit matrix representations |
| **Report Export Engine** | Enterprise audit compliance | One-click export of complete scenarios to formatted JSON and CSV reports |

---

## 🧬 Quantum-Inspired Optimization Methodology

The algorithm runs entirely on **classical hardware** while simulating key foundational mechanisms of quantum mechanics:

1. **Q-Bit State Encoding:**
   Each continuous or discrete decision variable is represented as a probability amplitude vector:
   $$\lvert\psi\rangle = \cos(\theta)\lvert0\rangle + \sin(\theta)\lvert1\rangle$$
   where $\lvert\alpha\rvert^2 + \lvert\beta\rvert^2 = 1$.

2. **Quantum Superposition & Measurement:**
   Prior to observation, parameters occupy a continuous probability density. During measurement, values collapse probabilistically to ensure global exploratory diversity.

3. **Quantum Rotation Gate:**
   Probability amplitude angles $\theta$ update towards Pareto-optimal solutions using the rotation matrix:
   $$R(\Delta\theta) = \begin{bmatrix} \cos(\Delta\theta) & -\sin(\Delta\theta) \\ \sin(\Delta\theta) & \cos(\Delta\theta) \end{bmatrix}$$
   with an adaptive step $\Delta\theta = 0.03\pi$.

4. **Quantum Tunneling / Clamping:**
   Angles are clamped within $[0.02\pi, 0.48\pi]$ to prevent premature convergence onto local minima.

> **Methodological Disclosure:** This prototype uses a quantum-inspired evolutionary optimization approach executed on classical computing hardware. It does not require or falsely claim physical cryogenic quantum computing hardware.

---

## 📐 Multi-Objective Optimization Formulation

$$\min J = w_1 \cdot \frac{\text{Fuel}}{\text{Fuel}_{\text{ref}}} + w_2 \cdot \frac{\text{Cost}}{\text{Cost}_{\text{ref}}} + w_3 \cdot \frac{\text{CO}_2\text{e}}{\text{CO}_{2\text{e},\text{ref}}} + w_4 \cdot \frac{\text{Time}}{\text{Time}_{\text{ref}}} + \sum \text{Penalties}$$

Subject to:
1. **Weight Normalization:** $w_1 + w_2 + w_3 + w_4 = 1.0$
2. **Cargo Capacity Satisfaction:** $\text{Capacity}_{\text{fleet}} \ge \text{Demand}_{\text{cargo}}$
3. **Safe Hydrodynamic Speed Envelope:** $V_{\min} \le V_{\text{cruise}} \le V_{\max}$
4. **Schedule Deadline Reliability:** $T_{\text{voyage}} \le T_{\text{deadline}}$
5. **Powertrain Fuel Compatibility:** $\text{Fuel} \in \text{CompatibleFuels}(\text{Vessel})$
6. **Port Cold-Ironing Availability:** Verify shore power connection at berth
7. **Lifecycle Emissions Cap:** $\text{CO}_{2\text{e},\text{WTW}} \le \text{Cap}$ *(optional)*

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 15+ / 16 (App Router)](https://nextjs.org/)
- **Language:** TypeScript 5.0 (Strict mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Micro-interactions:** Canvas Confetti
- **Deployment:** [Vercel](https://vercel.com/) (Zero serverful dependencies, zero external paid APIs, zero database required for MVP)

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18.18+ or 20+ installed
- npm or pnpm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/greenfleet-ai.git

# Navigate into the project directory
cd greenfleet-ai-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ How to Deploy to Vercel

1. Push your repository to **GitHub / GitLab / Bitbucket**.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the `greenfleet-ai-app` repository.
4. Framework Preset: **Next.js**.
5. Click **Deploy**.

*Zero environment variables or secret keys are required.* The application builds and deploys directly out-of-the-box.

---

## 🔍 Prototype Limitations & Future Scope

### Prototype Limitations
- **Synthetic Hydrodynamics:** Uses deterministic Admiralty empirical formulas rather than proprietary ship-specific towing-tank curves.
- **Port Infrastructure Assumptions:** Assumes standard grid electricity emission factors (0.45 kg CO₂e/kWh) and $0.18/kWh berth electricity tariffs.

### Production Roadmap
- **Live AIS & Weather APIs:** Direct integration with Copernicus Marine Service (CMEMS) and NOAA Global Wave models.
- **Onboard IoT Telemetry:** Ingest high-frequency Coriolis mass flow meter readings and shaft torque telemetry via NMEA 2000.
- **Multi-Port Dynamic Routing:** Genetic algorithm pathfinding through IMO Emission Control Areas (ECAs) and canal transit toll schedules.

---

## 🏆 Interactive Product Walkthrough (2–3 Minutes)

1. **Landing Intro:** Click *"Enter Command Center"* to open the Bloomberg-style control dashboard.
2. **Demo Scenario:** Click the top-bar *"Demo Scenario"* button to load the official Container/Cargo transit case study.
3. **Overview Dashboard:** Review dynamic KPIs and current vs. optimized metrics with live percentage deltas.
4. **Prediction Studio:** Adjust cruising speed or wave height to observe real-time displacement and fuel consumption responses.
5. **Fleet Optimizer:** Click *"Run Quantum-Inspired Optimization"*, observe the live Q-bit phase updates and review the resulting convergence curve and constraint audit.
6. **Alternative Fuels:** Compare MGO, LNG, Methanol, Ammonia, and Hydrogen emissions and costs side-by-side.
7. **Empirical Benchmark:** Review the unvarnished head-to-head comparison between QIEA and Classical Baseline.
8. **Export:** Click *"Export"* to download the comprehensive scenario JSON or CSV report.

---

**GreenFleet AI — Enterprise Maritime Decision-Support System**
