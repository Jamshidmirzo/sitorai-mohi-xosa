"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ADMIN_DICT,
  ADMIN_LOCALES,
  ADMIN_LOCALE_LABELS,
  type AdminLocale,
} from "@/lib/admin-i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check } from "lucide-react";

const STORAGE_KEY = "smx-admin-locale";
const DEFAULT_LOCALE: AdminLocale = "ru";

type Ctx = {
  locale: AdminLocale;
  setLocale: (loc: AdminLocale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const AdminLocaleCtx = createContext<Ctx | null>(null);

export function useAdminT() {
  const ctx = useContext(AdminLocaleCtx);
  if (!ctx)
    throw new Error("useAdminT must be used inside <AdminLocaleProvider>");
  return ctx;
}

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = (typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY)
      : null) as AdminLocale | null;
    if (stored && ADMIN_LOCALES.includes(stored)) {
      setLocaleState(stored);
    }
    setHydrated(true);
  }, []);

  const setLocale = useCallback((loc: AdminLocale) => {
    setLocaleState(loc);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, loc);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = ADMIN_DICT[locale];
      let str = dict[key] ?? ADMIN_DICT.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    },
    [locale],
  );

  const value = useMemo<Ctx>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  // Render with suppressHydrationWarning-safe initial render
  return (
    <AdminLocaleCtx.Provider value={value}>
      <div suppressHydrationWarning data-admin-locale={hydrated ? locale : DEFAULT_LOCALE}>
        {children}
      </div>
    </AdminLocaleCtx.Provider>
  );
}

export function AdminLanguageSwitcher() {
  const { locale, setLocale, t } = useAdminT();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            aria-label={t("shell.language")}
          />
        }
      >
        <Languages className="size-4" />
        <span className="hidden sm:inline-block uppercase font-mono text-xs tracking-wider">
          {locale}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {ADMIN_LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className="flex items-center justify-between"
          >
            <span>{ADMIN_LOCALE_LABELS[loc]}</span>
            {loc === locale && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
