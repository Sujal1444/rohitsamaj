import { ObjectId } from "mongodb";
import { listingImagesBucket } from "./db.server";

export const maxListingImageBytes = 10 * 1024 * 1024;

const imageSignatures: Record<string, (bytes: Buffer) => boolean> = {
  "image/jpeg": (bytes) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": (bytes) => bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "image/webp": (bytes) => bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP",
};

export async function storeListingImage(image: string) {
  if (!image.startsWith("data:")) return image;

  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(image);
  if (!match) throw new Error("INVALID_IMAGE");

  const contentType = match[1];
  const encoded = match[2];
  if (!contentType || !encoded) throw new Error("INVALID_IMAGE");
  if (encoded.length > Math.ceil(maxListingImageBytes / 3) * 4) throw new Error("IMAGE_TOO_LARGE");
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.byteLength > maxListingImageBytes) throw new Error("IMAGE_TOO_LARGE");
  const matchesImageSignature = imageSignatures[contentType];
  if (!matchesImageSignature || !matchesImageSignature(bytes)) throw new Error("INVALID_IMAGE");

  const bucket = await listingImagesBucket();
  const upload = bucket.openUploadStream(`listing-image-${Date.now()}`, { metadata: { contentType } });
  await new Promise<void>((resolve, reject) => {
    upload.once("finish", resolve);
    upload.once("error", reject);
    upload.end(bytes);
  });

  return `/api/listing-images/${(upload.id as ObjectId).toHexString()}`;
}

export async function readListingImage(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const objectId = new ObjectId(id);
  const bucket = await listingImagesBucket();
  const file = await bucket.find({ _id: objectId }).next();
  if (!file) return null;

  const contentType = file.metadata?.["contentType"];
  if (typeof contentType !== "string" || !imageSignatures[contentType]) return null;

  const chunks: Buffer[] = [];
  for await (const chunk of bucket.openDownloadStream(objectId)) chunks.push(Buffer.from(chunk));
  return { bytes: Buffer.concat(chunks), contentType };
}
