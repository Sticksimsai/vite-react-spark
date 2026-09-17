/**
 * Server-side verification of Privy access tokens.
 *
 * The browser never writes to the database directly: `profiles` is read-only
 * for anon/authenticated roles. Writes go through server functions that verify
 * the caller's Privy access token against Privy's JWKS and then act as the
 * service role for exactly that Privy user id. That keeps the Privy id
 * un-spoofable without putting a second auth system in front of Supabase.
 */
import { createRemoteJWKSet, jwtVerify } from "jose";

const APP_ID: string = import.meta.env['VITE_PRIVY_APP_ID'] ?? "";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

/** Returns the Privy user id (`sub`) for a valid token; throws otherwise. */
export async function privyUserId(token: string): Promise<string> {
  if (!APP_ID) throw new Error("Sign-in is not configured yet.");
  if (!token) throw new Error("Not signed in.");
  jwks ??= createRemoteJWKSet(
    new URL(`https://auth.privy.io/api/v1/apps/${APP_ID}/jwks.json`),
  );
  const { payload } = await jwtVerify(token, jwks, {
    issuer: "privy.io",
    audience: APP_ID,
  });
  if (!payload.sub) throw new Error("Not signed in.");
  return payload.sub;
}
