"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

const DURATION = 0.3;
const EASE_OUT = "easeOut";

export const Newsletter = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoOpen && videoRef.current) {
      videoRef.current.play();
    }
  }, [videoOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVideoOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full short:lg:pt-10 pb-footer-safe-area 2xl:pt-footer-safe-area px-sides short:lg:gap-4 lg:gap-8">
        <motion.div
          layout="position"
          transition={{ duration: DURATION, ease: EASE_OUT }}
        >
          <h1 className="font-serif text-5xl italic short:lg:text-8xl sm:text-8xl lg:text-9xl text-foreground">
            Water-IQ
          </h1>
        </motion.div>

        <Button
          className="relative px-8"
          shine
          onClick={() => setVideoOpen(true)}
        >
          Proceed
        </Button>
      </div>

      <AnimatePresence>
        {videoOpen && (
          <motion.div
            key="video-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION, ease: EASE_OUT }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setVideoOpen(false)}
          >
            <video
              ref={videoRef}
              src="/video.mp4"
              className="max-w-full max-h-full"
              controls
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
