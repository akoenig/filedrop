# Agent Guidelines

This document provides essential information for AI agents working on this Nuxt 4 web application.

## Project Overview

**Technology Stack:**

- **Framework:** Nuxt 4 (with Vue 3)
- **Language:** TypeScript (strict mode)
- **Package Manager:** pnpm (v10) - **NEVER use npm or npx, always use pnpm/pnpx**
- **Runtime:** Node.js 24
- **Database:** SQLite (via Nitro experimental database feature)
- **Styling:** Tailwind CSS 4 + Nuxt UI
- **Code Quality:** Biome (linting, formatting, import organization)

**Architecture:**

This is a full-stack Nuxt application with:

- Server-side API routes and database access
- Client-side Vue components and composables
- Type-safe SQLite database with migration system
- Shared code between client and server

---

## Development Workflow

### Initial Setup

```bash
pnpm install         # Install dependencies
pnpm dev             # Start development server
```

### Critical Success Checks

**REQUIRED after ANY code change:**

```bash
pnpm typecheck      # MUST pass - verify TypeScript types
```

**Additional quality checks:**

```bash
pnpm build          # Verify production build works
pnpx biome check .   # Check linting and formatting
pnpx biome check . --write  # Auto-fix issues
```

### Pre-Commit Checklist

1. Run `pnpm typecheck` - must have zero errors
2. Run `pnpm build` - must complete successfully
3. Verify Biome linting passes
4. Test affected functionality manually

### Branch Management

**Before making significant changes:**

When planning to implement a large or complex feature that involves multiple files or substantial refactoring, **always ask the user if they want to work on a dedicated branch** before proceeding, unless you're already on a feature branch.

Examples of changes that warrant a separate branch:
- Major refactoring across multiple files
- New feature implementations with multiple components
- Database schema changes with migrations
- Architecture changes or significant structural modifications

This helps keep the main branch stable and allows for easier code review and rollback if needed.

---

## Directory Structure

### Application Directories

- **`app/`** - Client-side application code
  - `app/components/` - Vue components
  - `app/composables/` - Vue composables for reusable logic
  - `app/layouts/` - Page layout components
  - `app/pages/` - File-based routing (e.g., `pages/index.vue` -> `/`)
  - `app/assets/` - CSS, images, and other assets
  - `app.vue` - Root application component

### Server Directories

