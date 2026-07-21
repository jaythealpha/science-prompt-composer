# Science Prompt Composer

Convert plain-language descriptions of scientific phenomena into high-quality, structured prompts for AI image generation — complete with explanations, labels, and annotation plans. Runs entirely in the browser with a local rule/template engine (no account, database, or paid API required).

**Live:** https://science-prompt-composer.vercel.app

Built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn-style components, Radix UI, Lucide, and Zod.

## Features

- 16 built-in phenomenon profiles (aurora, nuclear fission, lightning, plate tectonics, photosynthesis, osmosis, electrolysis, DNA replication, mitosis, superconductivity, black hole accretion, volcanic eruption, and more), plus a generic fallback for unknown inputs
- Structured output: overview, cause/mechanism/result, visualization strategy, visual elements, labels, final image prompt, negative prompt, simplified prompt, and advanced infographic prompt
- **Trilingual** UI and output: English (default), Korean, Japanese — switch from the header language menu
- Controls: category, style, aspect ratio, complexity, label density, and per-section toggles
- Local history (last 20), favorites, copy, and export to TXT / Markdown / JSON
- Dark/light themes, responsive layout, keyboard accessible

## Generation layer

`src/lib/generation/local-service.ts` implements a `GenerationService` interface. The current implementation is local and rule/template-based; an LLM-backed implementation can be swapped in later behind the same interface without changing the UI.

## Local setup

1. Install Node.js 18+
2. `npm install`
3. `npm run dev`
4. Open the printed local address (default http://localhost:3000)

Scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Deployment (automatic)

The project is connected to GitHub for continuous deployment — every push to `main` builds and deploys to Vercel automatically. To deploy manually instead: import the GitHub repo in Vercel, confirm Next.js detection, optionally add env vars from `.env.example`, and deploy.

## Environment variables

No environment variable is required for local generation mode. See `.env.example`:

- `NEXT_PUBLIC_APP_NAME` — optional app name shown in metadata
- `GENERATION_MODE` — `local` (default); `openai`/`anthropic` reserved for a future LLM backend
- `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` — only needed if an LLM backend is enabled

## Note on generated images

AI image generators render these prompts well but do not reproduce text labels perfectly — Latin-script labels are usually accurate, while CJK (Korean/Japanese) labels are less reliable. Verify scientific accuracy and correct any image-generated label text in design software (Figma, Illustrator, Photoshop) for final deliverables.
