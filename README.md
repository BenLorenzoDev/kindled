# 🔥 Kindled

**Spark conversations that convert.**

Kindled is an AI-powered LinkedIn content and engagement platform that helps you attract your ideal customers through strategic content creation — not cold outreach.

---

## The Problem

Cold outreach is dying. Response rates are plummeting. Spam filters are rising. Your prospects are exhausted.

**The winners aren't those who send the most messages.**
**They're those who create content worth responding to.**

---

## The Solution

Kindled provides a complete inbound content engine with a unique flow:

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│    KNOW    │ →  │   SPARK    │ →  │   NURTURE  │ →  │  CONVERT   │
│            │    │            │    │            │    │            │
│  Define    │    │  Generate  │    │  Engage    │    │  Build     │
│  your ICP  │    │  targeted  │    │  with      │    │  trust,    │
│            │    │  content   │    │  engagers  │    │  not volume│
└────────────┘    └────────────┘    └────────────┘    └────────────┘
```

---

## Features

### 🎯 ICP-Driven Content Strategy
Define your Ideal Customer Profile and every piece of content will be targeted to attract them.

### 📚 Content Pillars
AI-generated content themes based on your ICP's pain points and goals.

### ✍️ Post Generation
Create LinkedIn posts using the Hook-Struggle-Lesson framework with your unique voice.

### 🧬 Viral Hacker
Reverse-engineer any viral post and create your own version.

### 💬 Comment Generator
Generate strategic comments to build relationships and visibility.

### 🤝 Engagement Intelligence
Track who engages with your posts and identify ICP matches for follow-up.

### 📅 Content Calendar
Plan and schedule your content weeks in advance.

### 🧩 Chrome Extension
All features available directly inside LinkedIn — no tab switching.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, Tailwind CSS 4 |
| **AI** | Vercel AI SDK + OpenAI GPT-4o |
| **Auth** | NextAuth.js v5 |
| **Database** | PostgreSQL (Supabase) |
| **Extension** | React + Vite + CRXJS |
| **Deployment** | Vercel / Railway |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- OpenAI API key
- Google OAuth credentials (for auth)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kindled.git
cd kindled

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables

```bash
# Authentication
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
AUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/kindled

# AI Provider
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o
```

### Running the Extension

```bash
# Navigate to extension directory
cd kindled-extension

# Install dependencies
npm install

# Build for development
npm run dev

# Load in Chrome:
# 1. Go to chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the dist/ folder
```

---

## Project Structure

```
kindled/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── (dashboard)/        # Protected pages
│   │   └── ...
│   ├── components/             # React components
│   ├── config/                 # Brand configuration
│   ├── lib/                    # Utilities and AI
│   └── types/                  # TypeScript types
├── docs/                       # Documentation
│   ├── PRD.md                  # Product Requirements
│   └── ARCHITECTURE.md         # Technical Architecture
├── kindled-extension/          # Chrome extension
└── ...
```

---

## Configuration

Kindled is designed to be configurable for any brand. Edit the files in `/src/config/`:

### `brand.json`
```json
{
  "companyName": "Your Company",
  "tagline": "Your tagline",
  "philosophy": "Your core belief",
  "hashtags": ["#YourBrand", "#Industry"],
  "bannedWords": ["synergy", "leverage"]
}
```

### `knowledge.md`
Your Content Strategy Bible — the context that informs all AI generation.

### `personas/*.ts`
Define writing personas with specific voices and styles.

---

## Core Philosophy

> **Trust cannot be automated. Authority must be earned.**

Kindled is built on the "Anti-Pitch" approach:

- **Never pitch directly** — Sell the philosophy, not the product
- **Vulnerable > Polished** — Authenticity builds connection
- **Specific > Generic** — Real numbers and scenarios resonate
- **Soft CTAs only** — Ask for engagement, not meetings

---

## Writing Framework

Every post follows the **Hook-Struggle-Lesson** structure:

1. **THE HOOK** — Pattern interrupt (shocking stat, contrarian opinion, confession)
2. **THE STRUGGLE** — Paint the "Old Way" pain
3. **THE EPIPHANY** — Introduce the concept (not the tool)
4. **THE LESSON** — Actionable advice without buying software
5. **THE SOFT CTA** — Ask for comment or debate

---

## Roadmap

- [x] Core post generation
- [x] Viral hacker
- [x] Comment generator
- [ ] ICP generator
- [ ] Content pillars
- [ ] Chrome extension MVP
- [ ] Engagement dashboard
- [ ] Content calendar
- [ ] Team features

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

Private — All rights reserved.

---

## Acknowledgments

- Original inspiration from the CallView.ai LinkedIn Copywriter
- Built with the [BMAD Agent Framework](https://github.com/bmad-method)
- Powered by [Vercel AI SDK](https://sdk.vercel.ai/)

---

<p align="center">
  <strong>Stop chasing cold leads. Start kindling relationships.</strong>
  <br><br>
  🔥 <a href="https://kindled.ai">kindled.ai</a>
</p>
