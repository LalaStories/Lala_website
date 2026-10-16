"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsParams } from "@/lib/analytics";

interface TrackOnMountProps {
  event: string;
  params?: AnalyticsParams;
}

/**
 * Fires one analytics event when it mounts, so server-rendered pages
 * (e.g. a product page reporting view_item) can report without becoming
 * client components. Params are compared by value, so a re-render with
 * an equal object doesn't fire again; give it a `key` to re-fire on change.
 */
export default function TrackOnMount({ event, params }: TrackOnMountProps) {
  const serialized = JSON.stringify(params ?? {});
  useEffect(() => {
    trackEvent(event, JSON.parse(serialized) as AnalyticsParams);
  }, [event, serialized]);
  return null;
}
