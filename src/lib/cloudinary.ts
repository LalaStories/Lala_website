import { v2 as cloudinary } from "cloudinary";

// Configure once — reads from env vars set in Railway dashboard
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
