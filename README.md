# Science Prompt Composer

Turn complex science into visual prompts. Describe a scientific phenomenon in plain language and generate an educational explanation, a visual annotation plan, suggested labels, and production-ready image-generation prompts — in English or Korean.

Built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn-style components, Radix UI, Lucide, and Zod. The MVP runs entirely in the browser with a local rule/template-based generation engine — no authentication, database, or paid API required.

## Features

- **16 strongly typed phenomenon profiles** (aurora, nuclear fission, lightning, plate tectonics, greenhouse effect, photosynthesis, osmosis, electrolysis, DNA replication, mitosis, superconductivity, black hole accretion, volcanic eruption, electromagnetic induction, combustion, chemical bonds) plus a generic fallback for unknown inputs
- **Structured outputs**: overview, cause/mechanism/result, visualization strategy, core visual elements, labels, annotations, final structured image prompt, negative prompt, simplified prompt, and an advanced infographic prompt
- **Controls**: category (auto-detect), visualization style, aspect ratio, complexity, label density, output language, and per-section toggles
- **English and Korean** UI and output
- **Local history and favorites** (latest 20 entries in `localStorage`, resilient to corrupted data)
- **Copy and export**: per-section copy, copy all, TXT / Markdown / JSON export
- **Dark and light themes**, responsive layout (375px+), keyboard-accessible controls

## Local setup

1. Install [Node.js](https://nodejs.org) (v18.18 or newer; v20+ recommended)
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:3000

No environment variables are required for local generation mode. `NEXT_PUBLIC_APP_NAME` is optional and only overrides the app name in page metadata. See `.env.example` for the full list of reserved variables.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |

## GitHub

1. Create a repository on GitHub
2. Commit the files:
   ```bash
   git init
   git add .
   git commit -m "Science Prompt Composer"
   ```
3. Push to GitHub:
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## Vercel deployment

1. Sign in to [Vercel](https://vercel.com)
2. Import the GitHub repository
3. Confirm that Vercel detects the **Next.js** framework (no custom build settings needed)
4. (Optional) Add environment variables from `.env.example` — none are required for local generation mode
5. Deploy
6. Verify the production URL

## Architecture notes

- `src/lib/types.ts` — shared types, including the `GenerationService` interface
- `src/lib/phenomena.ts` — the typed, bilingual phenomenon profile database
- `src/lib/generation/local-service.ts` — `LocalGenerationService`, the rule/template engine (input normalization, alias matching, category and scale detection, prompt building). To integrate an LLM later, implement `GenerationService` with an API-backed class and swap the export — the UI does not need to change.
- `src/lib/storage.ts` — defensive `localStorage` history/favorites (Zod-validated)
- `src/lib/export.ts` — TXT / Markdown / JSON builders and file download
- `src/components/generator/*` — input panel, output panel, loading stages, history

## Known limitations

- The local engine is template-based: unknown phenomena get a structured generic scaffold, not researched science content
- AI image generators render text imperfectly — plan to correct labels in design software
- Always verify scientific accuracy before publishing or teaching with generated content
