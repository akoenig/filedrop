/**
 * GET /api/files/:id
 *
 * Returns metadata about an uploaded file (name, size, type, expiration).
 * Used by the download page to display file information.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing file ID" });
  }

  const bucket = useR2Bucket(event);
  const object = await bucket.head(id);

  if (!object) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }

  const uploadedAt = object.uploaded;
  const expiresAt = getExpirationDate(uploadedAt);
  const expired = isExpired(uploadedAt);

  return {
    id,
    filename: object.customMetadata?.filename || id,
    contentType: object.httpMetadata?.contentType || "application/octet-stream",
    size: object.size,
    uploadedAt: uploadedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    expired,
  };
});
