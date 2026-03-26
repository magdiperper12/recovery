"use client";

import { useEffect, useMemo, useState } from "react";
import { AppState } from "@/lib/types";
import { hydrateAppState } from "@/lib/logic";
import { createDefaultAppState } from "@/lib/migration";
import {
  exportAppData,
  importAppData,
  readVersionedStorage,
  resetAppData,
  writeVersionedStorage
} from "@/lib/storage";

export const useStorage = () => {
  const [state, setState] = useState<AppState>(createDefaultAppState());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = readVersionedStorage().data;
    setState(hydrateAppState(loaded));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeVersionedStorage(hydrateAppState(state));
  }, [state, ready]);

  const actions = useMemo(
    () => ({
      setState,
      exportData: () => exportAppData(state),
      importData: (rawText: string) => {
        const result = importAppData(rawText);
        if (!result.ok) {
          setError(result.error);
          return false;
        }
        setState(hydrateAppState(result.state));
        setError(null);
        return true;
      },
      resetData: () => {
        const clean = resetAppData();
        setState(clean);
      },
      clearError: () => setError(null)
    }),
    [state]
  );

  return { state, ready, error, ...actions };
};
