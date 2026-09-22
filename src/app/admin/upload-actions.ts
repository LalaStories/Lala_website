"use server";

import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { createUploadSignature, UploadSignature } from "@/lib/cloudinary";

/**
 * Hand the browser a short-lived signature so it can upload a file straight
 * to Cloudinary, bypassing the serverless request body limit.
 *
 * Only the signature crosses the wire — the file never touches this server.
 * Admin auth is still required, so anonymous visitors cannot get one.
 */
export async function getUploadSignatureAction(
  folder: string,
  resourceType: "video" | "image" | "auto",
  originalName: string
): Promise<UploadSignature> {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get("lala_admin_session")?.value);
  if (!session) {
    throw new Error("Unauthorized access. Please login first.");
  }

  // Restrict uploads to our own folder tree so a tampered client cannot
  // scatter files across the Cloudinary account.
  const safeFolder = folder.startsWith("lala/") ? folder : "lala/uploads";

  return createUploadSignature(safeFolder, resourceType, originalName);
}
