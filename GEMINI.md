# Project: Nova Board - Task and Project Management Tool

## Overview
Nova Board is a simple and intuitive task and project management application inspired by Jira. It provides essential tools for managing projects, tasks, and workflows with drag-and-drop functionality for easy organization.

## Features
- **Task Management:** Create, edit, assign, and track tasks with statuses, priorities, and due dates.
- **Project Management:** Organize tasks into projects with customizable boards and workflows.
- **Drag and Drop:** Intuitive drag-and-drop interface for moving tasks between columns and boards using Angular CDK.
- **Simplicity:** Focus on essential features for streamlined project management without unnecessary complexity.

## Architecture & Framework
- **Framework:** Angular 21+
- **Pattern:** Standalone Components (No NgModules)
- **State Management:** Angular Signals (`signal`, `computed`, `effect`)
- **Dependency Injection:** Prefer `inject()` function over constructor injection.
- **Backend:** Supabase (`@supabase/supabase-js`)
- **Testing:** Vitest (configured as unit-test builder)

## Design System & Styling
- **CSS Preprocessor:** SCSS
- **UI Library:** Angular Material, Angular CDK (including drag-and-drop utilities)
- **Global Styles:** `src/styles.scss`
- **Component Styles:** Scoped SCSS files (`[name].scss`)

## Project Structure
- `src/app/core/`: Singleton services, guards, and interceptors (e.g., `AuthService`, `SupabaseService`).
- `src/app/features/`: Feature-based modules.
  - `component/`: Feature-specific components.
  - `services/`: Feature-specific services.
  - `interfaces/`: Feature-specific models/types.
- `src/app/layout/`: Global layout components like `AppShell` and `Sidenav`.
- `src/app/lib/`: Custom providers, tokens, and utility functions.

## Coding Conventions
- **Naming:**
  - Files: `lowercase-kebab-case.ts`
  - Components: `[Name]Component` class in `[name]-component.ts` (Exception: `App` in `app.ts`).
  - Services: `[Name]Service` class in `[name]-service.ts`.
- **Async/Await:** Prefer `async/await` for asynchronous operations (especially with Supabase).
- **Signals:** Always use Signals for reactive state in components.
- **Prettier:** Follow project's `.prettierrc` (single quotes, 100 char width).

## Key Workflows
- **New Feature:** Create a new folder in `src/app/features/` with `component`, `services`, and `interfaces` sub-folders as needed.
- **Auth:** Managed via `AuthService` in `core/services/` using Supabase.
- **Routing:** Defined in `src/app/app.routes.ts`.
