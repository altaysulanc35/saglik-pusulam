# Replit Agent Configuration - Sağlık Pusulam

## Overview

Sağlık Pusulam (Health Compass) is a Turkish-language health guidance web application. Users describe their symptoms, and the app suggests which hospital department to visit using AI-powered analysis. It also shows nearby hospitals on a map with addresses, phone numbers, and directions. **The app explicitly does NOT provide medical diagnoses** — it only offers informational guidance and department recommendations.

The app is a single-page application (SPA) with a React frontend and Express backend, using OpenAI (via Replit AI Integrations) for symptom analysis and Leaflet/OpenStreetMap for hospital mapping.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (client/)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight SPA router) — single page app with just Home and 404 pages
- **Styling**: Tailwind CSS with shadcn/ui component library (new-york style)
- **UI Components**: Full shadcn/ui component set in `client/src/components/ui/`
- **Maps**: Leaflet + react-leaflet for hospital location display using OpenStreetMap tiles
- **Animations**: Framer Motion for smooth UI transitions
- **State Management**: TanStack React Query for server state, local React state for UI
- **Build Tool**: Vite with React plugin
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (server/)
- **Framework**: Express 5 on Node.js with TypeScript (runs via tsx)
- **AI Integration**: OpenAI client (via Replit AI Integrations) for symptom-to-department analysis using GPT model with JSON response format
- **API Structure**: Two main endpoints defined in `shared/routes.ts`:
  - `POST /api/symptoms/analyze` — Takes symptom text, returns department recommendation, explanation, urgency level, and related symptoms
  - `GET /api/hospitals` — Takes lat/lng/radius, returns nearby hospitals
- **Validation**: Zod schemas in `shared/schema.ts` serve as contracts between frontend and backend
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Vite builds static files to `dist/public`, Express serves them; server bundled with esbuild to `dist/index.cjs`

### Shared Code (shared/)
- `shared/schema.ts` — Zod schemas for API request/response validation, plus Drizzle ORM table definitions
- `shared/routes.ts` — API contract definitions (paths, methods, input/output schemas)
- `shared/models/chat.ts` — Database models for conversations/messages (used by Replit integrations)

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Uses `DATABASE_URL` environment variable with `pg` Pool
- **Schema push**: `npm run db:push` (drizzle-kit push)
- **Tables**: `feedback` table (minimal usage), `conversations` and `messages` tables (for Replit chat integration)
- **Note**: The core symptom analysis feature is stateless — the database is primarily used by Replit integrations and optional feedback logging

### Replit Integrations (server/replit_integrations/)
Pre-built integration modules:
- **audio/** — Voice recording, streaming, text-to-speech, speech-to-text via OpenAI
- **chat/** — Conversation storage and chat routes
- **image/** — Image generation via OpenAI
- **batch/** — Batch processing utilities with rate limiting and retries

The main app reuses the OpenAI client from `server/replit_integrations/audio/client.ts` for symptom analysis.

### Key Design Decisions

1. **Stateless symptom analysis**: The core feature doesn't require database storage — symptoms are analyzed in real-time via AI and results returned immediately. This keeps the architecture simple.

2. **Shared API contracts**: Zod schemas in `shared/` are used by both frontend and backend, ensuring type safety and validation consistency across the stack.

3. **Turkish language throughout**: All UI text, AI prompts, and error messages are in Turkish. The AI system prompt explicitly instructs responses in Turkish.

4. **Medical disclaimer enforcement**: The AI prompt strictly forbids medical diagnoses. The UI prominently displays legal disclaimers. Emergency situations trigger 112 (Turkish emergency number) alerts.

5. **Legal compliance**: Footer includes modal dialogs for "Hakkımızda" (About), "Gizlilik Politikası" (Privacy Policy), and "Kullanım Koşulları" (Terms of Use).

## External Dependencies

### Required Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required for server startup)
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI API key via Replit AI Integrations
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI base URL via Replit AI Integrations

### Third-Party Services
- **OpenAI API** (via Replit AI Integrations) — Powers symptom analysis using GPT model with JSON response format
- **OpenStreetMap / Leaflet** — Map tiles and hospital location display (no API key needed)
- **Browser Geolocation API** — Gets user's location for nearby hospital search

### Key NPM Packages
- `drizzle-orm` + `drizzle-kit` — Database ORM and migration tooling
- `react-leaflet` + `leaflet` — Interactive maps
- `framer-motion` — Animations
- `wouter` — Client-side routing
- `zod` + `drizzle-zod` — Schema validation
- `@tanstack/react-query` — Server state management
- `shadcn/ui` components (Radix UI primitives) — UI component library