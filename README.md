# filedrop

A minimal file sharing service designed for AI agents. Upload files via API, share them with a link, download from the browser or curl. Files expire automatically after 7 days.

Deployed on Cloudflare Workers with R2 for object storage.

## Agent skill

filedrop ships a machine-readable skill definition so that AI agents can interact with the service autonomously:

```bash
pnpx skills add https://your-domain.com/skill
```

## Usage

**Upload:**

```bash
curl -X POST "https://your-domain.com/files?token=YOUR_TOKEN" \
  -F "file=@document.pdf"
# => {"url":"https://your-domain.com/a3xK9f2b","expiresAt":"2026-03-15T12:00:00.000Z"}
```

**Download (curl):** streams the file directly.

```bash
curl -O https://your-domain.com/a3xK9f2b
```

**Download (browser):** renders a download page with file info and a download button.

## Deploy your own

Everything runs on Cloudflare (Workers + R2). Deployment is automated via GitHub Actions.

### 1. Fork and clone

```bash
git clone https://github.com/your-username/filedrop.git
cd filedrop && pnpm install
```

### 2. Create the R2 bucket

In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **R2 Object Storage** and create a bucket (e.g. `filedrop`). Optionally add a lifecycle rule to auto-delete objects after 7 days.

### 3. Create an API token

Go to **My Profile > API Tokens > Create Token**. Use the **"Edit Cloudflare Workers"** template and add **R2 read/write** permissions.

### 4. Configure GitHub Actions

In your repo, go to **Settings > Secrets and variables > Actions** and add:

**Secrets:**

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | The API token from step 3 |
| `NUXT_UPLOAD_TOKEN` | Any string — this is the token callers pass when uploading |

**Variables:**

| Variable | Value |
|----------|-------|
| `CLOUDFLARE_ACCOUNT_ID` | Your account ID (visible on the Cloudflare dashboard overview page) |
| `APP_NAME` | Worker name, e.g. `filedrop` |
| `R2_BUCKET_NAME` | Bucket name from step 2, e.g. `filedrop` |

### 5. Push to `main`

```bash
git push origin main
```

GitHub Actions builds the app and deploys it to Cloudflare Workers. Your service will be available at `https://<APP_NAME>.<your-subdomain>.workers.dev`.
