"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

const DURATION = 0.3;
const EASE_OUT = "easeOut";

const VideoTransition = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    const onEnded = () => {
      window.location.href = "https://0-2-xi.vercel.app/#dashboard";
    };
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  return (
    <video
      ref={videoRef}
      src="/video.mp4"
      playsInline
      muted={false}
      className="fixed inset-0 w-full h-full object-cover z-50"
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export const Newsletter = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {!videoOpen ? (
          <motion.div
            key="hero"
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
            transition={{ duration: DURATION, ease: EASE_OUT }}
            className="fixed inset-0 z-50 bg-black"
          >
            <VideoTransition />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
