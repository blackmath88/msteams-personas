import { useSyncExternalStore } from 'react';

/*
 * The agreements a reader has adopted, per team. Kept in this browser only (localStorage);
 * the page works without it, for example in a private window.
 */
const KEY = 'praxis-hub.vereinbarungen';
type Store = Record<string, string[]>;
let cache: Store | null = null;
const listeners = new Set<() => void>();

function read(): Store {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(KEY) || '{}') as Store; } catch { cache = {}; }
  return cache;
}
function write(next: Store) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* stays in memory for this visit */ }
  listeners.forEach((l) => l());
}
const EMPTY: string[] = [];

export function useAgreements(team: string): string[] {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => read()[team] ?? EMPTY
  );
}
export function toggleAgreement(team: string, situationId: string) {
  const all = read(), mine = all[team] ?? [];
  write({ ...all, [team]: mine.includes(situationId) ? mine.filter((x) => x !== situationId) : [...mine, situationId] });
}
