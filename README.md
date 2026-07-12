# InvestIQ - Autonomous AI Investment Agent

InvestIQ is a premium, high-fidelity full-stack SaaS platform that allows users to instantly compile automated financial intelligence briefs on any company. Powered by autonomous AI agents, the platform scrapes real-time information, aggregates historical stock data, and synthesizes a clear investment verdict ("Invest" or "Pass").

---

## 🚀 Key Features

### 1. High-Fidelity & Responsive Design
- **Sleek Dark Mode Integration**: Full design-system support utilizing modern CSS variables in OKLCH space.
- **Interactive Landing Page**: Custom masked dot-grid background, smooth transitions, and mouse-tracking spotlight cards for step-by-step documentation.
- **Micro-Interactions**: The "Research" button features a custom CSS mask-composite gradient border rotation effect, maintaining absolute background transparency while drawing a sharp, glowing border trace.
- **Paper Highlight Homage**: The hero heading features a custom "scrap of paper" sticky note curl on the word *decisions*, carrying a physical page-fold and translucent tape detail.

### 2. Autonomous Research Agent
- **Wikipedia Tooling**: Scrapes summaries and company structures automatically.
- **Yahoo Finance Tooling**: Resolves the exact company ticker symbol, downloads business metrics, and matches recent financial headlines.
- **AI Synthesis**: Consolidates raw data using Llama 3.3 (70B) to stream the reasoning process live into a Vercel-like card document.

### 3. Interactive Trend Analytics
- **3-Month Stock Charts**: Integrates custom `<LineChart>` trends below the AI reasoning brief using Recharts.
- **Responsive Layout**: Recharts adaptively changes line and grid strokes using local CSS variables (such as `var(--primary)` and `var(--border)`) to coordinate light/dark changes seamlessly.
- **Dynamic History Charts**: Opening any past query from the history list fetches and maps its corresponding stock trend in real time.

### 4. Robust Production Performance
- **API Request Caching**: Implements a 30-minute in-memory cache proxy for financial data to reduce outbound request volume.
- **IP Rate Limit Protection**: Gracefully intercepts Yahoo Finance block responses (`429 Too Many Requests`) from cloud-hosting provider IPs and relays safe fallback states and warning notices instead of crashing the UI.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Node.js, Express, Cors
- **Database / ORM**: PostgreSQL, Prisma ORM
- **Authentication**: Clerk (Frontend publishable key + Backend Express authentication middleware)

---

## ⚙️ Setup & Installation

### Prerequisite Environment Configurations

#### Backend (`/backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/investiq"
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

#### Frontend (`/frontend/.env`)
Create a `.env` file in the `frontend/` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_API_URL="http://localhost:5000"
```

---

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubh-ujala/InvestIQ-.git
   cd InvestIQ-
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Run Prisma database migrations / schema sync
   npx prisma db push
   # Start the Express server
   node server.js
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Start the Vite local development server
   npm run dev
   ```

4. **Verify Application**
   Open `http://localhost:5173` in your browser. Sign in, type a query, and compile your first report.

---

## 🌐 Production Deployment

- **Frontend**: Deploy `frontend/` as a project on **Vercel** with root directory set to `frontend`. Ensure environment variables (`VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL`) are configured.
- **Backend**: Deploy `backend/` on **Railway**, **Render**, or **Fly.io**. Sync PostgreSQL server connection and Clerk credentials. Add environment variable `FRONTEND_URL` pointing to your Vercel deployment link to enable CORS.
