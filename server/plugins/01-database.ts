import { runMigrations } from "../database/migrations.js";

/**
 * All migrations to run, in order.
 * Add new migrations here as they are created.
 */
const migrations = [
];

export default defineNitroPlugin(async () => {
  const count = await runMigrations(migrations);
  if (count > 0) {
    console.log(`[database] Applied ${count} migration(s)`);
  }
  console.log("[database] Initialized successfully");
});