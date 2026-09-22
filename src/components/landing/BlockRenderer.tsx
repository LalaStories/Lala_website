import React, { Suspense } from "react";
import {
  Block,
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
} from "@/types/landing";
import { Story, Testimonial, FAQItem } from "@/types";
import HeroBlock from "./blocks/HeroBlock";
import { StatsBlock, FeaturesBlock, RichTextBlock, GalleryBlock, VideoBlock, CtaBlock } from "./blocks/SimpleBlocks";
import StoriesBlock from "./blocks/StoriesBlock";
import TestimonialsBlock from "./blocks/TestimonialsBlock";
import FaqBlock from "./blocks/FaqBlock";
import LeadFormBlock from "./blocks/LeadFormBlock";

interface BlockRendererProps {
  block: Block;
  landingPageId: string;
  campaignName: string;
  /** Shared library content, fetched once by the page. */
  stories: Story[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
}

/**
 * Maps one stored block to its component. Unknown types render nothing,
 * so an old page never breaks when block types change.
 */
export default function BlockRenderer({
  block,
  landingPageId,
  campaignName,
  stories,
  testimonials,
  faqs,
}: BlockRendererProps) {
  if (!block.enabled) return null;

  switch (block.type) {
    case "hero":
      return <HeroBlock data={block.data as HeroData} />;

    case "stats":
      return <StatsBlock data={block.data as StatsData} />;

    case "features":
      return <FeaturesBlock data={block.data as FeaturesData} />;

    case "stories": {
      const data = block.data as StoriesData;
      return (
        <StoriesBlock
          title={data.title}
          subtitle={data.subtitle}
          stories={stories.slice(0, data.limit || 3)}
        />
      );
    }

    case "testimonials": {
      const data = block.data as TestimonialsData;
      const items = data.useExisting
        ? testimonials.slice(0, data.limit || 3)
        : (data.items || []);
      return <TestimonialsBlock title={data.title} subtitle={data.subtitle} items={items} />;
    }

    case "faq": {
      const data = block.data as FaqData;
      const items = data.useExisting
        ? faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))
        : (data.items || []);
      return <FaqBlock title={data.title} subtitle={data.subtitle} items={items} />;
    }

    case "leadForm":
      return (
        // useSearchParams needs a Suspense boundary to read ad click params.
        <Suspense fallback={null}>
          <LeadFormBlock
            data={block.data as LeadFormData}
            landingPageId={landingPageId}
            campaignName={campaignName}
          />
        </Suspense>
      );

    case "video":
      return <VideoBlock data={block.data as VideoData} />;

    case "gallery":
      return <GalleryBlock data={block.data as GalleryData} />;

    case "richText":
      return <RichTextBlock data={block.data as RichTextData} />;

    case "cta":
      return <CtaBlock data={block.data as CtaData} />;

    default:
      return null;
  }
}
