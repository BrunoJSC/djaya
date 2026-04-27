"use client";

import { MotionValue, useScroll, UseScrollOptions } from "framer-motion";
import { RefObject } from "react";

type UseScrollObserverOptions = Readonly<{
  offset?: UseScrollOptions["offset"];
}>;

export function useScrollObserver(
  targetRef: RefObject<HTMLElement | null>,
  {
    offset = ["start end", "end start"] as UseScrollOptions["offset"],
  }: UseScrollObserverOptions = {},
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset,
  });

  // No spring: fully scroll-driven (no inertial animation).
  return scrollYProgress;
}
