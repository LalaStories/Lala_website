"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface CartLine {
  productId: number;
  qty: number;
}

// Matches the place-order API: at most 50 lines, 1–99 of each.
const STORAGE_KEY = "lala-cart";
const MAX_LINES = 50;
const MAX_QTY = 99;

export interface CartSnapshot {
  lines: CartLine[];
  /** False until localStorage has been read, so the UI can avoid flicker. */
  ready: boolean;
}

// The basket lives outside React (in localStorage), so it is read through
// useSyncExternalStore rather than mirrored into state by an effect.
const EMPTY: CartSnapshot = { lines: [], ready: false };

let snapshot: CartSnapshot = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();

function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const byProduct = new Map<number, number>();
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) continue;
    const { productId, qty } = entry as Record<string, unknown>;
    if (!Number.isInteger(productId) || !Number.isInteger(qty)) continue;
    const id = productId as number;
    const quantity = qty as number;
    if (id <= 0 || quantity < 1) continue;
    byProduct.set(id, Math.min(quantity, MAX_QTY));
  }
  return Array.from(byProduct, ([productId, qty]) => ({ productId, qty })).slice(
    0,
    MAX_LINES
  );
}

function publish(lines: CartLine[]) {
  snapshot = { lines, ready: true };
  listeners.forEach((listener) => listener());
}

function persist(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch (e) {
    console.error("Failed to save cart", e);
  }
}

function initialize() {
  if (initialized) return;
  initialized = true;
  let lines: CartLine[] = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) lines = sanitize(JSON.parse(saved));
  } catch (e) {
    console.error("Failed to read cart", e);
  }
  publish(lines);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  initialize();
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = (): CartSnapshot => snapshot;
const getServerSnapshot = (): CartSnapshot => EMPTY;

function update(next: (lines: CartLine[]) => CartLine[]) {
  const lines = next(snapshot.lines);
  persist(lines);
  publish(lines);
}

export function useCart() {
  const { lines, ready } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const addItem = useCallback((productId: number, qty = 1) => {
    update((prev) => {
      const existing = prev.find((line) => line.productId === productId);
      if (existing) {
        return prev.map((line) =>
          line.productId === productId
            ? { ...line, qty: Math.min(line.qty + qty, MAX_QTY) }
            : line
        );
      }
      if (prev.length >= MAX_LINES) return prev;
      return [...prev, { productId, qty: Math.min(Math.max(qty, 1), MAX_QTY) }];
    });
  }, []);

  const setQty = useCallback((productId: number, qty: number) => {
    update((prev) =>
      qty < 1
        ? prev.filter((line) => line.productId !== productId)
        : prev.map((line) =>
            line.productId === productId
              ? { ...line, qty: Math.min(qty, MAX_QTY) }
              : line
          )
    );
  }, []);

  const removeItem = useCallback((productId: number) => {
    update((prev) => prev.filter((line) => line.productId !== productId));
  }, []);

  const clear = useCallback(() => update(() => []), []);

  return {
    lines,
    ready,
    totalCount: lines.reduce((sum, line) => sum + line.qty, 0),
    addItem,
    setQty,
    removeItem,
    clear,
  };
}
