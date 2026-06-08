"use client";

import React, { useState, useTransition } from "react";
import { submitProgramRegistrationAction } from "@/app/admin/actions";

interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "select";
  required: boolean;
  options?: string; // comma-separated string from admin
}

interface Program {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string | null;
  qrImageUrl: string | null;
  formFields: string;
}

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  let fields: FormField[] = [];
  try {
    fields = JSON.parse(program.formFields || "[]");
  } catch {
    fields = [];
  }

  const handleChange = (fieldId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Build label-keyed responses for readability in admin
    const labelResponses: Record<string, string> = {};
    for (const field of fields) {
      labelResponses[field.label] = responses[field.id] || "";
    }

    startTransition(async () => {
      try {
        await submitProgramRegistrationAction(program.id, labelResponses);
        setSubmitted(true);
        if (program.qrImageUrl) {
          setShowQr(true);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <>
      <div className="group relative rounded-3xl overflow-hidden border border-orange-100 dark:border-white/10 bg-white dark:bg-white/5 shadow-lg hover:shadow-2xl hover:shadow-orange-200/30 dark:hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-1">
        {/* Banner Image */}
        {program.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={program.imageUrl}
            alt={program.title}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-[#FF7A2F]/20 via-[#FFD966]/20 to-[#2A1D5C]/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="w-16 h-16 text-[#FF7A2F]/40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
        )}

        {/* Card Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading font-extrabold text-xl text-[#2D2D2D] dark:text-white leading-tight">{program.title}</h3>
            <span className="shrink-0 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              Open
            </span>
          </div>

          <p className="text-[#6B6B6B] dark:text-white/60 text-sm leading-relaxed">{program.description}</p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#FF7A2F]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              {program.date}
            </span>
            <span className="flex items-center gap-1.5 text-[#6B6B6B] dark:text-white/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {program.location}
            </span>
          </div>

          {/* Register button */}
          {!submitted ? (
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="w-full mt-2 bg-[#FF7A2F] hover:bg-[#E55A10] text-white font-heading font-bold py-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg shadow-orange-200 dark:shadow-orange-900/30 text-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
              {isFormOpen ? "Close Form" : "Register Now"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={`w-4 h-4 transition-transform ${isFormOpen ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          ) : (
            <div className="w-full mt-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-2xl py-3 px-4 text-sm font-bold text-center flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Registered Successfully!
              {program.qrImageUrl && (
                <button onClick={() => setShowQr(true)} className="ml-2 underline text-xs">View QR</button>
              )}
            </div>
          )}

          {/* Collapsible Form */}
          {isFormOpen && !submitted && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 border-t border-orange-100 dark:border-white/10 pt-4 animate-blur-reveal">
              <p className="text-xs font-bold uppercase tracking-wider text-[#FF7A2F]">Registration Form</p>

              {fields.length === 0 ? (
                <p className="text-sm text-[#6B6B6B] dark:text-white/50 italic">No custom fields — just submit to register.</p>
              ) : (
                fields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#2D2D2D] dark:text-white/80">
                      {field.label}
                      {field.required && <span className="text-rose-500 ml-0.5">*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        required={field.required}
                        value={responses[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100 dark:border-white/10 bg-orange-50/50 dark:bg-white/5 text-sm text-[#2D2D2D] dark:text-white focus:outline-none focus:border-[#FF7A2F] transition-colors"
                        placeholder={field.label}
                      />
                    ) : field.type === "select" && field.options ? (
                      <select
                        required={field.required}
                        value={responses[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100 dark:border-white/10 bg-orange-50/50 dark:bg-white/5 text-sm text-[#2D2D2D] dark:text-white focus:outline-none focus:border-[#FF7A2F] transition-colors"
                      >
                        <option value="">Select {field.label}</option>
                        {(field.options ? field.options.split(",").map(s => s.trim()).filter(Boolean) : []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        value={responses[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100 dark:border-white/10 bg-orange-50/50 dark:bg-white/5 text-sm text-[#2D2D2D] dark:text-white focus:outline-none focus:border-[#FF7A2F] transition-colors"
                        placeholder={field.label}
                      />
                    )}
                  </div>
                ))
              )}

              {error && (
                <p className="text-xs text-rose-500 font-semibold">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#FF7A2F] hover:bg-[#E55A10] disabled:opacity-60 text-white font-heading font-bold py-3 rounded-2xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : "Submit Registration"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* QR Modal */}
      {showQr && program.qrImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowQr(false)}
        >
          <div
            className="bg-white dark:bg-[#1A113C] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-emerald-600 dark:text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[#2D2D2D] dark:text-white">You&apos;re Registered! 🎉</h3>
              <p className="text-sm text-[#6B6B6B] dark:text-white/60 mt-1">Scan the QR below to complete payment or attendance confirmation.</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={program.qrImageUrl}
              alt="Registration QR Code"
              className="w-56 h-56 object-contain mx-auto rounded-2xl border border-orange-100 dark:border-white/10 p-2"
            />
            <button
              onClick={() => setShowQr(false)}
              className="w-full bg-[#FF7A2F] text-white font-heading font-bold py-3 rounded-2xl hover:bg-[#E55A10] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
