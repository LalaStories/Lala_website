"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Story } from "@/types";

interface AudioContextType {
  activeStory: Story | null;
  isPlaying: boolean;
  listenedSeconds: number;
  gateReached: boolean;
  playStory: (story: Story) => void;
  pauseStory: () => void;
  resumeStory: () => void;
  closePlayer: () => void;
  totalGateSeconds: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const REQUIRED_GATE_SECONDS = 50;

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [listenedSeconds, setListenedSeconds] = useState(0);
  const [gateReached, setGateReached] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio element on mount (client-side only)
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Control playback timer interval
  useEffect(() => {
    if (isPlaying && !gateReached) {
      intervalRef.current = setInterval(() => {
        setListenedSeconds((prev) => {
          const next = prev + 1;
          if (next >= REQUIRED_GATE_SECONDS) {
            // Trigger 50-second preview gate lockup
            setGateReached(true);
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return REQUIRED_GATE_SECONDS;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, gateReached]);

  const playStory = (story: Story) => {
    if (!audioRef.current) return;

    // If starting a new story or restarting a blocked one
    if (activeStory?.id !== story.id) {
      audioRef.current.pause();
      audioRef.current.src = story.audioSrc;
      setActiveStory(story);
      setListenedSeconds(0);
      setGateReached(false);
      audioRef.current.load();
    }

    // Try to play
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Playback failed or was interrupted:", err);
      });
  };

  const pauseStory = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeStory = () => {
    if (audioRef.current && activeStory && !gateReached) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Playback resume failed:", err);
        });
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setActiveStory(null);
    setListenedSeconds(0);
    setGateReached(false);
  };

  return (
    <AudioContext.Provider
      value={{
        activeStory,
        isPlaying,
        listenedSeconds,
        gateReached,
        playStory,
        pauseStory,
        resumeStory,
        closePlayer,
        totalGateSeconds: REQUIRED_GATE_SECONDS,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
