<div align="center">

# code.itslouis.dev

[![CI](https://img.shields.io/github/actions/workflow/status/itsmelouis/code.itslouis.dev/ci.yml?style=flat-square&logo=github&label=CI)](https://github.com/itsmelouis/code.itslouis.dev/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)
[![Made with Nuxt](https://img.shields.io/badge/Made%20with-Nuxt-00DC82?style=flat-square&logo=nuxt&labelColor=020420)](https://nuxt.com)

A browser-only code frame editor for turning source code into shareable PNG and SVG images.

Live at **[code.itslouis.dev](https://code.itslouis.dev)**.

[Stack](#stack) • [Quick Start](#quick-start) • [Scripts](#scripts) • [Privacy](#privacy) • [License](#license)

</div>

## Stack

- **[Nuxt 4](https://nuxt.com)** - Vue framework with static output for Cloudflare Pages
- **[Rangi](https://github.com/pi0/rangi)** - syntax highlighting
- **[Tailwind CSS v4](https://tailwindcss.com)** - styling and design tokens
- **[html-to-image](https://github.com/bubkoo/html-to-image)** - PNG, SVG, and clipboard image exports
- **[LZ-String](https://github.com/pieroxy/lz-string)** - compressed editor state in shareable URLs
- **TypeScript** - strict typing with `<script setup lang="ts">`
- **Oxlint and Oxfmt** - linting and formatting

## Quick Start

Requires [Node.js 24](https://nodejs.org) and [pnpm](https://pnpm.io) through Corepack.

Install the dependencies:

```bash
nvm use
corepack enable
pnpm install
```

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Scripts

```bash
pnpm dev            # Start the development server
pnpm build          # Build for production
pnpm generate       # Generate the static site
pnpm preview        # Preview the production build locally
pnpm run ci         # Run linting, formatting checks, and typechecking
pnpm lint           # Lint with Oxlint
pnpm lint:fix       # Fix lint errors automatically
pnpm format         # Format with Oxfmt
pnpm format:check   # Check formatting without changing files
pnpm typecheck      # Run Nuxt TypeScript checks
```

## Privacy

The app runs entirely in the browser. It never uploads or executes snippets, and it renders highlighted code through escaped Vue text nodes.

Shared editor state is compressed into the URL fragment, so it is not included in HTTP requests or Cloudflare access logs. Custom background uploads remain local and are excluded from shared links.

## Deployment

Configure Cloudflare Pages with the following settings:

| Setting                | Value            |
| ---------------------- | ---------------- |
| Build command          | `pnpm generate`  |
| Build output directory | `.output/public` |
| Node.js version        | `24`             |

## License

MIT © [Louis F.](https://github.com/itsmelouis). See the [license](./LICENSE) for details.
