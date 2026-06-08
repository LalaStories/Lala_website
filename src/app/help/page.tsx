import type { Metadata } from "next";
import HelpContent from "./HelpContent";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Help Center — LALA Stories",
  description: "Frequently Asked Questions and customer support for LALA Stories kids audio app. Get in touch with our team.",
};

export default async function HelpPage() {
  const faqs = await db.fAQ.findMany({
    orderBy: {
      order: "asc",
    },
  });

  return <HelpContent faqs={faqs} />;
}
