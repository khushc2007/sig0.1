"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

const DURATION = 0.3;
const EASE_OUT = "easeOut";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const VideoPlayer = ({ onClose }: { onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  }, []);

  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [resetHideTimer]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
    resetHideTimer();
  };

  const seek = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + delta));
    resetHideTimer();
  };

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
    resetHideTimer();
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center bg-black"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
    >
      <video
        ref={videoRef}
        src="/video.mp4"
        className="w-full h-full object-contain"
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
      />

      {/* Controls overlay */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6"
          >
            <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-primary/20 backdrop-blur-xl px-5 py-4 shadow-button ring-1 ring-border/10 ring-offset-2 ring-offset-black/20">
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/60 tabular-nums w-10 shrink-0">{formatTime(currentTime)}</span>
                <div className="relative flex-1 h-1 group">
                  <input
                    type="range"
                    min={0}
                    max={duration || 1}
                    step={0.1}
                    value={currentTime}
                    onChange={onScrub}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-1 rounded-full bg-foreground/20">
                    <div
                      className="h-full rounded-full bg-foreground transition-all"
                      style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
                <span className="text-xs text-foreground/60 tabular-nums w-10 shrink-0 text-right">{formatTime(duration)}</span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-center gap-3">
                {/* Rewind 10s */}
                <button
                  onClick={() => seek(-10)}
                  className="inline-flex items-center justify-center size-9 rounded-full border border-border/50 bg-primary/20 backdrop-blur-sm text-foreground hover:bg-primary/30 shadow-button transition-colors"
                  title="Rewind 10s"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                    <text x="8" y="15" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">10</text>
                  </svg>
                </button>

                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="inline-flex items-center justify-center size-11 rounded-full border border-border/50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-button transition-colors"
                >
                  {playing ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                  )}
                </button>

                {/* Forward 10s */}
                <button
                  onClick={() => seek(10)}
                  className="inline-flex items-center justify-center size-9 rounded-full border border-border/50 bg-primary/20 backdrop-blur-sm text-foreground hover:bg-primary/30 shadow-button transition-colors"
                  title="Forward 10s"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <text x="8" y="15" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">10</text>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute top-6 right-6 inline-flex items-center justify-center size-9 rounded-full border border-border/50 bg-primary/20 backdrop-blur-xl text-foreground hover:bg-primary/30 shadow-button transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Newsletter = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVideoOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!videoOpen ? (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: DURATION, ease: EASE_OUT }}
            className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full short:lg:pt-10 pb-footer-safe-area 2xl:pt-footer-safe-area px-sides short:lg:gap-4 lg:gap-8"
          >
            <motion.div layout="position" transition={{ duration: DURATION, ease: EASE_OUT }}>
              <h1 className="font-serif text-5xl italic short:lg:text-8xl sm:text-8xl lg:text-9xl text-foreground">
                Water-IQ
              </h1>
            </motion.div>
            <Button className="relative px-8" shine onClick={() => setVideoOpen(true)}>
              Proceed
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION, ease: EASE_OUT }}
            className="fixed inset-0 z-50"
          >
            <VideoPlayer onClose={() => setVideoOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
