import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string;
}

function readConfig(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (
    !accountId ||
    !accessKeyId ||
    !secretAccessKey ||
    !bucket ||
    !publicBaseUrl
  ) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, and R2_PUBLIC_BASE_URL in .env.local",
    );
  }
  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
  };
}

let _client: S3Client | null = null;
let _config: R2Config | null = null;

function getClient(): { client: S3Client; config: R2Config } {
  if (_client && _config) return { client: _client, config: _config };
  const cfg = readConfig();
  _client = new S3Client({
    region: "auto",
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });
  _config = cfg;
  return { client: _client, config: _config };
}

function pickExtension(filename: string, contentType: string): string {
  const fromName = filename.split(".").pop();
  if (fromName && /^[a-z0-9]{2,5}$/i.test(fromName)) {
    return fromName.toLowerCase();
  }
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
  };
  return map[contentType.toLowerCase()] ?? "bin";
}

function safeKey(filename: string, contentType: string): string {
  const ext = pickExtension(filename, contentType);
  const rand = Math.random().toString(36).slice(2, 10);
  const ts = Date.now().toString(36);
  return `products/${ts}-${rand}.${ext}`;
}

export interface UploadedImage {
  url: string;
  key: string;
}

export async function uploadImage(params: {
  filename: string;
  contentType: string;
  body: Buffer | Uint8Array;
}): Promise<UploadedImage> {
  const { client, config } = getClient();
  const key = safeKey(params.filename, params.contentType);
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: params.body,
      ContentType: params.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  const url = `${config.publicBaseUrl}/${key}`;
  return { url, key };
}

export function r2IsConfigured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_BASE_URL,
  );
}
