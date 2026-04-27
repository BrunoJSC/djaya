"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useScrollObserver } from "./scroll-observer";

export type StackedItem = {
  eyebrow?: string;
  title: string;
  description?: string;
  href: string;
  cta: string;
  imageUrl: string;
  imageAlt: string;
};

function StackedPanel({
  item,
  index,
  total,
  priority,
}: Readonly<{
  item: StackedItem;
  index: number;
  total: number;
  priority?: boolean;
}>) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const progress = useScrollObserver(ref, { offset: ["start end", "end start"] });

  // Small parallax travel; stacking provides the main effect.
  const travel = 42;
  const y = useTransform(
    progress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-travel, travel],
  );

  return (
    <section
      ref={ref}
      className="sticky top-0 h-[100svh] min-h-[600px] w-full overflow-hidden bg-neutral-900"
      style={{ zIndex: index + 1 }}
      aria-label={item.title}
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ y, scale: 1.07 }}>
        <Image
          src={item.imageUrl}
          alt={item.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          quality={90}
          priority={priority}
        />
      </motion.div>

      {/* Minimal left-aligned overlay */}
      <div className="absolute inset-0 flex items-center justify-start px-8 text-left sm:px-16">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-xl tracking-[0.1em] text-white sm:text-2xl">
            {item.title}
          </h2>
          <span className="text-white/40">—</span>
          <Link
            href={item.href}
            className="text-[10px] font-medium tracking-[0.2em] text-white/70 uppercase hover:text-white transition-colors"
          >
            ver coleção
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function StackedSticky({
  items,
}: Readonly<{
  items: StackedItem[];
}>) {
  // Items are in normal flow, but each is sticky and stacks via z-index.
  return (
    <div className="w-full">
      {items.map((item, idx) => (
        <StackedPanel
          key={item.href}
          item={item}
          index={idx}
          total={items.length}
          priority={idx === 0}
        />
      ))}
    </div>
  );
}

