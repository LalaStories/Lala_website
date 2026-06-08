import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login — LALA Stories",
  description: "Secure login to LALA Stories Content Administration.",
};

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  // Check if user is already logged in
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("lala_admin_session")?.value;
  const session = verifySessionToken(sessionToken);

  if (session) {
    redirect("/admin");
  }

  // Handle potential errors passed as search query parameter
  const resolvedParams = await searchParams;
  const error = typeof resolvedParams.error === "string" ? resolvedParams.error : null;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#1A1040] via-[#2A1D5C] to-[#3D2A7C] text-white font-body flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      {/* Decorative stars */}
      <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-1 h-1 rounded-full bg-white/60 animate-ping pointer-events-none" />
      <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8 animate-scale-in">
        {/* Logo and header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FF7A2F] uppercase tracking-wider mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-.996.43-1.563A6 6 0 1 1 21.75 8.25z" /></svg>
            <span>Secure Access</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">
            LALA Stories <span className="text-[#FF7A2F]">Portal</span>
          </h1>
          <p className="text-white/60 text-xs max-w-xs mx-auto font-medium">
            Enter administrator credentials to manage library contents, programs and pricing.
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 relative">
          {error && (
            <div className="p-3.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-[10px] font-extrabold uppercase tracking-wider text-white/50">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[10px] font-extrabold uppercase tracking-wider text-white/50">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF7A2F] hover:bg-[#E55A10] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-4 select-none flex items-center justify-center gap-2 active:scale-98"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-white/40 hover:text-white transition-colors flex items-center justify-center gap-1.5 select-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            <span>Back to Homepage</span>
          </a>
        </div>
      </div>
    </div>
  );
}
