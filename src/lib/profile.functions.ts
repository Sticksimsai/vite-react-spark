/**
 * Profile reads and writes.
 *
 * Reads are public (anon SELECT policy). Writes are only possible through
 * these server functions, which verify a Privy access token first — see
 * privy.server.ts.
 */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Profile = {
  id: string;
  handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  addresses: string[];
  holdings_public: boolean;
};

const AVATARS = "avatars";

function publicClient() {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  return createClient<Database>(process.env['SUPABASE_URL']!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Avatars live in a private bucket; hand back a short-lived signed link. */
async function signAvatar(path: string | null): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from(AVATARS).createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

export const getProfile = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }): Promise<Profile | null> => {
    if (!data.id) return null;
    const { data: row } = await publicClient()
      .from("profiles")
      .select("id, handle, avatar_url, bio, addresses, holdings_public")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return null;
    return { ...row, avatar_url: await signAvatar(row.avatar_url) } as Profile;
  });

export const saveProfile = createServerFn({ method: "POST" })
  .inputValidator((input: {
    token: string;
    handle: string;
    bio: string;
    addresses: string[];
    holdings_public: boolean;
  }) => input)
  .handler(async ({ data }): Promise<Profile> => {
    const { privyUserId } = await import("./privy.server");
    const id = await privyUserId(data.token);
    const handle = data.handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id,
          handle: handle.length > 0 ? handle : null,
          bio: data.bio.trim().slice(0, 500) || null,
          addresses: data.addresses.map((a) => a.toLowerCase()),
          holdings_public: data.holdings_public,
        },
        { onConflict: "id" },
      )
      .select("id, handle, avatar_url, bio, addresses, holdings_public")
      .single();
    if (error) {
      throw new Error(
        error.code === "23505" ? "That handle is already taken." : "Could not save your profile.",
      );
    }
    return { ...row, avatar_url: await signAvatar(row.avatar_url) } as Profile;
  });

export const uploadAvatar = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string; dataUrl: string }) => input)
  .handler(async ({ data }): Promise<{ avatar_url: string | null }> => {
    const { privyUserId } = await import("./privy.server");
    const id = await privyUserId(data.token);
    const match = /^data:(image\/(png|jpeg|webp));base64,(.+)$/.exec(data.dataUrl);
    if (!match) throw new Error("Use a PNG, JPG or WebP image.");
    const contentType = match[1]!;
    const bytes = Uint8Array.from(atob(match[3]!), (c) => c.charCodeAt(0));
    if (bytes.byteLength > 2 * 1024 * 1024) throw new Error("Image must be under 2 MB.");
    const path = `${id.replace(/[^a-zA-Z0-9:_-]/g, "_")}/avatar-${Date.now()}.${contentType.split("/")[1]}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const up = await supabaseAdmin.storage.from(AVATARS).upload(path, bytes, { contentType, upsert: true });
    if (up.error) throw new Error("Could not upload that image.");
    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({ id, avatar_url: path }, { onConflict: "id" });
    if (error) throw new Error("Could not save that image.");
    return { avatar_url: await signAvatar(path) };
  });
