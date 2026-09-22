"use client";

import React, { useRef, useState } from "react";
import { uploadLandingMediaAction } from "./actions";
import { Cta, CtaType, CTA_TYPE_LABELS, CTA_VALUE_PLACEHOLDER } from "@/types/landing";

/* Shared form primitives for the landing page builder.
   Kept here so every block editor looks and behaves identically. */

export const fieldBase =
  "w-full rounded-xl bg-black/25 border border-white/12 px-3.5 py-2.5 text-sm text-white " +
  "placeholder:text-white/30 outline-none transition-all focus:border-[#FF7A2F] focus:bg-black/35 font-body";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-widest text-white/50">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] leading-relaxed text-white/35">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={fieldBase}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${fieldBase} resize-y leading-relaxed`}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className={`${fieldBase} cursor-pointer`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#1A1040]">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/12 bg-black/20 px-3.5 py-2.5 text-left transition-colors hover:bg-black/30"
    >
      <span className="text-sm font-semibold text-white/80">{label}</span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#FF7A2F]" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-4.5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

/** Small icon button used across list rows. */
export function IconButton({
  onClick,
  title,
  children,
  tone = "neutral",
  disabled,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  tone?: "neutral" | "danger";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/12 bg-white/5 transition-all hover:bg-white/15 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 ${
        tone === "danger" ? "text-rose-300 hover:border-rose-400/40 hover:bg-rose-500/20" : "text-white/70"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Upload a file to Cloudinary and hand back the URL, or accept a pasted
 * URL directly — whichever is easier for the person in the room.
 */
export function MediaUpload({
  value,
  onChange,
  kind = "image",
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  kind?: "image" | "video";
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const { url } = await uploadLandingMediaAction(fd);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Field label={label}>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste a URL, or upload →"
            className={fieldBase}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="shrink-0 cursor-pointer rounded-xl border border-[#FF7A2F]/40 bg-[#FF7A2F]/15 px-3.5 py-2.5 text-xs font-bold text-[#FFB380] transition-all hover:bg-[#FF7A2F]/25 active:scale-95 disabled:opacity-50"
          >
            {busy ? "…" : "Upload"}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={kind === "video" ? "video/*" : "image/*"}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {error && <p className="text-[11px] font-semibold text-rose-300">{error}</p>}

        {value && kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-20 w-auto rounded-lg border border-white/12 object-cover"
          />
        )}
        {value && kind === "video" && (
          <video src={value} className="h-20 w-auto rounded-lg border border-white/12" muted />
        )}
      </div>
    </Field>
  );
}

/** Editor for a single call-to-action: label, destination type, value. */
export function CtaEditor({
  cta,
  onChange,
  title,
}: {
  cta: Cta;
  onChange: (cta: Cta) => void;
  title: string;
}) {
  const safe: Cta = cta || { label: "", type: "form", value: "", message: "" };

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A2F]">{title}</div>

      <Field label="Button Text">
        <TextInput value={safe.label} onChange={(v) => onChange({ ...safe, label: v })} placeholder="Start Free Tonight" />
      </Field>

      <Field label="When Clicked">
        <Select
          value={safe.type}
          onChange={(v) => onChange({ ...safe, type: v as CtaType })}
          options={(Object.keys(CTA_TYPE_LABELS) as CtaType[]).map((t) => ({
            value: t,
            label: CTA_TYPE_LABELS[t],
          }))}
        />
      </Field>

      {safe.type !== "form" && (
        <Field label="Destination">
          <TextInput
            value={safe.value}
            onChange={(v) => onChange({ ...safe, value: v })}
            placeholder={CTA_VALUE_PLACEHOLDER[safe.type]}
          />
        </Field>
      )}

      {safe.type === "whatsapp" && (
        <Field label="Prefilled Message" hint="Opens the chat with this text already typed.">
          <TextInput
            value={safe.message || ""}
            onChange={(v) => onChange({ ...safe, message: v })}
            placeholder="Hi! I'd like to know more about Lala Stories."
          />
        </Field>
      )}
    </div>
  );
}

/**
 * Generic editor for a list of repeatable items (features, stats, FAQs…).
 * Handles add / remove / reorder so each block editor stays declarative.
 */
export function RepeaterList<T extends { id: string }>({
  items,
  onChange,
  makeItem,
  addLabel,
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  makeItem: () => T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
}) {
  const list = items || [];

  const update = (index: number, patch: Partial<T>) => {
    const next = [...list];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => onChange(list.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={item.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">
              Item {i + 1}
            </span>
            <div className="flex gap-1.5">
              <IconButton onClick={() => move(i, -1)} title="Move up" disabled={i === 0}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
              </IconButton>
              <IconButton onClick={() => move(i, 1)} title="Move down" disabled={i === list.length - 1}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </IconButton>
              <IconButton onClick={() => remove(i)} title="Remove" tone="danger">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </IconButton>
            </div>
          </div>
          <div className="space-y-3">{renderItem(item, (patch) => update(i, patch), i)}</div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...list, makeItem()])}
        className="w-full cursor-pointer rounded-2xl border border-dashed border-white/20 bg-transparent py-3 text-xs font-bold uppercase tracking-widest text-white/50 transition-all hover:border-[#FF7A2F]/50 hover:bg-[#FF7A2F]/10 hover:text-[#FFB380] active:scale-[0.99]"
      >
        + {addLabel}
      </button>
    </div>
  );
}
