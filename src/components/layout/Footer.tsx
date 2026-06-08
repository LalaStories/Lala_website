"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1040] text-white pt-16 pb-8 border-t border-white/10 font-body relative overflow-hidden">
      {/* Subtle deep glow decor */}
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 font-body">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-32">
                <Image
                  src="/assets/images/LALA logo- PNG.png"
                  alt="LALA Stories"
                  fill
                  className="object-contain brightness-0 invert opacity-90"
                />
              </div>
            </Link>
            <p className="text-white/70 text-sm max-w-sm leading-relaxed font-semibold">
              Making bedtime magical, one story at a time. Sweet dreams start here.
            </p>
            {/* Social icons */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.facebook.com/people/Lala-Stories-Malayalam"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#FF7A2F] hover:scale-110 active:scale-95 transition-all text-white shadow-md"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/lalastoriesmalayalam/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#FF7A2F] hover:scale-110 active:scale-95 transition-all text-white shadow-md"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a
                href="https://www.youtube.com/@lalastoriesforkids"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#FF7A2F] hover:scale-110 active:scale-95 transition-all text-white shadow-md"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-[#FFB380]">Company</h4>
            <ul className="space-y-2 text-sm text-white/75 font-semibold">
              <li>
                <Link href="/about" className="hover:text-[#FF7A2F] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-[#FF7A2F] transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-[#FF7A2F] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-[#FFD966]">Support</h4>
            <ul className="space-y-2 text-sm text-white/75 font-semibold">
              <li>
                <Link href="/help" className="hover:text-[#FF7A2F] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-[#FF7A2F] transition-colors">
                  Parental Guide
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-[#FF7A2F] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-8" />

        {/* Bottom Compliance Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/60 text-center font-medium">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} LALA Stories. All rights reserved. Made with 
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-yellow-400 inline-block"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
            for little dreamers.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-semibold">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/cancellation" className="hover:text-white transition-colors">
              Cancellation
            </Link>
            <Link href="/shipping" className="hover:text-white transition-colors">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
