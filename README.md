<p align="center">
  <h1 align="center">🌍 EcoPulse AI</h1>
  <p align="center">
    <strong>A modern, carbon footprint awareness platform that empowers individuals to understand, track, and reduce their personal climate impact through gamified habits, rich interactive data, and personalized AI-powered coaching.</strong>
  </p>
  <p align="center">
    <a href="#-problem-statement">Problem Statement</a> •
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-google-services-integration">Google Services</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-carbon-calculation-methodology">Methodology</a> •
    <a href="#-testing-suite">Testing</a> •
    <a href="#-deployment">Deployment</a>
  </p>
</p>

---

## 🌱 Problem Statement

Climate change is the defining challenge of our generation, yet most individuals lack clear, actionable awareness of their personal carbon footprint. The average person generates **4 to 16 tonnes of CO₂ per year**, but without visibility into *where* those emissions originate, making meaningful lifestyle changes is incredibly difficult.

**EcoPulse AI** bridges this gap by providing an intuitive, scientific, and encouraging platform that:
- **Quantifies** personal carbon emissions across 7 key lifestyle categories using peer-reviewed factors.
- **Personalizes** carbon reduction strategies using **Google Gemini 2.5 Flash** for direct, context-aware suggestions.
- **Gamifies** habit changes using goals, streaks, difficulty-tiered challenges, and milestone badges.
- **Visualizes** progress with premium, interactive charts and intuitive real-world equivalency metrics.
- **Maintains Accessibility and Security** by ensuring 100% keyboard and screen-reader accessibility, strict client-side sanitization, and API rate limiting.

> [!IMPORTANT]
> **Methodology Disclaimer**: EcoPulse AI provides carbon footprint *estimations* based on localized averages and regional emission factors (EPA, IPCC, DEFRA, IEA). Personal calculations are intended for educational and motivational purposes. We focus on constructive, encouraging language to foster sustainable habits rather than climate guilt.

---

## 📸 Screenshots

<!-- Add screenshots of the application here -->
<!-- ![Landing Page](./screenshots/landing.png) -->
<!-- ![Assessment Wizard](./screenshots/assessment.png) -->
<!-- ![Dashboard Overview](./screenshots/dashboard.png) -->
<!-- ![AI Coach Chat](./screenshots/coach.png) -->
<!-- ![Impact Breakdown](./screenshots/impact.png) -->

> Screenshots coming soon. Run the application locally or deploy it to explore the premium Glassmorphism UI, fluid Framer Motion transitions, and fully responsive layout.

---

## ✨ Features

### 📊 7-Category Carbon Assessment
A multi-step, interactive assessment wizard validating inputs at every stage. It covers:
*   🚗 **Transportation**: Daily commute distance, vehicle fuel/power type (gasoline, diesel, hybrid, electric), weekly public transit days (which offsets vehicle usage), and ridesharing frequency.
*   🍽️ **Food & Diet**: Dietary profile (heavy meat, mixed, vegetarian, vegan), local food sourcing percentage, and food waste frequency.
*   🏠 **Home Energy**: Monthly electricity bills, appliance efficiency rating (standard vs. high-efficiency), household size divisor (for per-capita sharing), and renewable energy adoption.
*   🛍️ **Shopping**: Online shopping order frequency, monthly clothing purchases, annual electronics purchases, and preference for sustainable brands.
*   ♻️ **Waste**: Recyclable materials tracking (paper, plastic, glass, metal) and organic waste composting habits.
*   ✈️ **Travel**: Annual short-haul, medium-haul, and long-haul flight counts, and annual hotel nights.
*   💧 **Water**: Daily average shower duration, weekly laundry load counts, and water-efficient fixture usage.

### 🤖 AI-Powered Eco Coach
An intelligent conversational assistant powered by **Google Gemini 2.5 Flash** utilizing the `@google/genai` SDK:
*   **Contextual Carbon Integration**: Automatically reads the user's latest carbon report to deliver highly specific advice.
*   **Custom Prompt System**: Generates custom starter prompts based on the user's highest emission categories (e.g., "How can I reduce my transportation footprint?").
*   **Response Controls**: Constrains responses to be concise, actionable, and under a 200-word limit to prevent chat overload.
*   **Resilient Offline Fallback**: Features a local fallback engine that matches keywords (e.g., "food", "energy", "commute") and answers with curated recommendations if the network is down or the API key is missing.

