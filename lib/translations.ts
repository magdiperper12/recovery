import { useCallback } from "react";
import messages from "@/locales/ar/common.json";

type TranslateValues = Record<string, string | number>;

const getValueByPath = (path: string): unknown => {
  return path.split(".").reduce<unknown>((current, key) => {
    if (typeof current !== "object" || current === null || !(key in current)) {
      return undefined;
    }
    return (current as Record<string, unknown>)[key];
  }, messages as unknown);
};

export const translate = (key: string, values?: TranslateValues): string => {
  const value = getValueByPath(key);
  if (typeof value !== "string") return key;
  if (!values) return value;

  return Object.entries(values).reduce(
    (text, [name, replacement]) => text.replaceAll(`{${name}}`, String(replacement)),
    value
  );
};

export const useArabicTranslations = () => {
  return useCallback((key: string, values?: TranslateValues) => translate(key, values), []);
};
