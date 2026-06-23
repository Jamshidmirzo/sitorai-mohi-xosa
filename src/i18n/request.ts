import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"
import { prisma } from "@/lib/prisma"

type AnyMessages = Record<string, unknown>

/// Apply LandingContent overrides on top of the JSON messages.
/// A row {key:"narrative.hero.subtitle", locale:"ru", value:"…"} sets
/// messages.narrative.hero.subtitle = value.
function applyOverrides(
  messages: AnyMessages,
  overrides: { key: string; value: string }[],
): AnyMessages {
  for (const { key, value } of overrides) {
    const path = key.split(".")
    let node = messages as Record<string, unknown>
    for (let i = 0; i < path.length - 1; i++) {
      const seg = path[i]
      const next = node[seg]
      if (typeof next !== "object" || next === null) return messages // skip mismatched path
      node = next as Record<string, unknown>
    }
    node[path[path.length - 1]] = value
  }
  return messages
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  const baseMessages: AnyMessages = (
    await import(`../messages/${locale}.json`)
  ).default

  // Best-effort overrides; if the table doesn't exist (e.g. fresh deploy before
  // db push) just fall back to JSON silently.
  let overrides: { key: string; value: string }[] = []
  try {
    overrides = await prisma.landingContent.findMany({
      where: { locale },
      select: { key: true, value: true },
    })
  } catch {
    overrides = []
  }

  return {
    locale,
    messages: applyOverrides(baseMessages, overrides),
  }
})
