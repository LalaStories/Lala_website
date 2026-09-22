import React from "react";

/** Shared heading for every landing block, so spacing stays consistent. */
export default function SectionHeading({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  if (!title && !subtitle) return null;

  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {title && (
        <h2 className="font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          {title}
        </h2>
      )}
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-white/65">{subtitle}</p>}
    </div>
  );
}
