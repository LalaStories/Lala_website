"use client";

import React from "react";
import {
  Block,
  BLOCK_META,
  HeroData,
  StatsData,
  FeaturesData,
  StoriesData,
  TestimonialsData,
  FaqData,
  LeadFormData,
  VideoData,
  GalleryData,
  RichTextData,
  CtaData,
  LeadFieldType,
  newId,
} from "@/types/landing";
import { Field, TextInput, TextArea, Select, Toggle, MediaUpload, CtaEditor, RepeaterList } from "./ui";

interface BlockEditorProps {
  block: Block;
  onChange: (data: Block["data"]) => void;
}

/**
 * Renders the editing form for whichever block is selected.
 * Each branch narrows block.data to its concrete shape.
 */
export default function BlockEditor({ block, onChange }: BlockEditorProps) {
  const meta = BLOCK_META[block.type];

  /** Patch helper — merges a partial into the current block data. */
  const patch = <T,>(data: T) =>
    (changes: Partial<T>) => onChange({ ...data, ...changes } as unknown as Block["data"]);

  return (
    <div className="space-y-5">
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF7A2F]/20 text-sm text-[#FF7A2F]">
            {meta.icon}
          </span>
          <div>
            <h3 className="font-heading text-lg font-extrabold text-white">{meta.label}</h3>
            <p className="text-[11px] text-white/40">{meta.description}</p>
          </div>
        </div>
      </div>

      {renderFields(block, patch)}
    </div>
  );
}

