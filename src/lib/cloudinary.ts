import { v2 as cloudinary } from "cloudinary";

// Configure once — reads from env vars set in the hosting dashboard
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string;
  resourceType: "video" | "image" | "auto";
}

/**
 * Sign a browser-side upload so the file goes straight to Cloudinary.
 *
 * Serverless platforms cap request bodies (Vercel at 4.5MB), which is far
 * below a background video. Signing here and uploading from the browser
 * keeps the bytes off our server entirely, so size is bound only by the
 * Cloudinary plan. The API secret never leaves the server.
 */
export function createUploadSignature(
  folder: string,
  resourceType: "video" | "image" | "auto" = "auto",
  originalName = "file"
): UploadSignature {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `${Date.now()}_${originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  // Only the params sent with the upload may be signed, in alphabetical order.
  const signature = cloudinary.utils.api_sign_request(
    { folder, public_id: publicId, timestamp },
    apiSecret
  );

  return { signature, timestamp, apiKey, cloudName, folder, publicId, resourceType };
}

/**
 * Upload any File object to Cloudinary.
 * @param file    The File from FormData
 * @param folder  Cloudinary folder name e.g. "lala/videos", "lala/images"
 * @param resourceType  "video" | "image" | "auto"
 * @returns Secure HTTPS URL of the uploaded file
 */
export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "video" | "image" | "auto" = "auto"
): Promise<string> {
  // Convert File → ArrayBuffer → Buffer → base64 data URI
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
    // Use original filename (sanitised) as the public ID
    public_id: `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
  });

  return result.secure_url;
}

/**
 * Delete a file from Cloudinary by its URL.
 * Safe to call even if the URL is external or empty — does nothing in that case.
 */
export async function deleteFromCloudinary(url: string): Promise<void> {
  if (!url || !url.includes("cloudinary.com")) return;

  try {
    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/<cloud>/video/upload/v123/<folder>/<public_id>.<ext>
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (!matches) return;
    const publicId = matches[1];
    await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
  } catch (err) {
    console.error("Failed to delete from Cloudinary:", url, err);
  }
}
