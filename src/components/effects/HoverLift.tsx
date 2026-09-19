"use client";

import { motion } from "motion/react";

/** Spring lift on hover. The only reason a card needs client JS. */
export function HoverLift({ children, y = -4 }: { children: React.ReactNode; y?: number }) {
  return (
    <motion.div whileHover={{ y }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="h-full">
      {children}
    </motion.div>
  );
}