function renderFields(
  block: Block,
  patch: <T>(data: T) => (changes: Partial<T>) => void
): React.ReactNode {
  switch (block.type) {
    // ---------------------------------------------------------------- hero
    case "hero": {
      const d = block.data as HeroData;
      const set = patch(d);
      return (
        <>
          <Field label="Badge" hint="Small pill above the headline. Leave empty to hide.">
            <TextInput value={d.badge} onChange={(v) => set({ badge: v })} placeholder="Limited Time Offer" />
          </Field>
          <Field label="Headline">
            <TextInput value={d.headline} onChange={(v) => set({ headline: v })} placeholder="Bedtime Stories That" />
          </Field>
          <Field label="Highlighted Words" hint="Appended to the headline in orange.">
            <TextInput value={d.highlight} onChange={(v) => set({ highlight: v })} placeholder="Kids Actually Love" />
          </Field>
          <Field label="Sub-headline">
            <TextArea value={d.subhead} onChange={(v) => set({ subhead: v })} rows={3} />
          </Field>
          <MediaUpload
            label="Hero Image (optional)"
            value={d.imageUrl}
            onChange={(v) => set({ imageUrl: v })}
          />
          <Field label="Text Alignment" hint="Ignored when a hero image is set.">
            <Select
              value={d.align}
              onChange={(v) => set({ align: v })}
              options={[
                { value: "center", label: "Centered" },
                { value: "left", label: "Left aligned" },
              ]}
            />
          </Field>
          <CtaEditor cta={d.primaryCta} onChange={(c) => set({ primaryCta: c })} title="Primary Button" />
          <Toggle checked={d.showSecondary} onChange={(v) => set({ showSecondary: v })} label="Show a second button" />
          {d.showSecondary && (
            <CtaEditor cta={d.secondaryCta} onChange={(c) => set({ secondaryCta: c })} title="Secondary Button" />
          )}
        </>
      );
    }

    // --------------------------------------------------------------- stats
    case "stats": {
      const d = block.data as StatsData;
      const set = patch(d);
      return (
        <RepeaterList
          items={d.items || []}
          onChange={(items) => set({ items })}
          makeItem={() => ({ id: newId(), value: "", label: "" })}
          addLabel="Add stat"
          renderItem={(item, update) => (
            <>
              <Field label="Number">
                <TextInput value={item.value} onChange={(v) => update({ value: v })} placeholder="3000+" />
              </Field>
              <Field label="Caption">
                <TextInput value={item.label} onChange={(v) => update({ label: v })} placeholder="Stories" />
              </Field>
            </>
          )}
        />
      );
    }

    // ------------------------------------------------------------ features
    case "features": {
      const d = block.data as FeaturesData;
      const set = patch(d);
      return (
        <>
          <Field label="Section Title">
            <TextInput value={d.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Section Subtitle">
            <TextInput value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
          </Field>
          <RepeaterList
            items={d.items || []}
            onChange={(items) => set({ items })}
            makeItem={() => ({ id: newId(), icon: "✨", title: "", text: "" })}
            addLabel="Add feature"
            renderItem={(item, update) => (
              <>
                <Field label="Icon" hint="Any emoji — 🌙 📚 🎧 ⭐ 📵">
                  <TextInput value={item.icon} onChange={(v) => update({ icon: v })} placeholder="🌙" />
                </Field>
                <Field label="Title">
                  <TextInput value={item.title} onChange={(v) => update({ title: v })} />
                </Field>
                <Field label="Description">
                  <TextArea value={item.text} onChange={(v) => update({ text: v })} rows={2} />
                </Field>
              </>
            )}
          />
        </>
      );
    }

    // ------------------------------------------------------------- stories
    case "stories": {
      const d = block.data as StoriesData;
      const set = patch(d);
      return (
        <>
          <Field label="Section Title">
            <TextInput value={d.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Section Subtitle">
            <TextInput value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
          </Field>
          <Field
            label="How Many Stories"
            hint="Pulled live from your Stories library — add stories in the main dashboard."
          >
            <Select
              value={String(d.limit || 3)}
              onChange={(v) => set({ limit: Number(v) })}
              options={[3, 6, 9, 12].map((n) => ({ value: String(n), label: `${n} stories` }))}
            />
          </Field>
        </>
      );
    }

    // -------------------------------------------------------- testimonials
    case "testimonials": {
      const d = block.data as TestimonialsData;
      const set = patch(d);
      return (
        <>
          <Field label="Section Title">
            <TextInput value={d.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Section Subtitle">
            <TextInput value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
          </Field>
          <Toggle
            checked={d.useExisting}
            onChange={(v) => set({ useExisting: v })}
            label="Use my shared testimonials"
          />
          {d.useExisting ? (
            <Field label="How Many" hint="Pulled from the Testimonials tab in the main dashboard.">
              <Select
                value={String(d.limit || 3)}
                onChange={(v) => set({ limit: Number(v) })}
                options={[3, 6, 9].map((n) => ({ value: String(n), label: `${n} reviews` }))}
              />
            </Field>
          ) : (
            <RepeaterList
              items={d.items || []}
              onChange={(items) => set({ items })}
              makeItem={() => ({ id: newId(), text: "", authorName: "", authorRole: "", avatarLetter: "" })}
              addLabel="Add testimonial"
              renderItem={(item, update) => (
                <>
                  <Field label="Quote">
                    <TextArea value={item.text} onChange={(v) => update({ text: v })} rows={3} />
                  </Field>
                  <Field label="Author Name">
                    <TextInput value={item.authorName} onChange={(v) => update({ authorName: v })} />
                  </Field>
                  <Field label="Author Role">
                    <TextInput value={item.authorRole} onChange={(v) => update({ authorRole: v })} placeholder="Mother of 2" />
                  </Field>
                  <Field label="Avatar Letter" hint="Leave blank to use the first letter of the name.">
                    <TextInput value={item.avatarLetter} onChange={(v) => update({ avatarLetter: v.slice(0, 1) })} />
                  </Field>
                </>
              )}
            />
          )}
        </>
      );
    }

    // ----------------------------------------------------------------- faq
    case "faq": {
      const d = block.data as FaqData;
      const set = patch(d);
      return (
        <>
          <Field label="Section Title">
            <TextInput value={d.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Section Subtitle">
            <TextInput value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
          </Field>
          <Toggle checked={d.useExisting} onChange={(v) => set({ useExisting: v })} label="Use my shared FAQs" />
          {!d.useExisting && (
            <RepeaterList
              items={d.items || []}
              onChange={(items) => set({ items })}
              makeItem={() => ({ id: newId(), question: "", answer: "" })}
              addLabel="Add question"
              renderItem={(item, update) => (
                <>
                  <Field label="Question">
                    <TextInput value={item.question} onChange={(v) => update({ question: v })} />
                  </Field>
                  <Field label="Answer">
                    <TextArea value={item.answer} onChange={(v) => update({ answer: v })} rows={3} />
                  </Field>
                </>
              )}
            />
          )}
        </>
      );
    }

    // ------------------------------------------------------------ leadForm
    case "leadForm": {
      const d = block.data as LeadFormData;
      const set = patch(d);
      return (
        <>
          <Field label="Form Title">
            <TextInput value={d.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Form Subtitle">
            <TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} rows={2} />
          </Field>
          <Field label="Submit Button Text">
            <TextInput value={d.buttonLabel} onChange={(v) => set({ buttonLabel: v })} />
          </Field>

          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/8 p-3.5">
            <p className="text-[11px] leading-relaxed text-emerald-200/70">
              Name, phone and email are always collected. Add any extra questions below.
            </p>
          </div>

          <RepeaterList
            items={d.fields || []}
            onChange={(fields) => set({ fields })}
            makeItem={() => ({ id: newId(), label: "", type: "text" as LeadFieldType, required: false, options: "", placeholder: "" })}
            addLabel="Add custom question"
            renderItem={(item, update) => (
              <>
                <Field label="Question Label">
                  <TextInput value={item.label} onChange={(v) => update({ label: v })} placeholder="Child's Age" />
                </Field>
                <Field label="Answer Type">
                  <Select
                    value={item.type}
                    onChange={(v) => update({ type: v as LeadFieldType })}
                    options={[
                      { value: "text", label: "Short text" },
                      { value: "textarea", label: "Long text" },
                      { value: "tel", label: "Phone number" },
                      { value: "email", label: "Email" },
                      { value: "number", label: "Number" },
                      { value: "select", label: "Dropdown" },
                    ]}
                  />
                </Field>
                {item.type === "select" && (
                  <Field label="Dropdown Choices" hint="Separate each choice with a comma.">
                    <TextInput
                      value={item.options || ""}
                      onChange={(v) => update({ options: v })}
                      placeholder="3-4, 5-6, 7-8, 9-10"
                    />
                  </Field>
                )}
                <Toggle
                  checked={item.required}
                  onChange={(v) => update({ required: v })}
                  label="Required"
                />
              </>
            )}
          />

          <Field label="Consent / Privacy Note">
            <TextArea value={d.consentText} onChange={(v) => set({ consentText: v })} rows={2} />
          </Field>
          <Field label="Success Title">
            <TextInput value={d.successTitle} onChange={(v) => set({ successTitle: v })} />
          </Field>
          <Field label="Success Message">
            <TextArea value={d.successMessage} onChange={(v) => set({ successMessage: v })} rows={2} />
          </Field>
        </>
      );
    }

    // --------------------------------------------------------------- video
    case "video": {
      const d = block.data as VideoData;
      const set = patch(d);
      return (
        <>
          <Field label="Section Title">
            <TextInput value={d.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Section Subtitle">
            <TextInput value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
          </Field>
          <MediaUpload
            label="Video"
            kind="video"
            value={d.videoUrl}
            onChange={(v) => set({ videoUrl: v })}
          />
          <div className="rounded-2xl border border-white/10 bg-black/15 p-3.5">
            <p className="text-[11px] leading-relaxed text-white/40">
              YouTube and Vimeo links work too — just paste the link in the field above.
            </p>
          </div>
          <MediaUpload
            label="Poster Image (uploaded video only)"
            value={d.posterUrl}
            onChange={(v) => set({ posterUrl: v })}
          />
        </>
      );
    }

    // ------------------------------------------------------------- gallery
    case "gallery": {
      const d = block.data as GalleryData;
      const set = patch(d);
      return (
        <>
          <Field label="Section Title">
            <TextInput value={d.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Section Subtitle">
            <TextInput value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
          </Field>
          <RepeaterList
            items={d.items || []}
            onChange={(items) => set({ items })}
            makeItem={() => ({ id: newId(), imageUrl: "", caption: "" })}
            addLabel="Add image"
            renderItem={(item, update) => (
              <>
                <MediaUpload label="Image" value={item.imageUrl} onChange={(v) => update({ imageUrl: v })} />
                <Field label="Caption">
                  <TextInput value={item.caption} onChange={(v) => update({ caption: v })} />
                </Field>
              </>
            )}
          />
        </>
      );
    }

    // ------------------------------------------------------------ richText
    case "richText": {
      const d = block.data as RichTextData;
      const set = patch(d);
      return (
        <>
          <Field label="Heading">
            <TextInput value={d.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Body" hint="Leave a blank line between paragraphs.">
            <TextArea value={d.body} onChange={(v) => set({ body: v })} rows={8} />
          </Field>
        </>
      );
    }

    // ----------------------------------------------------------------- cta
    case "cta": {
      const d = block.data as CtaData;
      const set = patch(d);
      return (
        <>
          <Field label="Headline">
            <TextInput value={d.headline} onChange={(v) => set({ headline: v })} />
          </Field>
          <Field label="Supporting Text">
            <TextArea value={d.text} onChange={(v) => set({ text: v })} rows={2} />
          </Field>
          <CtaEditor cta={d.primaryCta} onChange={(c) => set({ primaryCta: c })} title="Primary Button" />
          <Toggle checked={d.showSecondary} onChange={(v) => set({ showSecondary: v })} label="Show a second button" />
          {d.showSecondary && (
            <CtaEditor cta={d.secondaryCta} onChange={(c) => set({ secondaryCta: c })} title="Secondary Button" />
          )}
        </>
      );
    }

    default:
      return null;
  }
}
