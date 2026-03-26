"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const createSupabaseBrowserClient = () => {
  if (!hasSupabaseConfig) {
    throw new Error("Missing Supabase public environment variables.");
  }
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
};
