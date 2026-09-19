"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight page-transition effect. On each route change, the main
 * content fades/slides in via a CSS class that self-removes after the
 * animation completes. Works without the View Transitions API.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    // Skip animation on initial mount
    if (!main.dataset.ready) {
      main.dataset.ready = "1";
      return;
    }

    main.classList.remove("page-enter");
    // Force reflow so the browser re-triggers the animation
    void main.offsetHeight;
    main.classList.add("page-enter");

    const onEnd = () => main.classList.remove("page-enter");
    main.addEventListener("animationend", onEnd, { once: true });
    return () => main.removeEventListener("animationend", onEnd);
  }, [pathname]);

  return <>{children}</>;
}
