"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const t = useTranslations("common")

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-base font-bold">S</span>
              </div>
              <span className="text-base font-semibold">Sitorai Mohi Xosa</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Palace of Moon-like Stars. A magnificent summer residence of the last Emir of Bukhara.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("exhibits")}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link href="/exhibits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("exhibits")}
              </Link>
              <Link href="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("gallery")}
              </Link>
              <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("news")}
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("about")}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("about")}
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("contact")}
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("contact")}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>Bukhara, Uzbekistan</p>
              <p>info@sitoraimohixosa.uz</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Sitorai Mohi Xosa Museum. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
