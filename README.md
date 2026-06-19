# Web Apps

A production-oriented Angular monorepo for building a public website and an admin application from the same codebase.

The workspace uses Nx, pnpm, Angular SSR, shared libraries, and a shared styling layer so both apps can share infrastructure without mixing app-specific features.

## What's Included

- **Two Angular applications**
  - `website` for the public-facing app, landing pages, auth flows, and user dashboard
  - `admin` for the authenticated admin/dashboard app
- **Server-side rendering** for both apps
- **Nx workspace tooling** for builds, linting, caching, and project orchestration
- **Shared libraries**
  - `@libs/core` for application infrastructure such as icons, theming, media, and local storage
  - `@libs/ui` for reusable standalone UI building blocks
  - `@libs/utils` for reusable interfaces, errors, and utility types
- **Shared styles** under `styles/`, including Tailwind CSS, base styles, components, and third-party overrides
- **Path aliases** for cleaner imports across apps and libraries

## Tech Stack

- Angular 22
- Nx 23
- pnpm
- TypeScript 6
- Tailwind CSS 4
- Angular Material / CDK
- NgRx Signals
- Express SSR
- Vitest-ready tooling

## Requirements

- Node.js `>=24.0.0`
- pnpm

Install pnpm if needed:

```bash
npm install -g pnpm
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the public website:

```bash
pnpm dev:website
```

The website runs on `http://localhost:4200`.

Run the admin app:

```bash
pnpm dev:admin
```

The admin app runs on `http://localhost:4000`.

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev:website` | Start the website dev server on port `4200`. |
| `pnpm dev:admin` | Start the admin dev server on port `4000`. |
| `pnpm build` | Build both applications. |
| `pnpm build:website` | Build only the website app. |
| `pnpm build:admin` | Build only the admin app. |
| `pnpm lint` | Lint both applications. |
| `pnpm lint:website` | Lint only the website app. |
| `pnpm lint:admin` | Lint only the admin app. |
| `pnpm ssr:website` | Run the built website SSR server. |
| `pnpm ssr:admin` | Run the built admin SSR server. |

Build the target app before running an `ssr:*` command.

## Application Routes

The website app is split into landing, authentication, and dashboard areas:

```text
/                  Landing routes
/auth              Sign in, sign up, password reset, and related auth flows
/dashboard         Authenticated user dashboard and profile routes
```

The admin app protects the dashboard at the root route and includes a locked screen:

```text
/                  Authenticated admin dashboard
/locked            Locked-session screen
```

## Project Structure

```text
apps/
  admin/              Admin/dashboard application
  website/            Public website application

libs/
  core/               Shared application infrastructure
  ui/                 Reusable UI components
  utils/              Shared interfaces, errors, and utility exports

public/               Static assets copied into each app build
styles/               Shared CSS, Tailwind layers, and component styles

eslint.config.ts      Workspace ESLint configuration
nx.json               Nx workspace configuration
tsconfig.base.json    Shared TypeScript configuration and path aliases
```

## Import Aliases

The workspace defines these aliases in `tsconfig.base.json`:

```ts
import { ... } from '@libs/core';
import { ... } from '@libs/ui';
import { ... } from '@libs/utils';
import { ... } from '@admin/app/...';
import { ... } from '@website/app/...';
```

Use `@libs/core` for reusable infrastructure, `@libs/ui` for shared UI components, and `@libs/utils` for shared types or lightweight utilities. Keep app-specific code inside its app folder unless it is clearly useful across applications.

## Styling

Global styles are loaded from:

```text
styles/styles.css
```

That file pulls from the shared style system:

- `styles/base/` for reset, typography, and base rules
- `styles/components/` for reusable component-level CSS
- `styles/tailwind/` for Tailwind theme, utilities, and variants
- `styles/third-party/` for vendor-specific style overrides

Static assets, including fonts, live in `public/`.

## Building For Production

Build both apps:

```bash
pnpm build
```

The SSR output is generated under:

```text
dist/website/
dist/admin/
```

Run the built servers locally:

```bash
pnpm ssr:website
pnpm ssr:admin
```

For deployment, point your host or process manager at the generated server entry:

```text
dist/website/server/server.mjs
dist/admin/server/server.mjs
```

## Development Notes

- Prefer adding shared, framework-level behavior to `libs/core`.
- Prefer adding reusable interfaces and small utility exports to `libs/utils`.
- Keep route-level features colocated inside the owning app.
- Keep global visual decisions in `styles/` so both apps stay consistent.
- Use Nx commands when adding new projects, libraries, or targets so workspace metadata stays in sync.
