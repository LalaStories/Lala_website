"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/common/StarBackground";
import Button from "@/components/ui/Button";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function HelpContent({ faqs }: { faqs: FAQItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Get Web3Forms access key
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name,
          email: formState.email,
          subject: formState.subject || `Inquiry from ${formState.name} (Lala Stories Website)`,
          message: formState.message,
          from_name: "Lala Stories Website Support",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormState({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message || "Failed to submit form. Please check your access key configuration.");
      }
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      setSubmitError(
        error.message || "Failed to send message. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Dynamic XML FAQ Page Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="flex flex-col min-h-screen bg-[#FFF7F0] font-body text-gray-800">
        <Header />

        <main className="grow">
          {/* ========== HERO ========== */}
          <section className="relative pt-36 pb-20 text-center overflow-hidden bg-linear-to-b from-[#1A1040] via-[#2A1D5C] to-[#3D2A7C] text-white">
            <StarBackground count={70} />

            <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6 flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-[#FFB380] border border-orange-500/30 px-4.5 py-1.5 rounded-full text-xs font-bold font-heading">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
                Help Center
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                How Can We <span className="text-[#FF7A2F]">Help You?</span>
              </h1>
              <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Browse frequently asked questions or send us a message — we'll get back to you as soon as possible.
              </p>

              {/* Dynamic Search Bar */}
              <div className="relative max-w-md mx-auto w-full pt-2">
                <input
                  type="text"
                  placeholder="Search FAQ keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-white/20 bg-white/10 pl-6 pr-12 py-3.5 text-white placeholder-white/50 text-sm focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-hidden transition-all shadow-md focus:shadow-[#FF7A2F]/20"
                />
                <span className="absolute right-6 top-[28px] text-lg select-none pointer-events-none text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                </span>
              </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-[-1px] left-0 right-0 w-full z-10 pointer-events-none select-none">
              <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
                <path
                  d="M0,60 C360,80 720,30 1080,60 C1260,75 1380,40 1440,60 L1440,80 L0,80 Z"
                  fill="#FFF7F0"
                />
              </svg>
            </div>
          </section>

          {/* ========== CONTACT ROWS ========== */}
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <a
                href="mailto:support@lalastories.com"
                className="flex flex-col p-6 bg-white border border-orange-50/50 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF7A2F] flex items-center justify-center text-2xl mb-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#FF7A2F] transition-colors mb-1">
                  Email Support
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
                  Send us an email and we'll respond within 1–2 business days.
                </p>
                <span className="text-xs font-bold text-[#FF7A2F] mt-auto">
                  support@lalastories.com →
                </span>
              </a>

              {/* Card 2 */}
              <a
                href="tel:+918590166898"
                className="flex flex-col p-6 bg-white border border-orange-50/50 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF7A2F] flex items-center justify-center text-2xl mb-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.622c0-1.25.964-2.296 2.196-2.427a48.774 48.774 0 0 1 15.108 0c1.232.13 2.196 1.177 2.196 2.427v1.892c0 1.25-.964 2.296-2.196 2.427a48.11 48.11 0 0 1-1.64.105c-.172.008-.344.013-.517.014L18 12a3 3 0 0 1-3-3V7.5a1.5 1.5 0 0 0-3 0v1.5a3 3 0 0 1-3 3l-.325-.002c-.173-.001-.345-.006-.517-.014a48.11 48.11 0 0 1-1.64-.105c-1.232-.13-2.196-1.177-2.196-2.427V6.622ZM12 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c-2.17 0-4.207.576-5.963 1.584A6.062 6.062 0 0 0 6 18.72V22h12v-3.28a6.062 6.062 0 0 0-.037-3.136A11.944 11.944 0 0 0 12 12Z" /></svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#FF7A2F] transition-colors mb-1">
                  Call &amp; WhatsApp
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
                  Have urgent questions? Reach out directly via voice call or chat support.
                </p>
                <span className="text-xs font-bold text-[#FF7A2F] mt-auto">
                  +91 85901 66898 →
                </span>
              </a>

              {/* Card 3 */}
              <a
                href="/cancellation"
                className="flex flex-col p-6 bg-white border border-orange-50/50 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF7A2F] flex items-center justify-center text-2xl mb-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#FF7A2F] transition-colors mb-1">
                  Cancellations &amp; Refunds
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
                  Read our policy on cancellations, billing and subscription refunds.
                </p>
                <span className="text-xs font-bold text-[#FF7A2F] mt-auto">
                  View Policy →
                </span>
              </a>

              {/* Card 4 */}
              <a
                href="/shipping"
                className="flex flex-col p-6 bg-white border border-orange-50/50 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF7A2F] flex items-center justify-center text-2xl mb-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5h-18M21 12H3m18 4.5H3m18-9v9a2.25 2.25 0 0 1-2.25 2.25h-13.5A2.25 2.25 0 0 1 3 16.5v-9A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5Z" /></svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#FF7A2F] transition-colors mb-1">
                  Shipping Info
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
                  Delivery timelines, tracking and digital story activation questions.
                </p>
                <span className="text-xs font-bold text-[#FF7A2F] mt-auto">
                  View Shipping Policy →
                </span>
              </a>
            </div>
          </section>

          {/* ========== MAIN LAYOUT COLS ========== */}
          <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* FAQs Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="font-heading font-extrabold text-xl text-gray-900 border-b border-orange-100 pb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
                Frequently Asked Questions
              </div>

              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;

                    return (
                      <div
                        key={faq.id}
                        className="rounded-2xl border border-orange-50/50 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full flex items-center justify-between p-5 font-heading font-bold text-[#1A1040] hover:text-[#FF7A2F] transition-colors text-left text-sm sm:text-base border-none bg-transparent cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <span className="text-orange-400 font-extrabold text-lg select-none">
                            {isExpanded ? "−" : "+"}
                          </span>
                        </button>

                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            isExpanded ? "max-h-[300px] border-t border-orange-50/50 p-5" : "max-h-0 overflow-hidden"
                          }`}
                        >
                          <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-12 bg-white rounded-2xl border border-orange-50/50 shadow-xs">
                  <div className="text-4xl mb-2 text-gray-300 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                  </div>
                  <div className="text-gray-500 font-semibold text-sm">No matches found for "{searchQuery}"</div>
                </div>
              )}
            </div>

            {/* Message Form Column */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 font-body">
              <div className="font-heading font-extrabold text-xl text-gray-900 border-b border-orange-100 pb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                Send Us a Message
              </div>

              <div className="bg-white rounded-3xl border border-orange-50/50 p-8 shadow-md">
                {isSubmitted ? (
                  <div className="text-center py-10 space-y-4 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF7A2F] flex items-center justify-center text-3xl animate-bounce">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-gray-900">Thank You!</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto font-medium">
                      Your message was sent successfully! Our bedtime helpers will get back to you at your email address within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs font-bold text-[#FF7A2F] border border-[#FF7A2F] rounded-full px-4 py-2 hover:bg-orange-50 transition-colors cursor-pointer mt-4"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-[#FF7A2F] focus:bg-white focus:outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-[#FF7A2F] focus:bg-white focus:outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Subject (Optional)
                      </label>
                      <input
                        type="text"
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-[#FF7A2F] focus:bg-white focus:outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-[#FF7A2F] focus:bg-white focus:outline-hidden transition-all resize-none"
                      />
                    </div>

                    {/* Developer Setup Alert for missing API keys */}
                    {(process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY === undefined || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") && (
                      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 shrink-0 text-amber-600 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                        <div>
                          <strong className="block font-bold mb-0.5">Setup Required:</strong>
                          Get a free key at <a href="https://web3forms.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-amber-950">web3forms.com</a> and add it as <code>NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY</code> in your <code>.env.local</code>.
                        </div>
                      </div>
                    )}

                    {/* API Submission Error Notice */}
                    {submitError && (
                      <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl flex items-start gap-2.5 animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 shrink-0 text-rose-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                        <div className="space-y-1">
                          <strong className="block font-bold">Failed to Send Message</strong>
                          <p className="leading-relaxed text-rose-600/90">{submitError}</p>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full py-3.5 select-none"
                      enableSparkles={!isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </span>
                      ) : (
                        "Submit Message"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
