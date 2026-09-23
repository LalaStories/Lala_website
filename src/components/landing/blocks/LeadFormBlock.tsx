"use client";

import React, { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { LeadFormData } from "@/types/landing";
import { submitLeadAction } from "@/app/admin/landing/actions";
import { trackPixel } from "@/components/analytics/MetaPixel";
import { LEAD_FORM_ANCHOR } from "../CtaButton";

interface LeadFormBlockProps {
  data: LeadFormData;
  landingPageId: string;
  campaignName: string;
}

const inputClasses =
  "w-full rounded-2xl bg-white/10 border-2 border-white/15 px-5 py-3.5 text-white placeholder:text-white/40 " +
  "outline-none transition-all focus:border-[#FF7A2F] focus:bg-white/15 font-body text-base";

export default function LeadFormBlock({ data, landingPageId, campaignName }: LeadFormBlockProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();

  const setValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const fields = data.fields || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Custom fields keyed by label — that's what the admin inbox displays.
    const responses: Record<string, string> = {};
    for (const f of fields) {
      const v = (values[f.id] || "").trim();
      if (f.required && !v) {
        setError(`Please fill in "${f.label}".`);
        return;
      }
      if (v) responses[f.label] = v;
    }

    startTransition(async () => {
      try {
        await submitLeadAction({
          landingPageId,
          name: values.__name || "",
          phone: values.__phone || "",
          email: values.__email || "",
          responses,
          // Meta appends click ids to the ad URL — keep them for attribution.
          source: searchParams.get("utm_source") || searchParams.get("fbclid") ? "meta-ads" : "direct",
          campaign: searchParams.get("utm_campaign") || campaignName,
        });

        trackPixel("Lead", { content_name: campaignName, status: "submitted" });
        setDone(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    });
  };

  if (done) {
    return (
      <section id={LEAD_FORM_ANCHOR} className="relative z-10 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-lg rounded-3xl border border-emerald-400/30 bg-emerald-500/10 backdrop-blur-xl p-10 text-center shadow-2xl animate-scale-in">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-8 w-8 text-emerald-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            {data.successTitle || "Thank you!"}
          </h3>
          <p className="mt-3 text-white/75 leading-relaxed">
            {data.successMessage || "We'll be in touch shortly."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id={LEAD_FORM_ANCHOR} className="relative z-10 px-5 py-20 sm:py-24 scroll-mt-24">
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl border border-white/15 bg-white/8 backdrop-blur-xl p-7 sm:p-10 shadow-2xl">
          {data.title && (
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white text-center leading-tight">
              {data.title}
            </h2>
          )}
          {data.subtitle && (
            <p className="mt-3 text-center text-white/70 leading-relaxed">{data.subtitle}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {/* Name and phone are always collected — they're what sales needs. */}
            <input
              type="text"
              required
              placeholder="Your name"
              value={values.__name || ""}
              onChange={(e) => setValue("__name", e.target.value)}
              className={inputClasses}
              autoComplete="name"
            />
            <input
              type="tel"
              required
              placeholder="Phone number"
              value={values.__phone || ""}
              onChange={(e) => setValue("__phone", e.target.value)}
              className={inputClasses}
              autoComplete="tel"
              inputMode="tel"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={values.__email || ""}
              onChange={(e) => setValue("__email", e.target.value)}
              className={inputClasses}
              autoComplete="email"
              inputMode="email"
            />

            {/* Campaign-specific questions configured in the admin builder. */}
            {fields.map((field) => {
              if (field.type === "select") {
                const options = (field.options || "")
                  .split(",")
                  .map((o) => o.trim())
                  .filter(Boolean);
                return (
                  <select
                    key={field.id}
                    value={values[field.id] || ""}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    required={field.required}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-[#1A1040]">
                      {field.label}
                      {field.required ? " *" : ""}
                    </option>
                    {options.map((o) => (
                      <option key={o} value={o} className="bg-[#1A1040]">
                        {o}
                      </option>
                    ))}
                  </select>
                );
              }

              if (field.type === "textarea") {
                return (
                  <textarea
                    key={field.id}
                    rows={3}
                    placeholder={field.placeholder || field.label + (field.required ? " *" : "")}
                    value={values[field.id] || ""}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    required={field.required}
                    className={`${inputClasses} resize-none`}
                  />
                );
              }

              return (
                <input
                  key={field.id}
                  type={field.type}
                  placeholder={field.placeholder || field.label + (field.required ? " *" : "")}
                  value={values[field.id] || ""}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  required={field.required}
                  className={inputClasses}
                />
              );
            })}

            {error && (
              <div className="rounded-2xl border border-rose-400/30 bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-linear-to-br from-[#FF7A2F] to-[#E55A10] py-4 px-8 font-heading text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
            >
              {isPending ? "Sending…" : data.buttonLabel || "Submit"}
            </button>

            {data.consentText && (
              <p className="pt-1 text-center text-xs leading-relaxed text-white/45">{data.consentText}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
