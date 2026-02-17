# Excalidraw

## Overview

Excalidraw is an open-source virtual whiteboard with a hand-drawn aesthetic. It's a **monorepo** with a clear separation between the core React component library (`@excalidraw/excalidraw`) and the full-featured web application (excalidraw.com). The project has been customized/forked with "Tutorbuddy" branding in the app layer (visible in HTML titles, localStorage keys, and meta tags).

The monorepo contains:
- **`packages/excalidraw/`** — Main React component library published to npm
- **`packages/common/`** — Shared constants, utilities, and types (`@excalidraw/common`)
- **`packages/element/`** — Element manipulation logic (`@excalidraw/element`)
- **`packages/math/`** — Math utilities and geometric types (`@excalidraw/math`)
- **`packages/utils/`** — General utilities (`@excalidraw/utils`)
- **`excalidraw-app/`** — The web application that consumes the library
- **`examples/`** — Integration examples (Next.js, browser script)
- **`dev-docs/`** — Docusaurus-based developer documentation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Management
- **Yarn workspaces** (Yarn 1.x) manages the monorepo with workspaces defined in the root `package.json`
- Internal packages use **TypeScript path aliases** (e.g., `@excalidraw/common` → `./packages/common/src/index.ts`) configured in `tsconfig.json`
- Packages are built with **esbuild** (see `scripts/buildPackage.js`, `scripts/buildBase.js`); the app uses **Vite**

### Frontend Architecture
- **React 19** with functional components and hooks throughout
- **TypeScript** with strict configuration (`strict: true`, ESNext target)
- **Jotai** for state management, with a custom restriction: direct imports from `jotai` are linted against — the app uses wrapper modules (`app-jotai.ts` for app-level state, `editor-jotai` for editor-level state) to control store instances
- **CSS Modules and SCSS** for component styling
- **Vite** as the dev server and bundler for the app, with plugins for React, PWA, SVG, EJS templating, and ESLint checking
- **PWA support** via `vite-plugin-pwa` with service worker registration

### Real-time Collaboration
- **WebSocket-based** collaboration using `socket.io-client`
- Rooms identified by random IDs with **end-to-end encryption** (Web Crypto API for encrypt/decrypt)
- Scene reconciliation logic handles merging remote and local element states
- Cursor sync, idle status tracking, and follow-user functionality
- Data synced includes elements, binary files (images), and user presence

### Data Storage
- **localStorage** for app state, elements, theme, collab username, and debug settings (keys prefixed with `tutorbuddy`)
- **IndexedDB** (via `idb-keyval`) for binary file storage (images)
- **Firebase Firestore** for collaborative room persistence
- **Firebase Storage** for file uploads (images shared in collab sessions)
- File size limit: 4 MiB per file; files cached with 1-year max-age

### Build & Tooling
- **Vite 5** for app development and production builds
- **esbuild** for package builds (ESM output with dev/prod variants)
- **Vitest** for testing with `vitest-canvas-mock` and `@testing-library/jest-dom`
- **ESLint** with custom config (`@excalidraw/eslint-config`) plus `react-app` preset
- **Prettier** with `@excalidraw/prettier-config`
- **Husky + lint-staged** for pre-commit hooks
- WASM modules (woff2, harfbuzz) converted to base64 TypeScript modules via `scripts/buildWasm.js`

### Key Development Commands
```bash
yarn start              # Start dev server (Vite, port 3000)
yarn test:typecheck     # TypeScript type checking
yarn test:update        # Run all tests with snapshot updates
yarn fix                # Auto-fix formatting and linting
yarn build:packages     # Build all packages
```

### Error Monitoring
- **Sentry** integration for production error tracking (excalidraw.com and staging)
- Console error capture and feature flag integration
- Disabled locally and in Docker via `VITE_APP_DISABLE_SENTRY` env var

### Deployment
- **Vercel** for hosting with custom headers (CORS, caching, security)
- Git SHA injected as `VITE_APP_GIT_SHA` for version tracking
- Version file generated at build time from git commit info

## External Dependencies

### Core Runtime
- **React 19** / **React DOM 19** — UI framework
- **Jotai 2.11** — Atomic state management
- **socket.io-client 4.7** — WebSocket communication for collaboration
- **Firebase 11.3** — Firestore (room data) and Storage (file uploads)
- **i18next-browser-languagedetector** — Automatic language detection
- **@sentry/browser 9** — Error tracking and monitoring
- **uqr** — QR code generation for share links
- **idb-keyval** — Simple IndexedDB wrapper for file storage
- **lodash.throttle** — Function throttling

### Build & Dev Tools
- **Vite 5** with plugins: `@vitejs/plugin-react`, `vite-plugin-pwa`, `vite-plugin-svgr`, `vite-plugin-checker`, `vite-plugin-ejs`
- **esbuild** with `esbuild-sass-plugin` for package builds
- **Vitest 3** for testing
- **TypeScript 5.9**
- **Docusaurus 2** for developer documentation site

### Environment Variables
The app relies on numerous `VITE_APP_*` env variables (defined in `vite-env.d.ts`):
- `VITE_APP_FIREBASE_CONFIG` — Firebase configuration JSON
- `VITE_APP_WS_SERVER_URL` — Collaboration WebSocket server
- `VITE_APP_BACKEND_V2_GET_URL` / `VITE_APP_BACKEND_V2_POST_URL` — Backend APIs
- `VITE_APP_AI_BACKEND` — AI features backend
- `VITE_APP_PLUS_LP` / `VITE_APP_PLUS_APP` — Excalidraw+ integration URLs
- `VITE_APP_DISABLE_SENTRY` — Toggle Sentry error tracking