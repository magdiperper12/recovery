import { AppState } from "@/lib/types";
import { createSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-browser";

export interface UserProgressRow {
  id: string;
  user_id: string;
  data: AppState;
  updated_at: string;
}

export const upsertUserProgress = async (userId: string, state: AppState) => {
  if (!hasSupabaseConfig) return;
  const supabase = createSupabaseBrowserClient();
  await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      data: state,
      updated_at: state.updatedAt ?? new Date().toISOString()
    },
    { onConflict: "user_id" }
  );
};

export const fetchUserProgress = async (userId: string): Promise<UserProgressRow | null> => {
  if (!hasSupabaseConfig) return null;
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data as UserProgressRow;
};
