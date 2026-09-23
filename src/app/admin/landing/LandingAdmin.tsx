"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Block,
  BLOCK_META,
  BLOCK_ORDER,
  BlockType,
  createBlock,
  parseBlocks,
  slugify,
} from "@/types/landing";
import {
  createLandingPageAction,
  updateLandingPageAction,
  togglePublishAction,
  duplicateLandingPageAction,
  deleteLandingPageAction,
  updateLeadStatusAction,
  deleteLeadAction,
} from "./actions";
import BlockEditor from "./BlockEditor";
import { Field, TextInput, TextArea, Select, MediaUpload, IconButton, fieldBase } from "./ui";

// --- Props ------------------------------------------------------------

export interface LandingPageRow {
  id: string;
  slug: string;
  name: string;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  metaPixelId: string;
  bgType: string;
  bgImageUrl: string;
  bgVideoUrl: string;
  bgOverlay: number;
  blocks: string;
  views: number;
  leadCount: number;
  updatedAt: string;
}

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  responses: string;
  status: string;
  notes: string;
  source: string;
  campaign: string;
  pageName: string;
  createdAt: string;
}

interface LandingAdminProps {
  initialPages: LandingPageRow[];
  initialLeads: LeadRow[];
}

const STATUS_STYLES: Record<string, string> = {
  New: "bg-sky-500/20 text-sky-300 border-sky-400/30",
  Contacted: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  Converted: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  Rejected: "bg-rose-500/20 text-rose-300 border-rose-400/30",
};

