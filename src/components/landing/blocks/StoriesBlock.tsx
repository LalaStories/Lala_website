import React from "react";
import { Story } from "@/types";
import { StoryCard } from "@/components/ui/StoryCard";
import SectionHeading from "../SectionHeading";

interface StoriesBlockProps {
  title: string;
  subtitle: string;
  /** Live rows from the Story table, already limited by the page. */
  stories: Story[];
}

/**
 * Playable story cards. These come from the shared Story library rather
 * than block content, so adding a story in admin updates every campaign.
 */
export default function StoriesBlock({ title, subtitle, stories }: StoriesBlockProps) {
  if (!stories.length) return null;

  return (
    <section className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