### 📈 Impact Breakdown & Recharts Visualizations
*   **Comparative Graphs**: Interactive Recharts pie and bar charts showing absolute emissions (kg CO₂e/year) and percentage contribution per category.
*   **Equivalency Metrics**: Contextualizes raw data into understandable units—like the number of mature trees needed to offset emissions (calculated at 22 kg CO₂/tree/year).
*   **Historical Tracking**: Archives up to **52 weekly assessments** in local storage, allowing the application to display historical trends over time.
*   **Benchmark Baselines**: Compares individual footprints against the global average, national average, and science-based targets for the Paris Agreement.

### 🎯 Goals & Streak Tracking
*   Create specific reduction goals (e.g., "Commute by bicycle 3x/week") with custom deadlines.
*   Check in daily to increment progress (5% per check-in).
*   Maintain active streaks and record historical best streaks.
*   Toggle goals between Active and Paused without losing progress.

### 🏆 Challenge Center & Achievements
*   Participate in sustainability challenges categorized into Beginner, Intermediate, and Expert difficulty levels.
*   Track progress daily for multi-day challenges.
*   Earn and unlock badges (e.g., "First Step", "Streak Master", "Carbon Slayer") evaluated automatically after every assessment update.

### 🔐 Security & Data Sanitization
*   **XSS Protection**: Cleanses all text inputs using a dedicated sanitization module (`src/utils/sanitize.ts`) that strips HTML/XML tags, removes `javascript:` protocols, filters out inline `on*` event handlers, and escapes special characters.
*   **Rate Limiting**: Employs a custom token bucket rate limiter tracking requests on a per-action key basis (e.g., maximum 10 chat messages per minute) to protect costly API routes.
*   **Gemini API Key Validation**: Validates the structure and characters of Gemini API keys before initialization.
*   **Targeted Storage Cleanup**: Avoids generic `localStorage.clear()` commands which wipe other applications on the same origin. Only removes designated EcoPulse keys (`ecopulse-user`, `ecopulse-assessment`, etc.) on account deletion.
*   **Content Security Policy (CSP)**: Incorporates strict meta headers blocking arbitrary third-party scripts, enforcing `'self'` asset loading, and scoping API requests solely to Gemini endpoints.

### ♿ Accessibility & Universal Access
*   **Skip-Nav Link**: A keyboard-accessible skip link is present in `index.html` allowing screen reader and keyboard users to bypass navigation header links and go straight to the `#main-content` landmark.
*   **ARIA Landmark Structure**: Main navigation, sidebar drawer, main content section, mobile navigation bar, and footer are wrapped in standard HTML5 semantic elements (`<nav>`, `<main>`, `<footer>`, etc.) with correct `aria-label` settings.
*   **Focus Styling**: Distinct focus indicators with high-contrast outlines are configured throughout to assist keyboard navigation.
*   **Motion Reduction**: Respects user OS preferences by disabling or speeding up Framer Motion animations when `@media (prefers-reduced-motion: reduce)` is active.
*   **No-JS Fallback**: Provides a clean `<noscript>` layout explaining that JavaScript is required for computation and AI operations.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `19.2` | Frontend framework using concurrent rendering features. |
| **TypeScript** | `6.0` | Strict static typing for safe refactoring and cleaner DX. |
| **Vite** | `8.0` | Lightning-fast bundler with Hot Module Replacement (HMR). |
| **Material UI (MUI)** | `9.1` | Google's Material Design 3 library for high-quality accessible UI controls. |
| **Zustand** | `5.0` | Lightweight store manager handles state updates with persist middleware. |
| **Framer Motion** | `12.4` | Physics-based animation library supplying fluid page and layout transitions. |
| **Recharts** | `3.8` | Composable, responsive React SVG charts. |
| **Zod** | `4.4` | Schema-based validation ensuring inputs match type constraints. |
| **React Hook Form** | `7.80` | High-performance forms reducing unnecessary re-renders. |
| **React Router DOM** | `7.18` | Declarative client-side routing. |
| **date-fns** | `4.4` | Standardized, lightweight date manipulation library. |
| **Vitest** | `3.2` | Next-generation fast test runner replacing Jest. |

