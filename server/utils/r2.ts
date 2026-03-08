import type { H3Event } from "h3";

/**
 * Minimal R2 type definitions matching the Cloudflare Workers R2 API.
 * Defined locally to avoid conflicts between @cloudflare/workers-types and @types/node.
 */

export interface R2HttpMetadata {
  contentType?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  contentLanguage?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface R2PutOptions {
  httpMetadata?: R2HttpMetadata | Headers;
  customMetadata?: Record<string, string>;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: R2HttpMetadata;
  customMetadata?: Record<string, string>;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
}

export interface R2Bucket {
  head(key: string): Promise<R2Object | null>;
  get(key: string): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | string | Blob | null,
    options?: R2PutOptions,
  ): Promise<R2Object | null>;
  delete(keys: string | string[]): Promise<void>;
}

/**
 * Access the R2 bucket binding from the Cloudflare Workers environment.
 * Only available when running on Cloudflare Workers (production or `wrangler dev`).
 */
export function useR2Bucket(event: H3Event): R2Bucket {
  // biome-ignore lint/suspicious/noTsIgnore: Cloudflare bindings available at runtime
  // @ts-ignore
  const env = event.context.cloudflare?.env;

  if (!env?.BUCKET) {
    throw createError({
      statusCode: 500,
      statusMessage: "R2 bucket not configured",
    });
  }

  return env.BUCKET as R2Bucket;
}
