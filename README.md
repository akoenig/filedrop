# filedrop

A minimal file sharing service. Upload files via API, share them with a link, download from the browser or curl. Files expire automatically after 7 days.

Deployed on Cloudflare Workers with R2 for object storage.

## How it works

**Upload a file:**

```bash
curl -X POST "https://your-domain.com/files?token=YOUR_TOKEN" \
  -F "file=@document.pdf"
```

Response:

```json
{
  "url": "https://your-domain.com/a3xK9f2b",
  "expiresAt": "2026-03-15T12:00:00.000Z"
}
```

**Download via browser:** Open the URL — a download page is rendered with file info and a download button.

**Download via curl:** The file is streamed directly.

```bash
curl -O https://your-domain.com/a3xK9f2b
```

Authentication is also supported via the `Authorization` header:

```bash
curl -X POST "https://your-domain.com/files" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"
```

## Development

```bash
pnpm install
pnpm dev
```

The dev server starts at `http://localhost:3000`. Note that R2 is not available during `nuxt dev` — file upload/download requires deploying to Cloudflare or running `wrangler dev` on the build output.

## Deployment

Automated via GitHub Actions on push to `main`.

### Initial setup

#### 1. Cloudflare

- **Account ID:** Dashboard overview page, right sidebar.
- **R2 bucket:** Go to R2 Object Storage > Create bucket. Name it `filedrop` (or your preference). Optionally add a lifecycle rule to auto-delete objects after 7 days.
- **API token:** My Profile > API Tokens > Create Token. Use the "Edit Cloudflare Workers" template and add R2 read/write permissions.

#### 2. GitHub repository

Go to Settings > Secrets and variables > Actions.

**Secrets:**

| Secret                  | Description                        |
| ----------------------- | ---------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | API token from step 1              |
| `NUXT_UPLOAD_TOKEN`     | Token callers use to upload files  |

**Variables:**

| Variable                | Description              | Example     |
| ----------------------- | ------------------------ | ----------- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID    | `abc123...` |
| `APP_NAME`              | Cloudflare Worker name   | `filedrop`  |
| `R2_BUCKET_NAME`        | R2 bucket name           | `filedrop`  |

#### 3. Deploy

Push to `main`. GitHub Actions builds the app, generates the Wrangler config (including the R2 binding and upload token), and deploys to Cloudflare Workers.

## Project structure

```
app/
  pages/
    index.vue         # Landing page
    [id].vue          # Download page
  layouts/
    default.vue       # App layout
  assets/css/
    main.css          # Tailwind + Geist font + animations
server/
  routes/
    files.post.ts     # POST /files — upload endpoint
  api/files/
    [id].get.ts       # GET /api/files/:id — file metadata
  middleware/
    download.ts       # Content negotiation (HTML vs raw file)
  utils/
    r2.ts             # R2 bucket access + types
    id.ts             # Short ID generation
    expiration.ts     # 7-day expiration logic
shared/utils/
  format.ts           # File size, MIME labels, expiry formatting
```
