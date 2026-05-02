"use client";

import { useEffect, useState } from "react";
import { MagicCircle } from "./MagicCircle";

export function ClientBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] dark:opacity-[0.07] transition-opacity duration-1000 ease-in">
      <MagicCircle size={1100} intensity="subtle" />
    </div>
  );
}
