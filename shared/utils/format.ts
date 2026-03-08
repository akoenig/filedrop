/**
 * Formats a byte count into a human-readable file size string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * Converts a MIME content type to a short, human-readable label.
 */
export function getFileTypeLabel(contentType: string): string {
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "application/zip": "ZIP Archive",
    "application/x-tar": "TAR Archive",
    "application/gzip": "GZIP Archive",
    "application/x-7z-compressed": "7-Zip Archive",
    "application/x-rar-compressed": "RAR Archive",
    "application/json": "JSON",
    "application/xml": "XML",
    "application/javascript": "JavaScript",
    "text/plain": "Text",
    "text/html": "HTML",
    "text/css": "CSS",
    "text/csv": "CSV",
    "text/markdown": "Markdown",
  };

  if (map[contentType]) return map[contentType];

  // Handle broad categories
  if (contentType.startsWith("image/")) {
    return contentType.replace("image/", "").toUpperCase();
  }
  if (contentType.startsWith("video/")) {
    return contentType.replace("video/", "").toUpperCase();
  }
  if (contentType.startsWith("audio/")) {
    return contentType.replace("audio/", "").toUpperCase();
  }
  if (contentType.startsWith("font/")) {
    return "Font";
  }

  return "File";
}

/**
 * Returns a human-readable string describing time until expiration.
 */
export function formatTimeUntilExpiry(expiresAt: Date): string {
  const diff = expiresAt.getTime() - Date.now();

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `Expires in ${days} day${days !== 1 ? "s" : ""}`;
  if (hours > 0) return `Expires in ${hours} hour${hours !== 1 ? "s" : ""}`;
  return "Expires soon";
}
