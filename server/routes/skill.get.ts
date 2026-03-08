/**
 * GET /skill
 *
 * Serves the filedrop SKILL.md so that AI agents can discover
 * and learn how to interact with this service.
 *
 * Install via: pnpx skills add https://filedrop.andrekoenig.com/skill
 */

const SKILL_CONTENT = `# Skill: filedrop

Upload and share files via short-lived links. Files expire after 7 days.

## When to Use

- When you need to share a file with someone via a URL
- When you need to make a generated artifact (build output, report, export) downloadable
- When you need temporary file hosting that cleans up automatically

## API

### Upload a file

\`\`\`
POST /files
\`\`\`

**Authentication** (required — use one of these):

- Query parameter: \`?token=<token>\`
- Header: \`Authorization: Bearer <token>\`

**Request:** Multipart form data with a \`file\` field.

\`\`\`bash
curl -X POST "https://filedrop.andrekoenig.com/files?token=TOKEN" \\
  -F "file=@path/to/file.pdf"
\`\`\`

**Response** (200):

\`\`\`json
{
  "url": "https://filedrop.andrekoenig.com/a3xK9f2b",
  "expiresAt": "2026-03-15T12:00:00.000Z"
}
\`\`\`

**Errors:**

| Status | Meaning |
|--------|---------|
| 400 | No file provided — send multipart form with a \`file\` field |
| 401 | Invalid or missing token |
| 500 | Upload token not configured on server |

### Download a file

\`\`\`
GET /:id
\`\`\`

No authentication required. Behavior depends on the client:

- **curl / wget** (no \`Accept: text/html\`): Streams the raw file with \`Content-Disposition: attachment\`.
- **Browser** (\`Accept: text/html\`): Renders an HTML download page.
- **Explicit download**: Append \`?download=true\` to force raw file download regardless of \`Accept\` header.

\`\`\`bash
# Download directly
curl -O https://filedrop.andrekoenig.com/a3xK9f2b

# Force download (useful in scripts)
curl -O https://filedrop.andrekoenig.com/a3xK9f2b?download=true
\`\`\`

**Errors:**

| Status | Meaning |
|--------|---------|
| 404 | File not found |
| 410 | File has expired |

### Get file metadata

\`\`\`
GET /api/files/:id
\`\`\`

Returns file information without downloading the file contents.

\`\`\`bash
curl https://filedrop.andrekoenig.com/api/files/a3xK9f2b
\`\`\`

**Response** (200):

\`\`\`json
{
  "id": "a3xK9f2b",
  "filename": "document.pdf",
  "contentType": "application/pdf",
  "size": 245760,
  "uploadedAt": "2026-03-08T12:00:00.000Z",
  "expiresAt": "2026-03-15T12:00:00.000Z",
  "expired": false
}
\`\`\`

**Errors:**

| Status | Meaning |
|--------|---------|
| 404 | File not found |

## Limits

- Maximum file size: 100 MB
- File expiration: 7 days after upload
- File IDs: 8-character alphanumeric strings
`;

export default defineEventHandler((event) => {
  setHeader(event, "content-type", "text/markdown; charset=utf-8");
  return SKILL_CONTENT;
});
