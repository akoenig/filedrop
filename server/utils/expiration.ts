const EXPIRATION_DAYS = 7;
const EXPIRATION_MS = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Checks whether a file has expired based on its upload timestamp.
 */
export function isExpired(uploadedAt: Date): boolean {
  return Date.now() - uploadedAt.getTime() > EXPIRATION_MS;
}

/**
 * Calculates the expiration date for a file based on its upload timestamp.
 */
export function getExpirationDate(uploadedAt: Date): Date {
  return new Date(uploadedAt.getTime() + EXPIRATION_MS);
}
