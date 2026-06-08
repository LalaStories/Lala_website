"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/store/ThemeContext";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsMobileMenuOpen(false);

    if (pathname === "/") {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = 70;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-350 ${
        isScrolled
          ? "bg-header-scrolled-bg backdrop-blur-md shadow-[0_4px_30px_rgba(255,122,47,0.08)] py-2.5 text-header-scrolled-text"
          : "bg-transparent py-4 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Branding */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-28 md:h-11 md:w-32 transition-all">
            <Image
              src="/assets/images/LALA logo- PNG.png"
              alt="LALA Stories — Magical Bedtime Stories for Kids"
              fill
              className={`object-contain transition-all duration-350 ${
                isScrolled ? "brightness-100" : "brightness-0 invert"
              }`}
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-body font-semibold text-sm">
          <Link
            href={isHome ? "#stories" : "/#stories"}
            onClick={(e) => handleNavLinkClick(e, "#stories")}
            className={`hover:text-[#FF7A2F] relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2.5px] after:bg-[#FF7A2F] after:rounded-sm after:transition-all hover:after:w-full`}
          >
            Stories
          </Link>
          <Link
            href={isHome ? "#how-it-works" : "/#how-it-works"}
            onClick={(e) => handleNavLinkClick(e, "#how-it-works")}
            className="hover:text-[#FF7A2F] relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2.5px] after:bg-[#FF7A2F] after:rounded-sm after:transition-all hover:after:w-full"
          >
            How It Works
          </Link>
          <Link
            href={isHome ? "#app-showcase" : "/#app-showcase"}
            onClick={(e) => handleNavLinkClick(e, "#app-showcase")}
            className="hover:text-[#FF7A2F] relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2.5px] after:bg-[#FF7A2F] after:rounded-sm after:transition-all hover:after:w-full"
          >
            Our App
          </Link>
          <Link
            href={isHome ? "#testimonials" : "/#testimonials"}
            onClick={(e) => handleNavLinkClick(e, "#testimonials")}
            className="hover:text-[#FF7A2F] relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2.5px] after:bg-[#FF7A2F] after:rounded-sm after:transition-all hover:after:w-full"
          >
            Reviews
          </Link>
          <Link
            href="/products"
            className="hover:text-[#FF7A2F] relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2.5px] after:bg-[#FF7A2F] after:rounded-sm after:transition-all hover:after:w-full"
          >
            Books & Toys
          </Link>
          <Link
            href="/premium"
            className="hover:text-[#FF7A2F] relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2.5px] after:bg-[#FF7A2F] after:rounded-sm after:transition-all hover:after:w-full"
          >
            Premium Plans
          </Link>
          <Link
            href="/programs"
            className="hover:text-[#FF7A2F] relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2.5px] after:bg-[#FF7A2F] after:rounded-sm after:transition-all hover:after:w-full"
          >
            Programs
          </Link>
          <Link
            href="/differently-abled"
            className="hover:text-[#FF7A2F] relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2.5px] after:bg-[#FF7A2F] after:rounded-sm after:transition-all hover:after:w-full"
          >
            Free Program
          </Link>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-orange-500/10 text-[#FF7A2F] dark:text-[#FFD966] transition-all hover:scale-110 active:scale-95 cursor-pointer border-none bg-transparent"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              // Moon Icon
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.5-.1 1 .2 1.2.7.2.5 0 1.1-.4 1.4-2.8 1.8-4.3 5.1-3.7 8.5.6 3.4 3.3 6.1 6.7 6.7 3.4.6 6.7-.9 8.5-3.7.3-.4.9-.6 1.4-.4.5.2.8.7.7 1.2-.9 4.7-5 8.2-9.8 8.2l-2.8.2zm-2.4-18c-3.7.6-6.4 3.8-6.4 7.6 0 4.2 3.4 7.6 7.6 7.6 3.8 0 7-2.7 7.6-6.4-.9.4-1.9.6-3 .6-4.4 0-8-3.6-8-8 0-1.1.2-2.1.6-3z"/>
              </svg>
            ) : (
              // Sun Icon
              <svg className="w-5.5 h-5.5 fill-current rotate-45" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm0-10c.28 0 .5-.22.5-.5V3c0-.28-.22-.5-.5-.5s-.5.22-.5.5v1.5c0 .28.22.5.5.5zm0 14c-.28 0-.5.22-.5.5V21c0 .28.22.5.5.5s.5-.22.5-.5v-1.5c0-.28-.22-.5-.5-.5zm7.071-12.071c-.2-.2-.51-.2-.707 0l-1.061 1.061c-.2.2-.2.51 0 .707s.51.2.707 0l1.061-1.061c.2-.2.2-.51 0-.707zm-12.02 12.02c-.2-.2-.51-.2-.707 0l-1.06 1.061c-.2.2-.2.51 0 .707s.51.2.707 0l1.06-1.061c.2-.2.2-.51 0-.707zM21 11.5h-1.5c-.28 0-.5.22-.5.5s.22.5.5.5H21c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zM4.5 12c0-.28-.22-.5-.5-.5H2.5c-.28 0-.5.22-.5.5s.22.5.5.5H4c.28 0 .5-.22.5-.5zm14.571 5.071c-.2-.2-.51-.2-.707 0s-.2.51 0 .707l1.061 1.06c.2.2.51.2.707 0s.2-.51 0-.707l-1.061-1.06zm-12.02-12.02c-.2-.2-.51-.2-.707 0s-.2.51 0 .707l1.06 1.061c.2.2.51.2.707 0s.2-.51 0-.707l-1.06-1.061z"/>
              </svg>
            )}
          </button>

          <Link
            href={isHome ? "#cta" : "/#cta"}
            onClick={(e) => handleNavLinkClick(e, "#cta")}
            className="bg-[#FF7A2F] text-white px-5 py-2 rounded-full font-heading font-bold text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 hover:shadow-lg transition-all"
          >
            Start Free
          </Link>
        </nav>

        {/* Mobile Hamburger menu */}
        <button
          className="flex lg:hidden flex-col gap-1.5 p-2 cursor-pointer z-50 group border-none bg-transparent"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block w-6 h-0.5 rounded-full transition-all ${
              isScrolled ? "bg-[#FF7A2F]" : "bg-white"
            } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 rounded-full transition-all ${
              isScrolled ? "bg-[#FF7A2F]" : "bg-white"
            } ${isMobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 rounded-full transition-all ${
              isScrolled ? "bg-[#FF7A2F]" : "bg-white"
            } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Slide-out Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-linear-to-b from-[#1A1040] to-[#2A1D5C] text-white flex flex-col items-center justify-center gap-6 font-heading text-lg font-bold transition-all duration-350 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <Link
          href={isHome ? "#stories" : "/#stories"}
          onClick={(e) => handleNavLinkClick(e, "#stories")}
          className="hover:text-[#FF7A2F] transition-colors"
        >
          Stories
        </Link>
        <Link
          href={isHome ? "#how-it-works" : "/#how-it-works"}
          onClick={(e) => handleNavLinkClick(e, "#how-it-works")}
          className="hover:text-[#FF7A2F] transition-colors"
        >
          How It Works
        </Link>
        <Link
          href={isHome ? "#app-showcase" : "/#app-showcase"}
          onClick={(e) => handleNavLinkClick(e, "#app-showcase")}
          className="hover:text-[#FF7A2F] transition-colors"
        >
          Our App
        </Link>
        <Link
          href={isHome ? "#testimonials" : "/#testimonials"}
          onClick={(e) => handleNavLinkClick(e, "#testimonials")}
          className="hover:text-[#FF7A2F] transition-colors"
        >
          Reviews
        </Link>
        <Link
          href="/products"
          onClick={() => setIsMobileMenuOpen(false)}
          className="hover:text-[#FF7A2F] transition-colors"
        >
          Books & Toys
        </Link>
        <Link
          href="/premium"
          onClick={() => setIsMobileMenuOpen(false)}
          className="hover:text-[#FF7A2F] transition-colors"
        >
          Premium Plans
        </Link>
        <Link
          href="/programs"
          onClick={() => setIsMobileMenuOpen(false)}
          className="hover:text-[#FF7A2F] transition-colors"
        >
          Programs
        </Link>
        <Link
          href="/differently-abled"
          onClick={() => setIsMobileMenuOpen(false)}
          className="hover:text-[#FF7A2F] transition-colors"
        >
          Free Program
        </Link>
        {/* Mobile Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white transition-all cursor-pointer bg-transparent mt-2 text-base font-semibold font-body"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <>🌙 Cozy Mode</>
          ) : (
            <>☀️ Bright Mode</>
          )}
        </button>

        <Link
          href={isHome ? "#cta" : "/#cta"}
          onClick={(e) => handleNavLinkClick(e, "#cta")}
          className="bg-[#FF7A2F] text-white px-8 py-3 rounded-full text-base font-bold shadow-lg hover:bg-orange-600 transition-all mt-4"
        >
          Start Free
        </Link>
      </div>
    </header>
  );
};

export default Header;
