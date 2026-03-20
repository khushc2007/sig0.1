"use client";

import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./ui/button";
import { socialLinks } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: "50%",
          transform: `translateX(-50%) translateY(${hovered ? "0px" : "6px"})`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease, transform 0.2s ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "6px",
          padding: "4px 10px",
          fontSize: "11px",
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.05em",
          fontFamily: "monospace",
        }}
      >
        {label}
      </div>

      <Link
        target="_blank"
        className={buttonVariants({ size: "icon-xl" })}
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? "scale(1.12)" : "scale(1)",
          transition: "transform 0.2s ease",
        }}
      >
        {children}
      </Link>
    </div>
  );
}

export const Footer = () => {
  return (
    <div className="flex gap-6 items-center absolute bottom-4 md:bottom-[calc(var(--inset)+1.5rem)] left-1/2 -translate-x-1/2 whitespace-nowrap">
      <span className="text-sm text-foreground/60">Developed by Khush</span>

      {/* Website first, GitHub second */}
      <IconLink href={socialLinks.website ?? "#"} label="Khush's Portfolio">
        <GlobeIcon className="size-6" />
      </IconLink>

      <IconLink href={socialLinks.github} label="Khush's Github">
        <GitHubLogoIcon className="size-6" />
      </IconLink>
    </div>
  );
};
