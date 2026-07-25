# ⚡ Ultimate Automation Builder

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDeV-Abhinav-Tech%2FUltimate-Automation-Builder)

**Ultimate Automation Builder** is a state-of-the-art, visual step-by-step workflow automation platform designed for AI tools, API integrations, and smart agent orchestrations.

---

## ✨ Key Features

- 🎨 **Visual Step-by-Step Flowchart Canvas**: Connect Triggers, AI Agents, Condition Logic, HTTP APIs, Slack, Email, and Database nodes.
- ⚡ **Real-Time Step Execution Engine**: Run live step-by-step simulations with active node highlighting, timing metrics, and output payload logs.
- 🧩 **Dynamic Variable Autocompletion**: Easily pipe data across steps using variable pills (e.g. `{{trigger.email}}`, `{{step-2.score}}`).
- 🤖 **Built-in AI Tool Templates**:
  - AI Customer Lead Qualification & CRM Sync
  - E-Commerce Order Fulfillment & Fraud Check
  - GitHub Bug Auto-Summarizer & Dev Alert
- 💻 **Execution Console**: Expandable terminal drawer with JSON input/output payloads and latency metrics.
- 🚀 **100% Vercel & Netlify Ready**: Preconfigured with `vercel.json` and Vite single-page application routing.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 & Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Glassmorphism Design Tokens
- **Icons**: Lucide React
- **Animations**: Canvas Confetti & Keyframe Micro-animations

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/DeV-Abhinav-Tech/Ultimate-Automation-Builder.git

# 2. Change directory
cd Ultimate-Automation-Builder

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Deploying to Vercel

### Option A: Import via Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select **`Ultimate-Automation-Builder`**.
3. Vercel will automatically detect **Vite** and configure the settings (`dist` output directory and `npm run build`).
4. Click **Deploy**!

### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📜 License

MIT License. Developed for automated AI workflows and modern web apps.
