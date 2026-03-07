# webapp

A web application built with Nuxt 4, deployed to Cloudflare Workers with D1 database.

## Development

**No environment variables required for local development!** The application automatically uses SQLite in development mode.

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The development server will be available at `http://localhost:3000`.

### Database

- **Development**: Uses SQLite (stored in `.data/`)
- **Production**: Uses Cloudflare D1

Database migrations run automatically when the application starts. To add new migrations, see `server/database/migrations/`.

## Deployment

Deploys to Cloudflare Workers with D1 database. Deployment is automated via GitHub Actions on every push to `main`.

### Initial Cloudflare Setup

Before your first deployment, complete these one-time setup steps:

#### 1. Create a Cloudflare Account

If you don't have one already, sign up at [cloudflare.com](https://dash.cloudflare.com/sign-up).

#### 2. Install Wrangler CLI

```bash
# Install globally (recommended)
pnpm add -g wrangler

# Or use pnpx (no installation required)
pnpx wrangler --version
```

#### 3. Authenticate with Cloudflare

```bash
pnpx wrangler login
```

This opens a browser window to authorize Wrangler with your Cloudflare account.

#### 4. Find Your Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select "Workers & Pages" from the sidebar
3. Find "Account ID" in the right sidebar
4. Copy this value for later use

#### 5. Create a D1 Database

```bash
pnpx wrangler d1 create <database-name>
```

Replace `<database-name>` with your desired database name (e.g., `webapp-db`).

This will output:

```
Created D1 database '<database-name>'

[[d1_databases]]
binding = "DB"
database_name = "<database-name>"
database_id = "<database-id>"
```

Save both `database_name` and `database_id` for the GitHub configuration.

#### 6. Create a Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Select "Use template" next to "Edit Cloudflare Workers"
4. Configure the token:
   - **Account Resources**: Include your account
   - **Zone Resources**: Include all zones (or specific zones if preferred)
5. Click "Continue to summary" and then "Create Token"
6. Copy the token immediately (it won't be shown again)

### GitHub Configuration

After completing the Cloudflare setup, configure your GitHub repository:

#### Secrets (Settings > Secrets and variables > Actions > Secrets)

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | The API token created in step 6 above |

#### Variables (Settings > Secrets and variables > Actions > Variables)

| Variable | Description | Example |
|----------|-------------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID (from step 4) | `abc123def456...` |
| `APP_NAME` | Worker name (unique identifier for your app) | `webapp` |
| `D1_DATABASE_NAME` | D1 database name (from step 5) | `webapp-db` |
| `D1_DATABASE_ID` | D1 database ID (from step 5) | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |

### Deployment Process

1. Push to `main` branch
2. GitHub Actions builds the application
3. Wrangler deploys to Cloudflare Workers
4. Migrations run automatically on first request

### Manual Deployment

For manual deployment from your local machine:

```bash
# Set environment variables
export APP_NAME=webapp
export D1_DATABASE_NAME=webapp-db
export D1_DATABASE_ID=your-database-id

# Build for production
pnpm run build

# Deploy (requires wrangler login)
pnpx wrangler deploy
```

## Project Structure

```
app/
  components/     # Vue components
  composables/    # Vue composables
server/
  api/v1/         # API routes
  database/
    migrations/   # Database migration files
    migrations.ts # Migration runner
  plugins/        # Nitro plugins (including database init)
shared/           # Shared code between app and server
```

For detailed structure information, see `AGENTS.md`.

## Cave

To update the allowed hosts for a cave instance, use the following SQLite command:

```bash
sudo /home/linuxbrew/.linuxbrew/bin/sqlite3 /opt/cave/packages/platform/.data/cave.sqlite "update caves set allowed_hosts = '[\"vuejs.org\", \"v2.vuejs.org\", \"v3-migration.vuejs.org\", \"eslint.vuejs.org\", \"vue-loader.vuejs.org\", \"pinia.vuejs.org\", \"router.vuejs.org\", \"nuxt.com\", \"ui.nuxt.com\", \"nitro.build\", \"vitejs.dev\", \"tailwindcss.com\", \"typescriptlang.org\", \"reka-ui.com\", \"auto-animate.formkit.com\", \"floating-ui.com\", \"greensock.com\", \"gsap.com\", \"tanstack.com\", \"vueuse.org\", \"xstate.js.org\", \"github.com\", \"gist.github.com\", \"raw.githubusercontent.com\", \"developer.mozilla.org\", \"web.dev\", \"npmjs.com\", \"vueschool.io\", \"escuelavue.es\", \"michaelnthiessen.com\", \"dev.to\", \"csstriggers.com\", \"aerotwist.com\", \"csswizardry.com\", \"deepscan.io\", \"cheatsheetseries.owasp.org\", \"immerjs.github.io\", \"codemag.com\", \"telerik.com\", \"madewithlove.com\", \"engineering.simpl.de\", \"api.github.com\", \"*.githubusercontent.com\", \"registry.npmjs.org\", \"npmjs.org\", \"fnm.vercel.app\", \"*.vercel.app\", \"nodejs.org\", \"*.nodejs.org\", \"*.canonical.com\", \"*.snapcraft.io\", \"*.ubuntu.com\", \"*.snapcraftcontent.com\", \"api.anthropic.com\", \"claude.ai\", \"*.anthropic.com\", \"storage.googleapis.com\", \"platform.claude.com\", \"opencode.ai\", \"*.opencode.ai\", \"models.dev\", \"update.code.visualstudio.com\", \"vscode.download.prss.microsoft.com\", \"tailscale.com\", \"*.tailscale.com\", \"controlplane.tailscale.com\", \"login.tailscale.com\", \"dns.nextdns.io\", \"*.dns.nextdns.io\", \"letsencrypt.org\", \"*.letsencrypt.org\", \"*.api.letsencrypt.org\"]' where id = '<id-of-the-cave>';"
```

Replace `<id-of-the-cave>` with the actual cave ID. This will not be necessary in the future when cave config files in repository have landed.
