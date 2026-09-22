"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";

import { slugify, starterBlocks } from "@/types/landing";

// --- Authorization helper (mirrors src/app/admin/actions.ts) ---
async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lala_admin_session")?.value;
  const session = verifySessionToken(token);
  if (!session) {
    throw new Error("Unauthorized access. Please login first.");
  }
  return session;
}

/**
 * Refresh the admin list plus the public page for one slug.
 * Landing pages are noindex by design, so the sitemap is untouched.
 */
function revalidateLanding(slug?: string) {
  revalidatePath("/admin/landing");
  if (slug) revalidatePath(`/lp/${slug}`);
}

/**
 * Ensure a slug is unique, appending -2, -3 … when taken.
 * `exceptId` lets a page keep its own slug while editing.
 */
async function uniqueSlug(desired: string, exceptId?: string): Promise<string> {
  const base = slugify(desired) || "campaign";
  let candidate = base;
  let n = 2;
  // Slug count is small (campaign pages), so a loop is fine here.
  for (;;) {
    const clash = await db.landingPage.findUnique({ where: { slug: candidate } });
    if (!clash || clash.id === exceptId) return candidate;
    candidate = `${base}-${n++}`;
  }
}

// --- Page CRUD --------------------------------------------------------

export async function createLandingPageAction(name: string, slugInput: string) {
  await verifyAdminAuth();

  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("Campaign name is required.");

  const slug = await uniqueSlug(slugInput || trimmed);

  const page = await db.landingPage.create({
    data: {
      name: trimmed,
      slug,
      seoTitle: trimmed,
      seoDescription: "Magical bedtime stories for kids aged 3–10.",
      blocks: JSON.stringify(starterBlocks()),
      isPublished: false,
    },
  });

  revalidateLanding(slug);
  return { id: page.id, slug: page.slug };
}

export async function updateLandingPageAction(
  id: string,
  data: {
    name: string;
    slug: string;
    seoTitle: string;
    seoDescription: string;
    ogImageUrl: string;
    metaPixelId: string;
    bgType: string;
    bgImageUrl: string;
    bgVideoUrl: string;
    bgOverlay: number;
    blocks: string;
  }
) {
  await verifyAdminAuth();
  if (!id) throw new Error("Missing page ID.");

  const existing = await db.landingPage.findUnique({ where: { id } });
  if (!existing) throw new Error("Landing page not found.");

  if (!data.name?.trim()) throw new Error("Campaign name is required.");
  if (!data.seoTitle?.trim()) throw new Error("SEO title is required.");

  const slug = await uniqueSlug(data.slug || data.name, id);

  await db.landingPage.update({
    where: { id },
    data: {
      name: data.name.trim(),
      slug,
      seoTitle: data.seoTitle.trim(),
      seoDescription: (data.seoDescription || "").trim(),
      ogImageUrl: data.ogImageUrl || null,
      metaPixelId: (data.metaPixelId || "").trim() || null,
      bgType: data.bgType || "stars",
      bgImageUrl: data.bgImageUrl || null,
      bgVideoUrl: data.bgVideoUrl || null,
      bgOverlay: Math.min(100, Math.max(0, Number(data.bgOverlay) || 0)),
      blocks: data.blocks || "[]",
      updatedAt: new Date(),
    },
  });

  // The slug may have changed — refresh both old and new public paths.
  revalidateLanding(slug);
  if (existing.slug !== slug) revalidatePath(`/lp/${existing.slug}`);
  return { slug };
}

export async function togglePublishAction(id: string, isPublished: boolean) {
  await verifyAdminAuth();
  if (!id) throw new Error("Missing page ID.");

  const page = await db.landingPage.update({
    where: { id },
    data: { isPublished, updatedAt: new Date() },
  });

  revalidateLanding(page.slug);
}

export async function duplicateLandingPageAction(id: string) {
  await verifyAdminAuth();

  const source = await db.landingPage.findUnique({ where: { id } });
  if (!source) throw new Error("Landing page not found.");

  const slug = await uniqueSlug(`${source.slug}-copy`);

  const copy = await db.landingPage.create({
    data: {
      name: `${source.name} (Copy)`,
      slug,
      // A duplicate always starts unpublished so it can't go live by accident.
      isPublished: false,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      ogImageUrl: source.ogImageUrl,
      metaPixelId: source.metaPixelId,
      bgType: source.bgType,
      bgImageUrl: source.bgImageUrl,
      bgVideoUrl: source.bgVideoUrl,
      bgOverlay: source.bgOverlay,
      blocks: source.blocks,
    },
  });

  revalidateLanding(slug);
  return { id: copy.id };
}

export async function deleteLandingPageAction(id: string) {
  await verifyAdminAuth();
  if (!id) throw new Error("Missing page ID.");

  const page = await db.landingPage.findUnique({ where: { id } });
  if (!page) return;

  // Leads outlive the page they came from — detach rather than delete,
  // so a deleted campaign never destroys collected contacts.
  await db.lead.updateMany({ where: { landingPageId: id }, data: { landingPageId: null } });
  await db.landingPage.delete({ where: { id } });

  revalidateLanding(page.slug);
}

// Media uploads go straight from the browser to Cloudinary — see
// src/lib/uploadClient.ts and src/app/admin/upload-actions.ts. Routing the
// bytes through a server action would hit the serverless body size cap.

// --- Leads ------------------------------------------------------------

/**
 * Public — called from the landing page lead form. Deliberately has no
 * auth check; anyone visiting an ad can submit.
 */
export async function submitLeadAction(data: {
  landingPageId: string;
  name: string;
  phone: string;
  email?: string;
  responses?: Record<string, string>;
  source?: string;
  campaign?: string;
}) {
  const name = (data.name || "").trim();
  const phone = (data.phone || "").trim();

  if (!name) throw new Error("Please enter your name.");
  if (!phone) throw new Error("Please enter your phone number.");

  // Loose check — international formats vary, we only reject obvious junk.
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 7 || digits.length > 15) {
    throw new Error("Please enter a valid phone number.");
  }

  const email = (data.email || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  // Only attach a page id that actually exists, so a stale form can't
  // fail the whole submission on a foreign key.
  let landingPageId: string | null = null;
  if (data.landingPageId) {
    const page = await db.landingPage.findUnique({ where: { id: data.landingPageId } });
    landingPageId = page?.id ?? null;
  }

  await db.lead.create({
    data: {
      landingPageId,
      name,
      phone,
      email,
      responses: JSON.stringify(data.responses || {}),
      source: (data.source || "").slice(0, 200),
      campaign: (data.campaign || "").slice(0, 200),
    },
  });

  revalidatePath("/admin/landing");
  return { ok: true };
}

export async function updateLeadStatusAction(id: string, status: string) {
  await verifyAdminAuth();
  if (!id) throw new Error("Missing lead ID.");

  const allowed = ["New", "Contacted", "Converted", "Rejected"];
  if (!allowed.includes(status)) throw new Error("Invalid status.");

  await db.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/landing");
}

export async function updateLeadNotesAction(id: string, notes: string) {
  await verifyAdminAuth();
  if (!id) throw new Error("Missing lead ID.");

  await db.lead.update({ where: { id }, data: { notes: (notes || "").slice(0, 2000) } });
  revalidatePath("/admin/landing");
}

export async function deleteLeadAction(id: string) {
  await verifyAdminAuth();
  if (!id) throw new Error("Missing lead ID.");

  await db.lead.delete({ where: { id } });
  revalidatePath("/admin/landing");
}
