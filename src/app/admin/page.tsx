import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";
import AdminContent from "./AdminContent";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard — LALA Stories",
  description: "Manage stories, testimonials, and FAQs for LALA Stories.",
};

export default async function AdminPage() {
  // Check auth server-side
  const cookieStore = await cookies();
  const token = cookieStore.get("lala_admin_session")?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch all administrative content in parallel for performance
  const [
    stories,
    testimonials,
    faqs,
    products,
    plans,
    applications,
    settings,
    bgVideos,
    programs,
    admins,
  ] = await Promise.all([
    db.story.findMany({ orderBy: { createdAt: "desc" } }),
    db.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    db.fAQ.findMany({ orderBy: { order: "asc" } }),
    db.product.findMany({ orderBy: { createdAt: "desc" } }),
    db.pricingPlan.findMany({ orderBy: { order: "asc" } }),
    db.programApplication.findMany({ orderBy: { createdAt: "desc" } }),
    db.setting.findMany(),
    db.bgVideo.findMany({ orderBy: { createdAt: "desc" } }),
    db.program.findMany({
      orderBy: { createdAt: "desc" },
      include: { registrations: { orderBy: { createdAt: "desc" } } },
    }),
    db.admin.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, username: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  return (
    <AdminContent
      initialStories={stories}
      initialTestimonials={testimonials}
      initialFaqs={faqs}
      initialProducts={products}
      initialPlans={plans}
      initialApplications={applications}
      initialSettings={settings}
      initialBgVideos={bgVideos}
      initialPrograms={programs}
      initialAdmins={admins}
      currentUsername={session!.username}
    />
  );
}
