import { Image, S3Client } from "bun";
import { v4 as uuidv4 } from "uuid";
import { config } from "./config";
import { ALLOWED_IMAGE_TYPES, MAX_BYTES } from "./constants";
import { WebError } from "./errors";

const r2 = new S3Client({
  region: "auto",
  accessKeyId: config.R2_ACCESS_KEY_ID,
  secretAccessKey: config.R2_SECRET_ACCESS_KEY,
  bucket: config.R2_BUCKET,
  endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});

export async function uploadImage(productId: string, file: File) {
  if (file.size === 0) {
    throw new WebError("bad_request:r2", "Empty file");
  }
  if (file.size > MAX_BYTES) {
    throw new WebError("bad_request:r2", "File too large (max 10MB)");
  }

  const contentType = (file.type || "").toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    throw new WebError("bad_request:r2", "Unsupported image type");
  }

  try {
    const key = `products/${productId}/${uuidv4()}.webp`;

    const input = Buffer.from(await file.arrayBuffer());
    const image = await new Image(input).webp({ quality: 92 }).blob();

    await r2.file(key).write(image, {
      type: "image/webp",
    });

    return { key };
  } catch {
    throw new WebError("bad_request:r2", "Failed to upload an image to R2");
  }
}

export async function deleteImage(key: string) {
  try {
    await r2.file(key).delete();
  } catch {
    throw new WebError("bad_request:r2", "Failed to delete an image from R2");
  }
}