export default function LandingAdmin({ initialPages, initialLeads }: LandingAdminProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [view, setView] = useState<"pages" | "leads">("pages");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const flash = (msg: string) => {
    setSuccess(msg);
    window.setTimeout(() => setSuccess(null), 3500);
  };

  const run = (fn: () => Promise<unknown>, okMessage?: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        if (okMessage) flash(okMessage);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  const editingPage = initialPages.find((p) => p.id === editingId) || null;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0F0826] font-body text-white">
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-orange-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-violet-600/5 blur-3xl" />

      {/* Top bar */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-xs font-bold text-white/50 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Dashboard
          </Link>
          <span className="h-4 w-px bg-white/15" />
          <h1 className="font-heading text-lg font-extrabold tracking-tight">
            Landing <span className="text-[#FF7A2F]">Pages</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {(["pages", "leads"] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                setView(v);
                setEditingId(null);
              }}
              className={`cursor-pointer rounded-xl border-none px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest transition-all ${
                view === v
                  ? "bg-[#FF7A2F]/20 text-[#FF7A2F]"
                  : "bg-transparent text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              {v === "pages" ? "Pages" : `Leads (${initialLeads.length})`}
            </button>
          ))}
          {isPending && (
            <span className="ml-2 flex items-center gap-2 text-xs text-white/50">
              <svg className="h-3.5 w-3.5 animate-spin text-[#FF7A2F]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </span>
          )}
        </div>
      </header>

      {/* Flash messages */}
      <div className="relative z-20 px-6">
        {success && (
          <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-300">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-300">
            {error}
          </div>
        )}
      </div>

      <main className="relative z-10 grow p-6">
        {view === "leads" ? (
          <LeadsInbox leads={initialLeads} run={run} />
        ) : editingPage ? (
          <PageBuilder
            key={editingPage.id}
            page={editingPage}
            onClose={() => setEditingId(null)}
            run={run}
          />
        ) : (
          <PagesList
            pages={initialPages}
            onEdit={setEditingId}
            run={run}
            isPending={isPending}
          />
        )}
      </main>
    </div>
  );
}

// --- Pages list -------------------------------------------------------

function PagesList({
  pages,
  onEdit,
  run,
  isPending,
}: {
  pages: LandingPageRow[];
  onEdit: (id: string) => void;
  run: (fn: () => Promise<unknown>, ok?: string) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    const value = name;
    setName("");
    run(async () => {
      const { id } = await createLandingPageAction(value, slugify(value));
      onEdit(id);
    }, "Landing page created.");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* New page */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="font-heading text-lg font-extrabold">Create a Campaign Page</h2>
        <p className="mt-1 text-sm text-white/50">
          Starts from a proven layout — hero, proof, form, reviews, FAQ, closing CTA. Edit anything after.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Campaign name, e.g. Diwali Offer"
            className={fieldBase}
          />
          <button
            onClick={handleCreate}
            disabled={isPending || !name.trim()}
            className="shrink-0 cursor-pointer rounded-xl bg-linear-to-br from-[#FF7A2F] to-[#E55A10] px-6 py-2.5 font-heading text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            Create Page
          </button>
        </div>
        {name.trim() && (
          <p className="mt-2.5 text-xs text-white/40">
            URL will be <span className="font-bold text-[#FFB380]">/lp/{slugify(name) || "…"}</span>
          </p>
        )}
      </div>

      {/* Existing pages */}
      {pages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-white/40">No landing pages yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-colors hover:border-white/20 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-heading text-base font-extrabold text-white">{p.name}</h3>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      p.isPublished
                        ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-300"
                        : "border-white/15 bg-white/10 text-white/50"
                    }`}
                  >
                    {p.isPublished ? "● Live" : "Draft"}
                  </span>
                  {p.metaPixelId && (
                    <span className="rounded-full border border-sky-400/30 bg-sky-500/15 px-2.5 py-0.5 text-[10px] font-bold text-sky-300">
                      Pixel on
                    </span>
                  )}
                </div>
                <p className="mt-1.5 truncate font-mono text-xs text-white/40">/lp/{p.slug}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/45">
                  <span>{p.views} views</span>
                  <span className="font-bold text-[#FFB380]">{p.leadCount} leads</span>
                  <span>Updated {new Date(p.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  onClick={() => run(() => togglePublishAction(p.id, !p.isPublished), p.isPublished ? "Unpublished." : "Page is live.")}
                  className={`cursor-pointer rounded-xl border px-3.5 py-2 text-xs font-bold transition-all active:scale-95 ${
                    p.isPublished
                      ? "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                      : "border-emerald-400/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                  }`}
                >
                  {p.isPublished ? "Unpublish" : "Publish"}
                </button>

                {p.isPublished && (
                  <a
                    href={`/lp/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white/70 transition-all hover:bg-white/10 active:scale-95"
                  >
                    View
                  </a>
                )}

                <button
                  onClick={() => onEdit(p.id)}
                  className="cursor-pointer rounded-xl bg-[#FF7A2F]/20 px-4 py-2 text-xs font-bold text-[#FF7A2F] transition-all hover:bg-[#FF7A2F]/30 active:scale-95"
                >
                  Edit
                </button>

                <IconButton
                  onClick={() => run(() => duplicateLandingPageAction(p.id), "Page duplicated.")}
                  title="Duplicate"
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                  </svg>
                </IconButton>

                <IconButton
                  onClick={() => {
                    if (confirm(`Delete "${p.name}"? Its ${p.leadCount} leads will be kept in the Leads inbox.`)) {
                      run(() => deleteLandingPageAction(p.id), "Page deleted.");
                    }
                  }}
                  title="Delete"
                  tone="danger"
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Page builder -----------------------------------------------------

function PageBuilder({
  page,
  onClose,
  run,
}: {
  page: LandingPageRow;
  onClose: () => void;
  run: (fn: () => Promise<unknown>, ok?: string) => void;
}) {
  const [settings, setSettings] = useState({
    name: page.name,
    slug: page.slug,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    ogImageUrl: page.ogImageUrl,
    metaPixelId: page.metaPixelId,
    bgType: page.bgType,
    bgImageUrl: page.bgImageUrl,
    bgVideoUrl: page.bgVideoUrl,
    bgOverlay: page.bgOverlay,
  });
  const [blocks, setBlocks] = useState<Block[]>(() => parseBlocks(page.blocks));
  const [selectedId, setSelectedId] = useState<string | null>(() => parseBlocks(page.blocks)[0]?.id ?? null);
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<"content" | "settings">("content");
  const [dirty, setDirty] = useState(false);

  const selected = blocks.find((b) => b.id === selectedId) || null;

  const setSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setDirty(true);
  };

  const mutateBlocks = (next: Block[]) => {
    setBlocks(next);
    setDirty(true);
  };

  const addBlock = (type: BlockType) => {
    const block = createBlock(type);
    mutateBlocks([...blocks, block]);
    setSelectedId(block.id);
    setShowAdd(false);
    setTab("content");
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    mutateBlocks(next);
  };

  const handleSave = () => {
    run(async () => {
      await updateLandingPageAction(page.id, {
        ...settings,
        bgOverlay: Number(settings.bgOverlay),
        blocks: JSON.stringify(blocks),
      });
      setDirty(false);
    }, "Changes saved.");
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Builder toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border-none bg-transparent p-1 text-white/50 transition-colors hover:text-white"
            title="Back to all pages"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h2 className="font-heading text-base font-extrabold leading-tight">{settings.name}</h2>
            <p className="font-mono text-[11px] text-white/40">/lp/{settings.slug}</p>
          </div>
          {dirty && (
            <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/lp/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white/70 transition-all hover:bg-white/10 active:scale-95"
          >
            Preview ↗
          </a>
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="cursor-pointer rounded-xl bg-linear-to-br from-[#FF7A2F] to-[#E55A10] px-6 py-2 font-heading text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Section list */}
        <div className="space-y-3 lg:col-span-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-sm font-extrabold uppercase tracking-wider text-white/70">
                Sections ({blocks.length})
              </h3>
              <button
                onClick={() => setTab("settings")}
                className={`cursor-pointer rounded-lg border-none px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                  tab === "settings" ? "bg-[#FF7A2F]/20 text-[#FF7A2F]" : "bg-white/5 text-white/50 hover:text-white"
                }`}
              >
                Page Settings
              </button>
            </div>

            <div className="space-y-2">
              {blocks.map((b, i) => {
                const meta = BLOCK_META[b.type];
                const isActive = tab === "content" && selectedId === b.id;
                return (
                  <div
                    key={b.id}
                    className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 transition-all ${
                      isActive
                        ? "border-[#FF7A2F]/50 bg-[#FF7A2F]/15"
                        : "border-white/10 bg-black/20 hover:bg-black/30"
                    } ${b.enabled ? "" : "opacity-45"}`}
                  >
                    <button
                      onClick={() => {
                        setSelectedId(b.id);
                        setTab("content");
                      }}
                      className="flex min-w-0 grow cursor-pointer items-center gap-2.5 border-none bg-transparent text-left"
                    >
                      <span className={`text-sm ${isActive ? "text-[#FF7A2F]" : "text-white/50"}`}>
                        {meta.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-heading text-sm font-bold text-white">
                          {meta.label}
                        </span>
                        <span className="block truncate text-[11px] text-white/35">
                          {blockSummary(b)}
                        </span>
                      </span>
                    </button>

                    <div className="flex shrink-0 gap-1">
                      <IconButton onClick={() => moveBlock(i, -1)} title="Move up" disabled={i === 0}>
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-3 w-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                      </IconButton>
                      <IconButton onClick={() => moveBlock(i, 1)} title="Move down" disabled={i === blocks.length - 1}>
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-3 w-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          mutateBlocks(blocks.map((x) => (x.id === b.id ? { ...x, enabled: !x.enabled } : x)))
                        }
                        title={b.enabled ? "Hide section" : "Show section"}
                      >
                        {b.enabled ? (
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243" />
                          </svg>
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          const next = blocks.filter((x) => x.id !== b.id);
                          mutateBlocks(next);
                          if (selectedId === b.id) setSelectedId(next[0]?.id ?? null);
                        }}
                        title="Remove section"
                        tone="danger"
                      >
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-3 w-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </IconButton>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setShowAdd((v) => !v)}
                className="w-full cursor-pointer rounded-2xl border border-dashed border-white/20 bg-transparent py-3 text-xs font-bold uppercase tracking-widest text-white/50 transition-all hover:border-[#FF7A2F]/50 hover:bg-[#FF7A2F]/10 hover:text-[#FFB380]"
              >
                {showAdd ? "Close" : "+ Add Section"}
              </button>

              {showAdd && (
                <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/30 p-3 sm:grid-cols-2">
                  {BLOCK_ORDER.map((type) => (
                    <button
                      key={type}
                      onClick={() => addBlock(type)}
                      className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-all hover:border-[#FF7A2F]/40 hover:bg-[#FF7A2F]/10 active:scale-95"
                    >
                      <span className="text-[#FF7A2F]">{BLOCK_META[type].icon}</span>
                      <span className="min-w-0">
                        <span className="block font-heading text-xs font-bold text-white">
                          {BLOCK_META[type].label}
                        </span>
                        <span className="block text-[10px] leading-snug text-white/40">
                          {BLOCK_META[type].description}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor pane */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            {tab === "settings" ? (
              <PageSettings settings={settings} setSetting={setSetting} />
            ) : selected ? (
              <BlockEditor
                block={selected}
                onChange={(data) =>
                  mutateBlocks(blocks.map((b) => (b.id === selected.id ? { ...b, data } : b)))
                }
              />
            ) : (
              <p className="py-16 text-center text-white/40">
                Select a section on the left, or add a new one.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Page-level settings: URL, SEO, pixel and background. */
function PageSettings({
  settings,
  setSetting,
}: {
  settings: {
    name: string;
    slug: string;
    seoTitle: string;
    seoDescription: string;
    ogImageUrl: string;
    metaPixelId: string;
    bgType: string;
    bgImageUrl: string;
    bgVideoUrl: string;
    bgOverlay: number;
  };
  setSetting: <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="border-b border-white/10 pb-4">
        <h3 className="font-heading text-lg font-extrabold text-white">Page Settings</h3>
        <p className="text-[11px] text-white/40">URL, search preview, tracking and background.</p>
      </div>

      <Field label="Campaign Name" hint="Internal only — helps you find this page in the list.">
        <TextInput value={settings.name} onChange={(v) => setSetting("name", v)} />
      </Field>

      <Field label="URL Slug" hint={`Page will live at /lp/${slugify(settings.slug) || "…"}`}>
        <TextInput value={settings.slug} onChange={(v) => setSetting("slug", slugify(v))} />
      </Field>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-black/15 p-4">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A2F]">
          Search & Social Preview
        </div>
        <Field label="Page Title">
          <TextInput value={settings.seoTitle} onChange={(v) => setSetting("seoTitle", v)} />
        </Field>
        <Field label="Page Description">
          <TextArea value={settings.seoDescription} onChange={(v) => setSetting("seoDescription", v)} rows={2} />
        </Field>
        <MediaUpload
          label="Share Image"
          value={settings.ogImageUrl}
          onChange={(v) => setSetting("ogImageUrl", v)}
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-sky-400/20 bg-sky-500/8 p-4">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300">
          Meta Ads Tracking
        </div>
        <Field
          label="Extra Meta Pixel ID (optional)"
          hint="The Lala Stories pixel already runs on every page. Add a campaign-specific pixel here to track this page on a second pixel too. Both get PageView, Lead, Contact and InitiateCheckout."
        >
          <TextInput
            value={settings.metaPixelId}
            onChange={(v) => setSetting("metaPixelId", v)}
            placeholder="1234567890123456"
          />
        </Field>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-black/15 p-4">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A2F]">
          Page Background
        </div>
        <Field label="Background Style">
          <Select
            value={settings.bgType}
            onChange={(v) => setSetting("bgType", v)}
            options={[
              { value: "stars", label: "Animated night sky (default)" },
              { value: "gradient", label: "Purple gradient" },
              { value: "image", label: "Custom image" },
              { value: "video", label: "Custom video" },
            ]}
          />
        </Field>

        {settings.bgType === "image" && (
          <MediaUpload
            label="Background Image"
            value={settings.bgImageUrl}
            onChange={(v) => setSetting("bgImageUrl", v)}
          />
        )}

        {settings.bgType === "video" && (
          <MediaUpload
            label="Background Video"
            kind="video"
            value={settings.bgVideoUrl}
            onChange={(v) => setSetting("bgVideoUrl", v)}
          />
        )}

        {(settings.bgType === "image" || settings.bgType === "video") && (
          <Field
            label={`Darkness Overlay — ${settings.bgOverlay}%`}
            hint="Higher values keep text readable over busy media."
          >
            <input
              type="range"
              min={0}
              max={100}
              value={settings.bgOverlay}
              onChange={(e) => setSetting("bgOverlay", Number(e.target.value))}
              className="w-full cursor-pointer accent-[#FF7A2F]"
            />
          </Field>
        )}
      </div>
    </div>
  );
}

/** One-line preview of a block's content, shown in the section list. */
function blockSummary(block: Block): string {
  const d = block.data as unknown as Record<string, unknown>;
  const first = (d.headline || d.title || "") as string;
  if (first) return first;
  if (Array.isArray(d.items)) return `${d.items.length} items`;
  return BLOCK_META[block.type].description;
}

// --- Leads inbox ------------------------------------------------------

function LeadsInbox({
  leads,
  run,
}: {
  leads: LeadRow[];
  run: (fn: () => Promise<unknown>, ok?: string) => void;
}) {
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "All" && l.status !== filter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.pageName.toLowerCase().includes(q)
      );
    });
  }, [leads, filter, query]);

  /** Build a CSV in the browser — no round trip needed. */
  const exportCsv = () => {
    const rows = filtered.map((l) => {
      let extra = "";
      try {
        extra = Object.entries(JSON.parse(l.responses) as Record<string, string>)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" | ");
      } catch {
        extra = "";
      }
      return [
        new Date(l.createdAt).toLocaleString(),
        l.name,
        l.phone,
        l.email,
        l.pageName,
        l.campaign,
        l.source,
        l.status,
        extra,
      ];
    });

    const header = ["Date", "Name", "Phone", "Email", "Page", "Campaign", "Source", "Status", "Answers"];
    const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");

    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lala-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, email or page…"
          className={fieldBase}
        />
        <div className="flex shrink-0 gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`${fieldBase} cursor-pointer`}
          >
            {["All", "New", "Contacted", "Converted", "Rejected"].map((s) => (
              <option key={s} value={s} className="bg-[#1A1040]">
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={exportCsv}
            disabled={!filtered.length}
            className="shrink-0 cursor-pointer rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-2.5 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-500/25 active:scale-95 disabled:opacity-40"
          >
            Export CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-white/40">
            {leads.length === 0 ? "No leads yet. They'll appear here as people submit your forms." : "No leads match this filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => {
            let extras: [string, string][] = [];
            try {
              extras = Object.entries(JSON.parse(l.responses) as Record<string, string>);
            } catch {
              extras = [];
            }

            return (
              <div
                key={l.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-colors hover:border-white/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 grow">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-heading text-base font-extrabold text-white">{l.name}</h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                          STATUS_STYLES[l.status] || STATUS_STYLES.New
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                      <a href={`tel:${l.phone}`} className="font-bold text-[#FFB380] hover:underline">
                        {l.phone}
                      </a>
                      <a
                        href={`https://wa.me/${l.phone.replace(/[^\d]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-emerald-300 hover:underline"
                      >
                        WhatsApp ↗
                      </a>
                      {l.email && <span className="text-white/60">{l.email}</span>}
                    </div>

                    {extras.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {extras.map(([k, v]) => (
                          <span
                            key={k}
                            className="rounded-lg border border-white/10 bg-black/25 px-2.5 py-1 text-[11px] text-white/60"
                          >
                            <span className="text-white/35">{k}:</span> {v}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/40">
                      <span>{l.pageName}</span>
                      {l.campaign && <span>Campaign: {l.campaign}</span>}
                      {l.source && <span>Source: {l.source}</span>}
                      <span>{new Date(l.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      value={l.status}
                      onChange={(e) => run(() => updateLeadStatusAction(l.id, e.target.value), "Status updated.")}
                      className={`${fieldBase} w-auto cursor-pointer py-2 text-xs`}
                    >
                      {["New", "Contacted", "Converted", "Rejected"].map((s) => (
                        <option key={s} value={s} className="bg-[#1A1040]">
                          {s}
                        </option>
                      ))}
                    </select>
                    <IconButton
                      onClick={() => {
                        if (confirm(`Delete the lead from ${l.name}?`)) {
                          run(() => deleteLeadAction(l.id), "Lead deleted.");
                        }
                      }}
                      title="Delete lead"
                      tone="danger"
                    >
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </IconButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
