"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export const FAVORITES_KEY = "prisma:favorites";
export const COMPARE_KEY = "prisma:compare";
const EVENT = "prisma:vehicle-selection";

const serverSnapshot = () => "[]";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
};

const parse = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

export function useVehicleSelection(key: string) {
  const getSnapshot = useCallback(() => window.localStorage.getItem(key) || "[]", [key]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  return useMemo(() => parse(raw), [raw]);
}

export function writeVehicleSelection(key: string, values: string[]) {
  window.localStorage.setItem(key, JSON.stringify(values));
  window.dispatchEvent(new Event(EVENT));
}

export function toggleVehicleSelection(key: string, slug: string, max?: number) {
  const current = parse(window.localStorage.getItem(key) || "[]");
  if (current.includes(slug)) {
    writeVehicleSelection(key, current.filter((item) => item !== slug));
    return true;
  }
  if (typeof max === "number" && current.length >= max) return false;
  writeVehicleSelection(key, [...current, slug]);
  return true;
}
