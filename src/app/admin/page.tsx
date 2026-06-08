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

  // Fetch all administrative content
  const stories = await db.story.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  const testimonials = await db.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  const faqs = await db.fAQ.findMany({
    orderBy: { order: "asc" },
  });

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const plans = await db.pricingPlan.findMany({
    orderBy: { order: "asc" },
  });

  const applications = await db.programApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const settings = await db.setting.findMany();

  const bgVideos = await db.bgVideo.findMany({
    orderBy: { createdAt: "desc" },
  });

  const programs = await db.program.findMany({
    orderBy: { createdAt: "desc" },
    include: { registrations: { orderBy: { createdAt: "desc" } } },
  });

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
    />
  );
}

