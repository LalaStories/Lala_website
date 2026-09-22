import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";
import { db } from "@/lib/db";
import LandingAdmin from "./LandingAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Landing Pages — LALA Admin",
  description: "Build and manage campaign landing pages for Meta ads.",
};

export default async function LandingAdminPage() {
  // Same session guard as the main dashboard.
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get("lala_admin_session")?.value);
  if (!session) redirect("/admin/login");

  const [pages, leads] = await Promise.all([
    db.landingPage.findMany({
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { leads: true } } },
    }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: { landingPage: { select: { name: true, slug: true } } },
    }),
  ]);

  return (
    <LandingAdmin
      initialPages={pages.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        isPublished: p.isPublished,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        ogImageUrl: p.ogImageUrl || "",
        metaPixelId: p.metaPixelId || "",
        bgType: p.bgType,
        bgImageUrl: p.bgImageUrl || "",
        bgVideoUrl: p.bgVideoUrl || "",
        bgOverlay: p.bgOverlay,
        blocks: p.blocks,
        views: p.views,
        leadCount: p._count.leads,
        updatedAt: p.updatedAt.toISOString(),
      }))}
      initialLeads={leads.map((l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        email: l.email,
        responses: l.responses,
        status: l.status,
        notes: l.notes,
        source: l.source,
        campaign: l.campaign,
        pageName: l.landingPage?.name || "—",
        createdAt: l.createdAt.toISOString(),
      }))}
    />
  );
}
