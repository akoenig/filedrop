// biome-ignore lint/suspicious/noTsIgnore: Nitro experimental database feature, type works at runtime
// @ts-ignore
import { useDatabase } from "#imports";
import { MigrationRowSchema } from "./types.js";

/**
 * Represents a database migration.
 */
export interface Migration {
  /** Unique migration identifier (e.g., "001_create_caves_table") */
  name: string;
  /** Migration function that executes the schema changes */
  up: () => Promise<void>;
}

/**
 * Ensures the migrations tracking table exists.
 */
async function ensureMigrationsTable(): Promise<void> {
  const db = useDatabase();
  await db.sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `;
}

/**
 * Gets the list of already applied migration names.
 */
async function getAppliedMigrations(): Promise<string[]> {
  const db = useDatabase();
  const { rows } = await db.sql`SELECT name FROM _migrations ORDER BY id`;
  const names: string[] = [];
  for (const row of rows) {
    const result = MigrationRowSchema.safeParse(row);
    if (result.success) {
      names.push(result.data.name);
    }
  }
  return names;
}

/**
 * Records a migration as applied.
 */
async function recordMigration(name: string): Promise<void> {
  const db = useDatabase();
  await db.sql`INSERT INTO _migrations (name) VALUES (${name})`;
}

/**
 * Runs all pending migrations in order.
 * @param migrations - Array of migrations to potentially run
 * @returns Number of migrations applied
 */
export async function runMigrations(migrations: Migration[]): Promise<number> {
  await ensureMigrationsTable();

  const applied = await getAppliedMigrations();
  const pending = migrations.filter((m) => !applied.includes(m.name));

  if (pending.length === 0) {
    console.log("[migrations] No pending migrations");
    return 0;
  }

  console.log(`[migrations] Running ${pending.length} pending migration(s)...`);

  for (const migration of pending) {
    console.log(`[migrations] Applying: ${migration.name}`);
    await migration.up();
    await recordMigration(migration.name);
    console.log(`[migrations] Applied: ${migration.name}`);
  }

  return pending.length;
}