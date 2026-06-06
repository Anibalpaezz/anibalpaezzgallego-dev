import { translations } from "./translations";

type Lang = "es" | "en" | "fr" | "de" | "zh";

export function t(lang: Lang, path: string): string {
  const keys = path.split(".");
  let value: any = translations[lang] || translations.es;
  for (const k of keys) {
    if (!value) break;
    value = value[k];
  }
  return typeof value === "string" ? value : path;
}

const SUPPORTED: Lang[] = ["es", "en", "fr", "de", "zh"];

export function isLang(s: string | undefined): s is Lang {
  return SUPPORTED.includes(s as Lang);
}

const LANG_NAMES: Record<Lang, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
};

export function langName(l: Lang): string {
  return LANG_NAMES[l];
}

export function allLangs(): Lang[] {
  return SUPPORTED;
}