- **`server/`** - Server-side code (API routes, database, plugins)
  - `server/api/v1/` - API routes (if required). [Docs](https://nuxt.com/docs/guide/directory-structure/server)
  - `server/database/` - Database-related code
    - `server/database/migrations/` - TypeScript migration files
    - `server/database/migrations.ts` - Migration runner and types
    - `server/database/types.ts` - Database type definitions
  - `server/plugins/` - Nitro plugins (e.g., database initialization)

### Shared Code

- **`shared/`** - Code shared between client and server. [Docs](https://nuxt.com/docs/guide/directory-structure/shared)

### Other Directories

- **`public/`** - Static files served as-is (e.g., `favicon.svg`)
- **`.nuxt/`** - Auto-generated Nuxt build files (gitignored)
- **`.output/`** - Production build output (gitignored)
- **`.data/`** - Local SQLite database files (gitignored)

---

## Database & Migrations

### Migration System

Migrations are TypeScript files in `server/database/migrations/` that define schema changes. Each migration must:

- Export a `migration` object conforming to the `Migration` interface
- Have a unique name (e.g., `001_create_users_table`)
- Be added to the `migrations` array in `server/database/migrations.ts`

**Migration Example:**

```typescript
// filename: server/database/migrations/001_create_caves_table.ts

// biome-ignore lint/suspicious/noTsIgnore: Nitro experimental database feature, type works at runtime
// @ts-ignore
import { useDatabase } from "#imports";
import type { Migration } from "../migrations.js";

/**
 * Creates the caves table with all required columns and indexes.
 */
export const migration: Migration = {
  name: "001_create_caves_table",
  async up() {
    const db = useDatabase();

    await db.sql`
      CREATE TABLE IF NOT EXISTS caves (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `;

    await db.sql`
      CREATE INDEX IF NOT EXISTS idx_caves_github_username
      ON caves(github_username)
    `;

    await db.sql`
      CREATE INDEX IF NOT EXISTS idx_caves_status
      ON caves(status)
    `;
  },
};
```

**Migration Guidelines:**

- Name migrations sequentially: `001_`, `002_`, `003_`, etc.
- Always use `CREATE TABLE IF NOT EXISTS` for idempotency
- Add indexes for frequently queried columns
- Include descriptive JSDoc comments
- Use the `// @ts-ignore` comment for `useDatabase()` imports

### Database Access

Access the database in server-side code using:

```typescript
// biome-ignore lint/suspicious/noTsIgnore: Nitro experimental database feature
// @ts-ignore
import { useDatabase } from "#imports";

const db = useDatabase();
const result = await db.sql`SELECT * FROM users WHERE id = ${userId}`;
```

---

## Code Standards

### TypeScript

**Strict Type Safety:**

- NO `any` types - Biome will error on explicit `any`
- Use Zod schemas for runtime validation
- Leverage Nuxt's auto-imports for type inference
- Required `@ts-ignore` for experimental Nitro database features (see migration examples)

**Import Patterns:**

- Use `#imports` for Nuxt auto-imports
- Use `@/` or `~/` for project root imports (both work in Nuxt 4)
- Relative imports for local files

### Biome Configuration

**Code Style:**

- Indentation: 2 spaces
- Line width: 100 characters
- Quotes: Double quotes
- Semicolons: Always required
- Import organization: Enabled (auto-sorts imports)

**Linting Rules:**

- `noExplicitAny`: Error (never use `any`)
- `noNonNullAssertion`: Warning (avoid `!` operator)
- `useConst`: Error (prefer `const` over `let`)
- `useTemplate`: Error (use template literals, not concatenation)

**Running Biome:**

```bash
pnpx biome check .              # Check for issues
pnpx biome check . --write      # Auto-fix issues
pnpx biome format . --write     # Format code
```

### Vue Components

- Use `<script setup>` syntax for composition API
- Define props with TypeScript interfaces
- Use Nuxt auto-imports (no need to import `ref`, `computed`, etc.)
- Follow Vue 3 best practices

---

## Common Patterns & Gotchas

### Nuxt-Specific Patterns

**Auto-Imports:**

Nuxt auto-imports many utilities, so you don't need explicit imports for:

- Vue APIs: `ref`, `computed`, `watch`, `onMounted`, etc.
- Nuxt composables: `useRoute`, `useRouter`, `useFetch`, `useState`, etc.
- Custom composables from `app/composables/`

**Server vs. Client:**

- Code in `server/` only runs on the server
- Code in `app/` can run on both server (SSR) and client
- Use `import.meta.server` or `import.meta.client` to conditionally execute code
- Database access is server-only

**File-Based Routing:**

- Files in `app/pages/` automatically create routes
- `pages/index.vue` -> `/`
- `pages/about.vue` -> `/about`
- `pages/users/[id].vue` -> `/users/:id` (dynamic route)

### Database Gotchas

**Experimental Feature:**

The Nitro database feature is experimental. Always use the `@ts-ignore` pattern shown in migration examples.

**SQL Tagged Templates:**

Use tagged template literals for SQL queries:

```typescript
// Correct - parameterized, safe from SQL injection
await db.sql`SELECT * FROM users WHERE id = ${userId}`;

// Wrong - string concatenation, vulnerable to SQL injection
await db.sql`SELECT * FROM users WHERE id = '${userId}'`;
```

**Type Safety:**

Define Zod schemas in `server/database/types.ts` for runtime validation of query results.

---

## Testing & Validation

### Type Checking (REQUIRED)

**Always run after changes:**

```bash
pnpm typecheck
```

This uses Nuxt's built-in TypeScript checking and must pass before committing code.

### Build Verification

**Verify production builds work:**

```bash
pnpm build
```

This ensures:

- All TypeScript types are valid
- All imports resolve correctly
- No runtime errors during build
- Nuxt can generate the production bundle

### Development Testing

```bash
pnpm dev          # Start dev server on http://localhost:3000
```

---

## Environment & Configuration

### Required Versions

- Node.js: **24.x**
- pnpm: **10.x**

### Configuration Files

- `nuxt.config.ts` - Nuxt configuration (modules, app settings, Nitro config)
- `tsconfig.json` - TypeScript configuration (references Nuxt's generated configs)
- `biome.jsonc` - Biome linting and formatting rules
- `.gitignore` - Ignores `.nuxt/`, `.output/`, `.data/`, `node_modules/`

### Environment Variables

- Store secrets in `.env` (gitignored)
- Use `process.env.VARIABLE_NAME` in server code
- Use runtime config for client-side env vars (see Nuxt docs)

---

## Deployment

Deployment is automated via GitHub Actions on push to `main`:

1. Installs dependencies with pnpm
2. Builds the application (`pnpm build`) with Cloudflare environment variables
3. Deploys to Cloudflare Workers using the Wrangler GitHub Action
4. Database migrations run automatically when the Worker starts

See `.github/workflows/deploy.yaml` for details and `README.md` for initial Cloudflare setup instructions.

---

## Key Takeaways for Agents

1. **Always run `pnpm typecheck` after any code change** - this is the primary success criterion
2. Use Biome for code quality - follow the configured rules strictly
3. Respect the Nuxt auto-import system - don't add unnecessary imports
4. Use the `@ts-ignore` pattern for experimental database features
5. Follow the migration pattern exactly when creating database changes
6. Test both development (`pnpm dev`) and production (`pnpm build`) builds
7. Never commit files in `.nuxt/`, `.output/`, or `.data/`
8. Always use parameterized queries for database access (SQL tagged templates)

---

## Additional Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Biome Documentation](https://biomejs.dev/)
- [Nitro Documentation](https://nitro.unjs.io/)
