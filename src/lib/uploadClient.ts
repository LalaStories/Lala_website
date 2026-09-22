"use client";

import { getUploadSignatureAction } from "@/app/admin/upload-actions";

/**
 * Upload a file from the browser straight to Cloudinary.
 *
 * The signature comes from the server, but the bytes go directly to
 * Cloudinary — so a 50MB video is fine even on hosts that cap request
 * bodies at a few megabytes.
 *
 * @param onProgress Called with 0-100 as the upload proceeds.
 * @returns The secure HTTPS URL of the uploaded file.
 */
export async function uploadDirectToCloudinary(
  file: File,
  folder: string,
  resourceType: "video" | "image" | "auto" = "auto",
  onProgress?: (percent: number) => void
): Promise<string> {
  const sig = await getUploadSignatureAction(folder, resourceType, file.name);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);
  form.append("public_id", sig.publicId);

  // "auto" is not a valid endpoint segment; Cloudinary expects "auto" to be
  // spelled out only for the upload preset, so map it to the generic one.
  const endpointType = resourceType === "auto" ? "auto" : resourceType;
  const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${endpointType}/upload`;

  // XHR rather than fetch, because fetch gives no upload progress events.
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.secure_url) {
            onProgress?.(100);
            resolve(res.secure_url as string);
          } else {
            reject(new Error("Upload succeeded but no URL was returned."));
          }
        } catch {
          reject(new Error("Could not read the upload response."));
        }
      } else {
        // Cloudinary returns a helpful message in the error body.
        let message = `Upload failed (${xhr.status}).`;
        try {
          const res = JSON.parse(xhr.responseText);
          if (res?.error?.message) message = res.error.message;
        } catch {
          /* keep the generic message */
        }
        reject(new Error(message));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled.")));

    xhr.send(form);
  });
}
