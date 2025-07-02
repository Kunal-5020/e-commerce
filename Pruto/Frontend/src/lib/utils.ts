// File: lib/utils.ts

import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditionally combines class names and merges Tailwind classes to avoid conflicts.
 *
 * @param inputs – any number of strings, arrays, or objects accepted by clsx
 * @returns the merged className string
 */
export function cn(...inputs: ClassValue[]) {
  // First, let clsx handle conditional logic
  const combined = clsx(...inputs);
  // Then merge Tailwind-specific classes (e.g. p-2 followed by p-4 → p-4)
  return twMerge(combined);
}
