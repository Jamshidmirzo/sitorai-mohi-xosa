"use client"

import { useEffect, useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ADMIN_DICT,
  ADMIN_LOCALES,
  ADMIN_LOCALE_LABELS,
  type AdminLocale,
} from "@/lib/admin-i18n"
import { Loader2 } from "lucide-react"

const STORAGE_KEY = "smx-admin-locale"
const DEFAULT_LOCALE: AdminLocale = "ru"

function useStandaloneLocale() {
  const [locale, setLocaleState] = useState<AdminLocale>(DEFAULT_LOCALE)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AdminLocale | null
    if (stored && ADMIN_LOCALES.includes(stored)) setLocaleState(stored)
  }, [])
  const setLocale = (loc: AdminLocale) => {
    setLocaleState(loc)
    localStorage.setItem(STORAGE_KEY, loc)
  }
  const t = (key: string) => ADMIN_DICT[locale][key] ?? ADMIN_DICT.en[key] ?? key
  return { locale, setLocale, t }
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { locale, setLocale, t } = useStandaloneLocale()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(t("login.invalid"))
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError(t("login.error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4 flex gap-1 text-xs">
        {ADMIN_LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            className={`px-2 py-1 rounded font-mono uppercase tracking-wider transition-colors ${
              loc === locale
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
            aria-label={ADMIN_LOCALE_LABELS[loc]}
          >
            {loc}
          </button>
        ))}
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t("login.title")}</CardTitle>
          <CardDescription>{t("login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@xosa.uz"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t("login.passwordPlaceholder")}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              {loading ? t("login.submitLoading") : t("login.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
