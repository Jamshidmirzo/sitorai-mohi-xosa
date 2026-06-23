import { LandingEditorClient } from "./client"
import enMessages from "@/messages/en.json"
import ruMessages from "@/messages/ru.json"
import uzMessages from "@/messages/uz.json"

export const dynamic = "force-dynamic"

type AnyObj = Record<string, unknown>

function flatten(obj: AnyObj, prefix = "", out: Record<string, string> = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flatten(v as AnyObj, key, out)
    } else if (typeof v === "string") {
      out[key] = v
    }
  }
  return out
}

export default async function LandingPage() {
  const en = flatten(enMessages as AnyObj)
  const ru = flatten(ruMessages as AnyObj)
  const uz = flatten(uzMessages as AnyObj)
  // Only show narrative-namespace strings — these are the public-landing texts.
  const filter = (s: Record<string, string>) =>
    Object.fromEntries(
      Object.entries(s).filter(([k]) => k.startsWith("narrative.")),
    )
  return (
    <LandingEditorClient
      defaults={{ en: filter(en), ru: filter(ru), uz: filter(uz) }}
    />
  )
}
