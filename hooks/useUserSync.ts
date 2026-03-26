"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "@/lib/types";
import { hydrateAppState } from "@/lib/logic";
import { createSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-browser";
import { fetchUserProgress, upsertUserProgress } from "@/lib/supabase";

const OFFLINE_QUEUE_KEY = "daily-checklist-sync-queue-v2";

const readQueue = (): AppState[] => {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AppState[];
  } catch {
    return [];
  }
};

const writeQueue = (items: AppState[]) => {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(items.slice(-25)));
  } catch {
    // no-op
  }
};

export const useUserSync = (
  state: AppState,
  ready: boolean,
  setState: (updater: (prev: AppState) => AppState) => void
) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "syncing" | "offline" | "error" | "ready">("idle");
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const rememberMe = localStorage.getItem("remember-me");
      const sessionMarker = sessionStorage.getItem("remember-session");
      if (data.user && rememberMe === "false" && !sessionMarker) {
        void supabase.auth.signOut();
        setUserId(null);
        setStatus("idle");
        return;
      }
      if (data.user) {
        sessionStorage.setItem("remember-session", "active");
      }
      setUserId(data.user?.id ?? null);
      setStatus(data.user ? "ready" : "idle");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setStatus(session?.user ? "ready" : "idle");
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!ready || !userId) return;
    const pull = async () => {
      const remote = await fetchUserProgress(userId);
      if (!remote) return;
      const remoteState = hydrateAppState(remote.data);
      const remoteTs = new Date(remote.updated_at).getTime();
      const localTs = new Date(state.updatedAt ?? 0).getTime();
      if (remoteTs > localTs) {
        setState(() => remoteState);
      }
    };
    void pull();
  }, [ready, userId]);

  useEffect(() => {
    if (!ready || !userId) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      try {
        if (!navigator.onLine) {
          setStatus("offline");
          writeQueue([...readQueue(), state]);
          return;
        }
        setStatus("syncing");
        const queue = readQueue();
        for (const queued of queue) {
          await upsertUserProgress(userId, queued);
        }
        writeQueue([]);
        await upsertUserProgress(userId, state);
        setStatus("ready");
      } catch {
        setStatus("error");
        writeQueue([...readQueue(), state]);
      }
    }, 1000);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [state, ready, userId]);

  useEffect(() => {
    if (!ready || !userId || !hasSupabaseConfig) return;
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`progress-${userId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_progress", filter: `user_id=eq.${userId}` },
        (payload) => {
          const incoming = payload.new as { data: AppState; updated_at: string };
          const remoteTs = new Date(incoming.updated_at).getTime();
          const localTs = new Date(state.updatedAt ?? 0).getTime();
          if (remoteTs > localTs) {
            setState(() => hydrateAppState(incoming.data));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ready, userId, state.updatedAt]);

  useEffect(() => {
    if (!userId) return;
    const onOnline = async () => {
      const queue = readQueue();
      if (queue.length === 0) return;
      for (const queued of queue) {
        await upsertUserProgress(userId, queued);
      }
      writeQueue([]);
      setStatus("ready");
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [userId]);

  const signOut = async () => {
    if (!hasSupabaseConfig) return;
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUserId(null);
    setStatus("idle");
    window.location.href = "/login";
  };

  return useMemo(
    () => ({
      userId,
      status,
      signOut
    }),
    [userId, status]
  );
};