### Why This Stack?
*   **React 19 & TypeScript 6**: Leverages the absolute latest frontend standards. Typing ensures 0 compile-time errors.
*   **Vite 8**: Eliminates slow bundler build times and compiles optimized production chunks.
*   **Zustand & Persist Middleware**: Replaces heavy Redux setups. It scopes variables into distinct stores (`useUserStore`, `useAssessmentStore`, `useCarbonStore`, etc.) and automatically synchronizes them to `localStorage` under distinct keys.
*   **MUI 9**: Provides standardized visual controls with a consistent system of shadows, border radii, and accessibility out-of-the-box.

---

## 🔗 Google Services Integration

EcoPulse AI integrates with Google services to provide intelligent features and a premium design:

### 🧠 Google Gemini AI (Gemini 2.5 Flash)
*   **SDK**: `@google/genai` (official Google GenAI SDK v2.9).
*   **Model**: `gemini-2.5-flash` — chosen for its speed, low latency, and high reasoning capabilities.
*   **Service Layer**: `src/services/geminiService.ts` encapsulates the AI logic, formatting context-aware prompts by passing the current carbon report, categories, and values to the model.
*   **Security Controls**: Automatically sanitizes user prompts before passing to the API, and enforces client-side rate limits.
*   **Offline Fallback**: Curated context matching guarantees that even without an API key or an internet connection, the coach remains active.

### 🎨 Material Design & Google Fonts
*   **Theming**: Designed following Google's Material Design 3 guidelines.
*   **Typography**: Pre-connected to Google Fonts to load the **Inter** font family, configured globally in the MUI custom theme.
*   **Icons**: Over 2,100 high-quality Material Rounded icons (`@mui/icons-material`) are utilized for intuitive, consistent visual indicators.

---

## 🏗️ Architecture

