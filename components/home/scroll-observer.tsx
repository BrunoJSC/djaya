"use client";

import { MotionValue, useScroll } from "framer-motion";
import { RefObject } from "react";

type UseScrollObserverOptions = Readonly<{
  offset?: [string, string];
}>;

export function useScrollObserver(
  targetRef: RefObject<HTMLElement | null>,
  {
    offset = ["start end", "end start"],
  }: UseScrollObserverOptions = {},
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset,
  });

  // No spring: fully scroll-driven (no inertial animation).
  return scrollYProgress;
}
