/**
 * POST /files
 *
 * Upload a file to R2 and return the download URL.
 * Requires authentication via `?token=<token>` query parameter
 * or `Authorization: Bearer <token>` header.
 *
 * Expects multipart form data with a `file` field.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  if (!config.uploadToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "Upload token not configured on server",
    });
  }

  // Authenticate: check query param first, then Authorization header
  const query = getQuery(event);
  const authHeader = getHeader(event, "authorization");
  const token =
    (query.token as string | undefined) || authHeader?.replace("Bearer ", "");

  if (token !== config.uploadToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or missing token",
    });
  }

  // Read the uploaded file from multipart form data
  const formData = await readFormData(event);
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "No file provided. Send a multipart form with a 'file' field.",
    });
  }

  const id = generateId();
  const bucket = useR2Bucket(event);

  // Buffer the file — R2 requires known length for reliable uploads.
  // Acceptable for the 100 MB file size limit.
  const buffer = await (file as Blob).arrayBuffer();

  await bucket.put(id, buffer, {
    httpMetadata: {
      contentType: (file as Blob).type || "application/octet-stream",
    },
    customMetadata: {
      filename: (file as File).name || "download",
    },
  });

  const requestUrl = getRequestURL(event);
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

  return {
    url: `${baseUrl}/${id}`,
    expiresAt: getExpirationDate(new Date()).toISOString(),
  };
});