```
d:\EcoPulse AI\
├── public/                    # Static public assets
├── src/
│   ├── assets/               # Local images and branding SVG media
│   ├── constants/            # Named global constants (magic numbers)
│   ├── data/                 # Static content configuration
│   │   ├── achievements.ts   # Achievement rules and badge metadata
│   │   ├── challenges.ts     # Curated challenge tiers & tasks
│   │   ├── defaults.ts       # Fallbacks and default empty structures
│   │   └── recommendations.ts # Pre-written sustainability recommendations
│   ├── engine/               # Carbon calculations
│   │   ├── carbonCalculator.ts  # Core calculations (pure functions)
│   │   └── emissionFactors.ts   # Database of regional emission constants
│   ├── layouts/
│   │   └── AppLayout.tsx     # Application navigation shell, responsive drawer, footer
│   ├── pages/                # Individual page components
│   │   ├── LandingPage.tsx   # Informative landing page
│   │   ├── AssessmentPage.tsx# 7-step wizard form (largest file)
│   │   ├── DashboardPage.tsx # Main dashboard with status card and disclaimers
│   │   ├── CoachPage.tsx     # AI Coach interface with prompt suggestions
│   │   ├── GoalsPage.tsx     # Goal list and creation controls
│   │   ├── TrackerPage.tsx   # Habit checklist
│   │   ├── ChallengeCenterPage.tsx # Categories of challenges
│   │   ├── AchievementsPage.tsx  # Unlocked/locked badges grid
│   │   ├── CommunityPage.tsx # Leaderboard & anonymous rankings
│   │   ├── ImpactBreakdownPage.tsx # Recharts pie and bar graphs with equivalencies
│   │   ├── ResourcesPage.tsx # Interactive categories of guides
│   │   └── SettingsPage.tsx  # Profile, custom theme toggle, account deletion
│   ├── services/
│   │   └── geminiService.ts  # Google GenAI service wrappers & prompt styling
│   ├── stores/
│   │   └── appStore.ts       # Zustand store definitions (User, Assessment, Carbon, Goals, etc.)
│   ├── theme/
│   │   ├── theme.ts          # Custom light and dark MUI theme (forest palette)
│   │   └── animations.ts     # Animation configurations for Framer Motion
│   ├── types/
│   │   └── index.ts          # Central TypeScript interfaces and type aliases
│   ├── utils/
│   │   ├── sanitize.ts       # Input security, XSS filtering, and rate limiting
│   │   └── logger.ts         # Production-safe leveled logger utility
│   ├── App.tsx               # App router declarations and theme providers
│   ├── App.css               # Base CSS layout
│   ├── main.tsx              # React mounting root
│   └── index.css             # Skip nav CSS, dark mode scrollbar overrides, and global variables
├── index.html                # CSP configuration, preconnect headers, and skip-nav link
├── package.json              # Script directives and node packages
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Build optimizer and dev server configuration
```

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js**: `v18.0.0` or higher
*   **npm**: `v9.0.0` or higher
*   **Gemini API Key**: (Optional but recommended) Get a free key at [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/ecopulse-ai.git
    cd ecopulse-ai
    ```

2.  **Install Node Modules**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and insert your API key:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The application will launch locally at [http://localhost:5173](http://localhost:5173).

---

## 🔐 Environment Variables

| Variable Name | Required | Description |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | **No** | API Key used to communicate with Google AI Studio. If left blank, the AI Coach operates in offline fallback mode with local keywords. |

---

## 🔬 Carbon Calculation Methodology

EcoPulse AI uses standard emission factors published by international climate bodies, adapted into annualized calculations:

### Emission Factor Sources
*   **EPA (Environmental Protection Agency)**: Vehicle fuels, electricity grid sub-regions, and waste averages.
*   **IPCC (Intergovernmental Panel on Climate Change)**: Base dietary emissions and global warming potentials (GWP).
*   **DEFRA (UK Department for Environment, Food & Rural Affairs)**: Consumer goods, clothing, flights, and hotel stays.
*   **IEA (International Energy Agency)**: Electricity factors for regional grids.

### Key Equations & Constants

#### 1. Transportation
Calculates annual commute emissions based on vehicle fuel efficiency and type, with offsets for public transit days:
$$\text{Emissions} = \left( (D \times 2 \times EF_{\text{vehicle}} \times V_{\text{days}}) + (D \times 2 \times EF_{\text{transit}} \times T_{\text{days}}) \right) \times R_{\text{multiplier}}$$
*   $D$: Commute distance one-way (in km).
*   $V_{\text{days}}$: Vehicle commute days ($250 \text{ working days/year} - T_{\text{days}}$).
*   $T_{\text{days}}$: Public transit days per year ($\text{weekly transit days} \times 52$).
*   $EF$: Specific emission factors per vehicle type (gasoline, diesel, hybrid, electric).
*   $R_{\text{multiplier}}$: Ridesharing multiplier (e.g., `always` = $0.75$, `never` = $1.0$).

#### 2. Food & Diet
Calculates dietary footprint based on baseline diet profile adjusted for waste and sourcing:
$$\text{Emissions} = EF_{\text{diet}} \times W_{\text{multiplier}} \times \left(1 - \frac{L_{\%}}{10} \times EF_{\text{local}}\right)$$
*   $EF_{\text{diet}}$: Diet type base (e.g., Heavy Meat = $2500 \text{ kg}$, Vegan = $800 \text{ kg}$ CO₂e/year).
*   $W_{\text{multiplier}}$: Waste level modifier (e.g., High waste = $1.2$, Low waste = $0.9$).
*   $L_{\%}$: Local food percentage rating ($0$ to $10$).
*   $EF_{\text{local}}$: Local sourcing reduction factor ($0.05$).

#### 3. Home Energy
Converts monthly bills into annual emissions divided by household size:
$$\text{Emissions} = \frac{B \times 12 \times EF_{\text{elec}} \times Eff_{\text{multiplier}} \times (1 - R_{\text{offset}})}{H}$$
*   $B$: Monthly energy bill (USD).
*   $EF_{\text{elec}}$: Grid emission coefficient per dollar.
*   $Eff_{\text{multiplier}}$: Energy efficiency modifier (e.g., High-Efficiency = $0.85$, Standard = $1.0$).
*   $R_{\text{offset}}$: Renewable source offset factor ($0.80$ if solar/wind is utilized).
*   $H$: Household size (number of residents).

---

## 🔬 Testing Suite

EcoPulse AI includes a comprehensive Vitest test suite covering the core calculator engine, input sanitization routines, data validation, achievement logic, constants integrity, emission factor completeness, logger utilities, and Google Gemini API services.

### Run Unit Tests
To run the Vitest test suite:
```bash
npm run test
```

### Run in Watch Mode
To run tests interactively while editing files:
```bash
npm run test:watch
```

### Generate Coverage Reports
To analyze code coverage metrics:
```bash
npm run test:coverage
```

### Test File Index

| Test File | Scope |
| :--- | :--- |
| `src/engine/__tests__/carbonCalculator.test.ts` | Transportation offsets, diet variations, household division, waste recycling, travel classes, tree calculation boundaries, negative inputs, and zero-household edge cases. |
| `src/utils/__tests__/sanitize.test.ts` | XSS payloads, script tags, event handlers, malicious links, rate limiter bounds, whitespace-only input, malformed tags, and consecutive special characters. |
| `src/services/__tests__/geminiService.test.ts` | Service prompt rendering, fallback behavior, and API key absence handling. |
| `src/data/__tests__/data.test.ts` | Default assessment structure, leaderboard ranking integrity, recommendation completeness, challenge-task alignment, and achievement uniqueness. |
| `src/data/__tests__/achievements.test.ts` | Achievement unlock conditions, boundary tests (7-day/30-day streaks, 100kg/500kg savings), compound conditions, re-unlock prevention, and null/empty handling. |
| `src/constants/__tests__/constants.test.ts` | All constants are positive numbers, sensible value ranges, and guards against accidental modifications. |
| `src/engine/__tests__/emissionFactors.test.ts` | All expected keys present, no negative emission factors, and complete frequency/multiplier variants. |
| `src/utils/__tests__/logger.test.ts` | All 4 logger methods exist and don't throw, and the logger object is immutable. |

---

## 🔐 Security Features

EcoPulse AI implements defense-in-depth security measures:

| Layer | Implementation |
| :--- | :--- |
| **Content Security Policy (CSP)** | Strict `<meta>` CSP headers restrict script sources to `'self'`, font loading to Google Fonts, and API requests solely to Gemini endpoints. `frame-src` and `object-src` are set to `'none'`. |
| **XSS Prevention** | All user chat inputs are sanitized via `stripHtmlTags()`, `javascript:` protocol removal, and `on*` event handler filtering before processing. Chat messages are rendered using React's auto-escaping (no `dangerouslySetInnerHTML`). |
| **Rate Limiting** | A custom token-bucket rate limiter (`checkRateLimit()`) tracks requests per action key with configurable windows (e.g., 10 chat messages/minute, 3 summaries/minute). |
| **API Key Validation** | Gemini API keys are validated for format (length, character set) before any network requests are made. Keys are stored only in `sessionStorage` (never persisted). |
| **Storage Isolation** | Account deletion removes only EcoPulse-specific `localStorage` keys, not the entire origin's storage. |
| **Referrer Policy** | `strict-origin-when-cross-origin` prevents leaking URL paths to third-party services. |
| **X-Content-Type-Options** | `nosniff` header prevents MIME-type sniffing attacks. |

---

## 📦 Deployment

### Production Compilation
Generate an optimized production build:
```bash
npm run build
```
Vite compiles the application, minifies CSS, splits large JS chunks, and writes the output static files into the `dist/` directory.

### Preview Local Production Build
Run a local web server displaying the compiled build:
```bash
npm run preview
```

### SPA Routing Configuration
Since the app uses client-side routing (Single Page Application), all requests must be redirected to `index.html` on the server:

#### 1. Nginx Config
```nginx
server {
  listen 80;
  server_name localhost;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

#### 2. Vercel Config (`vercel.json`)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### 3. Netlify Config (`_redirects`)
```text
/*    /index.html   200
```

#### 4. Google Cloud Run Deployment
Deploy the local workspace directly to a serverless Google Cloud Run service using the GCP CLI:
```bash
gcloud run deploy ecopulse-ai --source . --platform managed
```
*(Or leverage the Cloud Run MCP server deploy command available in this workspace).*

---

## 📄 Available CLI Scripts

*   `npm run dev`: Starts the local dev server.
*   `npm run build`: Generates the production build inside `/dist`.
*   `npm run preview`: Launches a web server for previewing the build locally.
*   `npm run lint`: Performs ESLint code quality analysis.
*   `npm run test`: Executes Vitest tests.
*   `npm run test:watch`: Executes Vitest tests in watch mode.
*   `npm run test:coverage`: Generates test coverage summaries.

---

## 📝 Created By

This project is created by **Arpit Chaurasia**. 

---

<p align="center">
  Built with 💚 for a sustainable future.
</p>
