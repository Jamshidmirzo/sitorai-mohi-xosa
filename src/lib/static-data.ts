import type { Exhibit, QuizQuestion } from "@/lib/narrative-types"
export type { Exhibit, QuizQuestion } from "@/lib/narrative-types"
export { QUIZ_TOTAL_SECONDS } from "@/lib/narrative-types"

import rawExhibits from "@/../content/exhibits.json"
import rawCategories from "@/../content/categories.json"
import rawHalls from "@/../content/halls.json"
import rawGallery from "@/../content/gallery.json"
import rawPosts from "@/../content/posts.json"
import rawVisitorInfo from "@/../content/visitor-info.json"
import rawSiteSettings from "@/../content/site-settings.json"
import rawQuizQuestions from "@/../content/quiz-questions.json"

const FALLBACK_LOCALE = "en"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickTranslation(list: any[], locale: string): any {
  return (
    list.find((t) => t.locale === locale) ??
    list.find((t) => t.locale === FALLBACK_LOCALE) ??
    list[0]
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickFilledTranslation(list: any[], locale: string, pickField: (row: any) => string | null | undefined): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isFilled = (row: any) => (pickField(row) ?? "").trim().length > 0
  return (
    list.find((t) => t.locale === locale && isFilled(t)) ??
    list.find((t) => t.locale === FALLBACK_LOCALE && isFilled(t)) ??
    list.find(isFilled) ??
    pickTranslation(list, locale)
  )
}

// ── Exhibits (narrative/landing) ──────────────────────────────────────────

export function fetchExhibits(locale: string): Exhibit[] {
  return (rawExhibits as any[]).map((row) => {
    const tr = pickFilledTranslation(row.translations, locale, (t: any) => t.name)
    const hallTr = row.hall
      ? pickFilledTranslation(row.hall.translations, locale, (t: any) => t.name)
      : undefined
    return {
      id: row.id,
      slug: row.slug,
      tag: tr?.tag ?? "",
      name: tr?.name ?? row.slug,
      period: row.period ?? "",
      material: row.material ?? "",
      hall: hallTr?.name ?? "",
      bg: row.bg ?? "linear-gradient(155deg,#3a3322,#241f14 70%,#15120b)",
      shot: row.shot ?? "",
      story: tr?.story ?? tr?.description ?? "",
      image: row.images?.[0]?.url ?? null,
    }
  })
}

export function fetchQuizByExhibit(locale: string): Record<string, QuizQuestion[]> {
  const map: Record<string, QuizQuestion[]> = {}
  for (const row of rawQuizQuestions as any[]) {
    const tr = pickFilledTranslation(row.translations, locale, (t: any) => t.q)
    if (!tr || !tr.q.trim()) continue
    const list = (map[row.exhibitId] ??= [])
    if (row.type === "choice") {
      list.push({
        id: row.id,
        type: "choice",
        q: tr.q,
        options: tr.options,
        answer: row.correctIndex ?? 0,
        explain: tr.explain,
      })
    } else {
      list.push({
        id: row.id,
        type: "text",
        q: tr.q,
        accept: row.accept,
        answer: tr.answerText ?? "",
        explain: tr.explain,
      })
    }
  }
  return map
}

// ── Exhibits list / detail ────────────────────────────────────────────────

export function getExhibitsForLocale(locale: string) {
  return (rawExhibits as any[]).map((e) => {
    const tr = pickTranslation(e.translations, locale)
    const catTr = e.category ? pickTranslation(e.category.translations, locale) : null
    const hallTr = e.hall ? pickTranslation(e.hall.translations, locale) : null
    return {
      id: e.id,
      slug: e.slug,
      period: e.period,
      material: e.material,
      featured: e.featured,
      categoryId: e.categoryId,
      hallId: e.hallId,
      name: tr?.name ?? "",
      description: tr?.description ?? "",
      imageUrl: e.images?.[0]?.url ?? null,
      imageAlt: e.images?.[0]?.alt ?? null,
      categoryName: catTr?.name ?? null,
      hallName: hallTr?.name ?? null,
    }
  })
}

export function getExhibitBySlug(slug: string, locale: string) {
  const exhibit = (rawExhibits as any[]).find((e) => e.slug === slug)
  if (!exhibit) return null
  const tr = pickTranslation(exhibit.translations, locale)
  const catTr = exhibit.category ? pickTranslation(exhibit.category.translations, locale) : null
  const hallTr = exhibit.hall ? pickTranslation(exhibit.hall.translations, locale) : null
  return {
    ...exhibit,
    name: tr?.name ?? slug,
    description: tr?.description ?? "",
    story: tr?.story ?? "",
    categoryName: catTr?.name ?? null,
    hallName: hallTr?.name ?? null,
    images: (exhibit.images ?? []).map((img: any) => ({ url: img.url, alt: img.alt ?? tr?.name ?? slug })),
  }
}

export function getAllExhibitSlugs(): string[] {
  return (rawExhibits as any[]).map((e) => e.slug)
}

// ── Categories & Halls ────────────────────────────────────────────────────

export function getCategoriesForLocale(locale: string) {
  return (rawCategories as any[]).map((c) => {
    const tr = pickTranslation(c.translations, locale)
    return { id: c.id, name: tr?.name ?? c.slug }
  })
}

export function getHallsForLocale(locale: string) {
  return (rawHalls as any[]).map((h) => {
    const tr = pickTranslation(h.translations, locale)
    return { id: h.id, name: tr?.name ?? h.slug }
  })
}

// ── Gallery ───────────────────────────────────────────────────────────────

export function getGalleryImages() {
  return rawGallery as any[]
}

// ── Posts ─────────────────────────────────────────────────────────────────

export function getPostsForLocale(locale: string) {
  return (rawPosts as any[]).map((post) => {
    const tr = pickTranslation(post.translations, locale)
    return {
      id: post.id,
      slug: post.slug,
      coverImage: post.coverImage,
      createdAt: post.createdAt,
      title: tr?.title ?? post.slug,
      excerpt: tr?.excerpt ?? "",
    }
  })
}

export function getPostBySlug(slug: string, locale: string) {
  const post = (rawPosts as any[]).find((p) => p.slug === slug)
  if (!post) return null
  const tr = pickTranslation(post.translations, locale)
  return {
    ...post,
    title: tr?.title ?? slug,
    content: tr?.content ?? "",
    excerpt: tr?.excerpt ?? "",
  }
}

export function getAllPostSlugs(): string[] {
  return (rawPosts as any[]).map((p) => p.slug)
}

// ── Visitor info & Settings ───────────────────────────────────────────────

export function getVisitorInfo(locale: string) {
  const info = (rawVisitorInfo as any[]).find((v) => v.locale === locale)
  return info ?? null
}

export function getSiteSettings(locale: string) {
  const settings = (rawSiteSettings as any[]).find((s) => s.locale === locale)
  return settings ?? null
}
