# Copilot Instructions — Nova Board

Purpose

This file documents repository-specific conventions, architecture, and guidance for GitHub Copilot / contributors so changes are consistent, testable, and idiomatic.

Quick start

- Prerequisites: Node.js (LTS), npm or pnpm
- Install: `npm install`
- Dev server: `npm run dev` (or check package.json for exact script)
- Build: `npm run build`
- Tests: `npm test` (Vitest)

Project overview

Nova Board is a lightweight task & project management tool built with Angular (21+) using Standalone Components. State is managed with Angular Signals; dependency injection should prefer `inject()` over constructor DI. Supabase (`@supabase/supabase-js`) is the backend.

Folder structure (high-level)

- src/app/core/ — singleton services, guards, interceptors (e.g., AuthService, SupabaseService)
- src/app/layout/ — AppShell, Sidenav, global layout components
- src/app/features/ — feature folders. Each feature should include:
  - component/ — components (standalone)
  - services/ — feature-specific services
  - interfaces/ — TypeScript models/types
- src/app/lib/ — custom providers, tokens, and utilities
- src/styles.scss — global styles

Coding conventions

- Files: lowercase-kebab-case.ts
- Components: Class name [Name]Component in [name]-component.ts
- Services: [Name]Service in [name]-service.ts
- Use Signals (`signal`, `computed`, `effect`) for reactive state
- Prefer `async/await` for async operations (especially Supabase calls)
- Use `inject()` instead of constructor injection where possible
- Styling: SCSS per component; Angular Material + CDK for UI

Feature addition checklist

1. Create folder under `src/app/features/<feature>` with `component/`, `services/`, `interfaces/` as needed.
2. Implement standalone components (no NgModules).
3. Use Signals for state; keep components shallow and push logic to services when appropriate.
4. Add unit tests using Vitest for services and lightweight component tests.
5. Add or update routes in `src/app/app.routes.ts` if exposing new routes.

Testing

- Vitest is configured for unit tests. Keep tests fast and isolated. Mock Supabase calls in unit tests.

Committing and PRs

- Follow existing commit conventions. Include the required Co-authored-by trailer in commits:

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>

- PR checklist: linting, unit tests, build passes, small focused changes, update docs if public API changes.

Notes for Copilot and contributors

- Preserve the project's style and signal-first architecture. When suggesting code, prefer small, testable functions and services. Avoid introducing NgModules or classes that break standalone component patterns.
- For new backend interactions, centralize Supabase logic in core services (e.g., SupabaseService) and wrap calls with error handling.

Contact / Maintainers

Refer to repository maintainers in the GitHub repo for review and merge decisions.

--
Generated to reflect existing project architecture and conventions for consistent contributions.
