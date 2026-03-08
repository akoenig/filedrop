---
name: filedrop
description: Upload and share files via short-lived links. Use when you need to share a file with someone via a URL, make a generated artifact downloadable, or need temporary file hosting. Files expire after 7 days.
compatibility: Requires network access and curl or similar HTTP client.
allowed-tools: Bash(curl:*)
metadata:
  author: "André König"
---

## Usage

Upload a file and receive a shareable URL:

```bash
curl -X POST "https://filedrop.andrekoenig.com/files?token=TOKEN" \
  -F "file=@path/to/file.pdf"
```

Response:

```json
{
  "url": "https://filedrop.andrekoenig.com/a3xK9f2b",
  "expiresAt": "2026-03-15T12:00:00.000Z"
}
```

Download a file by ID (saves with the original filename):

```bash
curl -OJ https://filedrop.andrekoenig.com/a3xK9f2b

wget --content-disposition https://filedrop.andrekoenig.com/a3xK9f2b
```

The `-OJ` flags tell curl to use the `Content-Disposition` header sent by the server, which contains the original filename. For wget, the `--content-disposition` flag does the same. Without these flags, the file will be saved as the ID instead.

## API

### POST /files

Uploads a file. Returns a download URL.

**Authentication** (required -- use one):

- Query parameter: `?token=<token>`
- Header: `Authorization: Bearer <token>`

**Request:** Multipart form data with a `file` field.

**Response** (200):

```json
{
  "url": "https://filedrop.andrekoenig.com/a3xK9f2b",
  "expiresAt": "2026-03-15T12:00:00.000Z"
}
```

| Error | Meaning |
|-------|---------|
| 400 | No file provided |
| 401 | Invalid or missing token |

### GET /:id

Downloads a file. No authentication required. The server sets `Content-Disposition` with the original filename.

- `curl -OJ <url>` — saves with the original filename.
- `wget --content-disposition <url>` — saves with the original filename.
- With `Accept: text/html` (browser): renders a download page.

| Error | Meaning |
|-------|---------|
| 404 | File not found |
| 410 | File has expired |

### GET /api/files/:id

Returns file metadata without downloading.

```json
{
  "id": "a3xK9f2b",
  "filename": "document.pdf",
  "contentType": "application/pdf",
  "size": 245760,
  "uploadedAt": "2026-03-08T12:00:00.000Z",
  "expiresAt": "2026-03-15T12:00:00.000Z",
  "expired": false
}
```

## Limits

- Maximum file size: 100 MB
- File expiration: 7 days after upload
- File IDs: 8-character alphanumeric strings
