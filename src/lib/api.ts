/**
 * Thin client for the CULT backend (the Next.js app in the monorepo, which serves /api/beta/*).
 * Set VITE_API_BASE to that server's origin. Every hook falls back gracefully so the UI still renders
 * with example data when the backend is offline.
 */
import { useEffect, useState } from 'react';

export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';
export const api = (path: string) => `${API_BASE}${path}`;

export type LiveCoin = { token: string; name: string; symbol: string; route: string; graduated: boolean; reserve: string; graduationThreshold?: string; funded: string; paid: string; blockNumber: number; curve?: string; vault?: string; credit?: string; balance?: string; available?: string };
export type StateResponse = { sessionId: string; coins: LiveCoin[]; health: { stale: boolean; checkpoint: number } };
export type Buy = { id: string; token: string; symbol: string; name: string; buyer: string; amount: string; blockNumber: number; route: 'curve' | 'pool'; image?: string };
export type BuysResponse = { checkpoint: number; buys: Buy[] };
export type AnalyticsResponse = {
  sessionId: string; checkpoint: number; stale: boolean;
  totals: { received: string; funded: string; paid: string; holders: string; community: string; platform: string; creators: string; curveVolume: string; poolVolume: string; curveTrades: number; poolTrades: number };
  coins: (LiveCoin & { received: string; curveTrades: number; poolTrades: number })[];
  timeline: { date: string; received: string; funded: string; paid: string }[];
  coverage: string;
};
export type LedgerResponse = { sessionId: string; checkpoint: number; stale: boolean; rounds: { id: string; symbol: string; epoch: string | number; budget: string; paid: string; status: string }[] };

export async function getJson<T>(path: string): Promise<T> {
  const r = await fetch(api(path), { cache: 'no-store' });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${r.status})`);
  return data as T;
}

/** Poll an endpoint every `interval` ms. `error` is set (and `data` kept) when the backend is unreachable. */
export function useLive<T>(path: string, interval = 5000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      try { const d = await getJson<T>(path); if (alive) { setData(d); setError(''); } }
      catch (e) { if (alive) setError(e instanceof Error ? e.message : 'Backend unavailable'); }
    };
    refresh();
    const t = setInterval(refresh, interval);
    return () => { alive = false; clearInterval(t); };
  }, [path, interval]);
  return { data, error, live: !!data && !error };
}
