"use client";

import React, { useState, useTransition } from "react";
import { submitProgramApplicationAction } from "../admin/actions";

export default function ApplicationForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    childAge: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ageNum = parseInt(formData.childAge, 10);
    if (isNaN(ageNum) || ageNum <= 0) {
      setError("Please enter a valid age for the child.");
      return;
    }

    startTransition(async () => {
      try {
        await submitProgramApplicationAction({
          ...formData,
          childAge: ageNum,
        });
        setSuccess(true);
        setFormData({
          parentName: "",
          childName: "",
          childAge: "",
          email: "",
          phone: "",
          message: "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to submit application. Please try again.");
      }
    });
  };

  if (success) {
    return (
      <div className="bg-card-bg border border-emerald-500/30 p-8 rounded-3xl text-center space-y-4 shadow-lg animate-scale-in">
        <span className="text-6xl block animate-bounce">🎉</span>
        <h3 className="font-heading font-extrabold text-2xl text-emerald-500 dark:text-emerald-400">
          Application Submitted!
        </h3>
        <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
          Thank you for applying. We have received your request and will review it shortly. Our support team will reach out to you via email within 48 hours to provide your free app credentials.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 px-6 py-2.5 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-xs font-bold transition-all shadow-md select-none cursor-pointer border-none"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-6">
      <div className="space-y-1">
        <h3 className="font-heading font-extrabold text-xl text-text-dark">Application Form</h3>
        <p className="text-text-muted text-xs font-medium">Please fill in the details below to request free premium access.</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Parent / Guardian Name
            </label>
            <input
              type="text"
              required
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              className="w-full rounded-xl border border-card-border bg-secondary text-text-dark px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/40"
              placeholder="e.g. Sarah Mitchell"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Child's Name
            </label>
            <input
              type="text"
              required
              value={formData.childName}
              onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
              className="w-full rounded-xl border border-card-border bg-secondary text-text-dark px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/40"
              placeholder="e.g. Lily"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Child's Age
            </label>
            <input
              type="number"
              required
              min="1"
              max="18"
              value={formData.childAge}
              onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
              className="w-full rounded-xl border border-card-border bg-secondary text-text-dark px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/40"
              placeholder="e.g. 5"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Contact Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-xl border border-card-border bg-secondary text-text-dark px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/40"
              placeholder="e.g. +91 98765 43210"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Email Address
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xl border border-card-border bg-secondary text-text-dark px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/40"
            placeholder="e.g. parent@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Tell us about your child & how LALA Stories can help them
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full rounded-xl border border-card-border bg-secondary text-text-dark px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/40 resize-none leading-relaxed"
            placeholder="e.g. My child is visually impaired and loves listening to bedtime stories. This app would be a wonderful resource for us..."
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 bg-[#FF7A2F] hover:bg-[#E55A10] disabled:bg-card-border disabled:text-text-muted text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-2 select-none active:scale-97 flex items-center justify-center gap-1.5"
        >
          {isPending ? "Submitting Application..." : "Submit Application Form"}
        </button>
      </form>
    </div>
  );
}
