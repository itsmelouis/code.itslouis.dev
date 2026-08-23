# AGENTS.md

Project guidance for coding agents working in this repository. Keep these instructions tool-agnostic and preserve the application's browser-only security model.

## Project

`code.itslouis.dev` is a static Nuxt 4 application that turns editable code snippets into shareable code frames. Rangi handles syntax highlighting, while the browser handles persistence, URL sharing, image uploads, and PNG/SVG exports. The application has no backend and targets Cloudflare Pages.

## Commands

Use Node.js 24 through nvm and pnpm through Corepack.

```bash
nvm use                 # Select the version from .nvmrc
corepack enable         # Enable the package manager shim
pnpm install            # Install dependencies
pnpm dev                # Start the Nuxt development server
pnpm run ci             # Run lint, formatting checks, and typechecking
pnpm lint               # Run Oxlint
pnpm lint:fix           # Run Oxlint with automatic fixes
pnpm format             # Format files with Oxfmt
pnpm format:check       # Check formatting without changing files
pnpm typecheck          # Run Nuxt TypeScript checks
pnpm generate           # Generate the static Cloudflare Pages output
pnpm preview            # Preview the production build
```

Do not use `pnpm ci`; pnpm reserves that command for installation. Use `pnpm run ci` for the project script.

## Architecture

- `app/app.vue` — application shell, export/share actions, uploads, and notifications
- `app/components/CodeCanvas.vue` — editable code preview and safe Rangi token rendering
- `app/components/EditorControls.vue` — fixed toolbar and all editor settings
- `app/composables/useCodeStudio.ts` — hydration, reset behavior, and local persistence
- `app/constants/editor.ts` — languages, themes, backgrounds, and default state
- `app/types/editor.ts` — shared editor types
- `app/utils/export-image.ts` — PNG, SVG, and image clipboard rendering
- `app/utils/share-state.ts` — URL compression, validation, limits, and sanitization
- `app/assets/css/main.css` — Tailwind entry point, graphite design tokens, and canvas styles
- `public/backgrounds/` — same-origin SVG background presets
- `public/_headers` — Cloudflare Pages security headers
- `nuxt.config.ts` — Nuxt modules, fonts, icons, Tailwind/Vite, and static output

## Stack

- Nuxt 4, Vue 3, and strict TypeScript
- Rangi for syntax highlighting
- Tailwind CSS v4 through `@tailwindcss/vite`
- `@nuxt/fonts` with locally bundled Fontsource packages
- `@nuxt/icon` with a build-time client bundle
- `html-to-image` for PNG/SVG rendering
- LZ-String for compressed URL fragments
- Oxlint and Oxfmt

## Design system

Match the visual system used by `itslouis.dev`:

- Use the graphite palette defined in `app/assets/css/main.css`.
- Use Inter Variable for interface text and JetBrains Mono Variable for code.
- Preserve the minimal composition: preview centered above a single fixed bottom toolbar.
- Do not add marketing copy, dashboards, side panels, large headers, or decorative application chrome.
- Support light and dark system preferences.
- Keep controls compact, accessible, and usable through horizontal scrolling on narrow screens.

## Vue and Nuxt conventions

- Use `<script setup lang="ts">` in Vue components.
- Follow Oxfmt output rather than manually enforcing a competing style.
- Prefer Nuxt and Vue auto-imports where available.
- Keep components focused and extract reusable logic into typed utilities or composables.
- Use semantic HTML, accessible labels, visible keyboard focus, and reduced-motion support.
- Do not introduce server routes unless the user explicitly changes the browser-only architecture.

## Fonts and icons

- Use the global `<Icon name="lucide:..." />` component instead of importing an icon component library.
- Keep icon names literal so `@nuxt/icon` can scan them at build time.
- Install only the required `@iconify-json/*` collections as development dependencies.
- Add every used icon to `icon.clientBundle.icons` in `nuxt.config.ts` when deterministic bundling is required.
- Keep `icon.provider` set to `none` and `serverBundle` set to `false`; production must not fetch icons at runtime.
- Configure fonts through `@nuxt/fonts`. Do not add remote runtime font stylesheets.

## Security invariants

Treat snippets, URL fragments, and uploaded files as hostile input.

- Never execute user code and never use `eval`, `Function`, dynamic script injection, or similar APIs.
- Never render highlighted code with `v-html`. Render Rangi tokens through Vue text interpolation so Vue escapes the content.
- Preserve the strict schema, allowlists, length limits, and numeric clamps in `app/utils/share-state.ts`.
- Keep shared state in the URL fragment so it is not sent in HTTP requests or Cloudflare logs.
- Do not include custom uploaded backgrounds in share URLs.
- Preserve upload MIME allowlists, binary signature validation, file-size limits, and decoded pixel limits.
- Keep image resources same-origin or validated data URLs so browser exports remain reliable.
- Update `public/_headers` carefully when adding a resource source. Prefer the narrowest possible CSP rule.

## Rendering constraints

- The textarea and highlighted token layer must use identical font metrics, padding, line height, and scroll positions.
- Test both line-number states when changing the editor gutter or padding.
- Keep one full-bleed scene background. Do not duplicate it inside the code window; use backdrop filtering for glass effects.
- PNG exports use a 3× pixel ratio.
- Clipboard export writes an `image/png` Blob through `ClipboardItem`, not a base64 text value.
- Verify PNG and SVG exports after changing fonts, canvas styles, images, or CSP behavior.

## Validation

Run the default checks after application changes:

```bash
pnpm run ci
```

Also run `pnpm generate` after changing Nuxt configuration, fonts, icons, Tailwind setup, public assets, security headers, or export-related styling. Confirm that the Nuxt Icon build reports only the expected bundled icons and that the generated app makes no runtime requests to Iconify or external font providers.

## Git

- Do not commit changes unless explicitly requested.
- Use Conventional Commits when a commit is requested.
- Do not edit generated `.nuxt/` or `.output/` files.
