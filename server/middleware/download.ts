/**
 * Content negotiation middleware for file downloads.
 *
 * Intercepts GET /:id requests and decides:
 * - If the client accepts text/html (browser) and not ?download=true → pass through to Nuxt page
 * - Otherwise (curl, wget, or explicit download) → stream the file directly from R2
 */
export default defineEventHandler(async (event) => {
  if (event.method !== "GET") return;

  const url = getRequestURL(event);
  const path = url.pathname;

  // Only match single-segment paths that look like file IDs.
  // Skip root, static assets, Nuxt internals, and API routes.
  if (
    path === "/" ||
    path.startsWith("/_nuxt") ||
    path.startsWith("/api") ||
    path.startsWith("/files") ||
    path.startsWith("/skill") ||
    path.startsWith("/__nuxt") ||
    path.includes(".")
  ) {
    return;
  }

  const id = path.slice(1);
  if (!id || id.includes("/")) return;

  const query = getQuery(event);
  const accept = getHeader(event, "accept") || "";
  const wantsDownload = query.download === "true";

  // If the client wants HTML and hasn't explicitly requested a download,
  // let Nuxt render the download page.
  if (accept.includes("text/html") && !wantsDownload) return;

  // Stream the file from R2
  const bucket = useR2Bucket(event);
  const object = await bucket.get(id);

  if (!object) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }

  if (isExpired(object.uploaded)) {
    throw createError({ statusCode: 410, statusMessage: "File has expired" });
  }

  const filename = object.customMetadata?.filename || id;

  // Write R2's HTTP metadata (content-type, cache-control, etc.) to the response
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-disposition", `attachment; filename="${filename}"`);
  headers.set("content-length", String(object.size));

  // Apply headers to the h3 event
  for (const [key, value] of headers.entries()) {
    setHeader(event, key, value);
  }

  return object.body;
});
