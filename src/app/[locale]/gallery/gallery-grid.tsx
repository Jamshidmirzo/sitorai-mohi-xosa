"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { getCategorySubtitle } from "@/lib/gallery-categories"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type GalleryImage = {
  id: string
  url: string
  alt: string
  category: string
  width: number
  height: number
  blurDataURL: string | null
}

type Category = {
  slug: string
  label: string
  count: number
}

type Props = {
  images: GalleryImage[]
  categories: Category[]
  allLabel: string
  locale: string
}

export function GalleryGrid({ images, categories, allLabel, locale }: Props) {
  const t = useTranslations("common")
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") ?? ""
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!activeCategory) return images
    return images.filter((img) => img.category === activeCategory)
  }, [images, activeCategory])

  const activeMeta = useMemo(() => {
    if (!activeCategory) return null
    const cat = categories.find((c) => c.slug === activeCategory)
    if (!cat) return null
    return {
      label: cat.label,
      subtitle: getCategorySubtitle(activeCategory, locale),
      count: cat.count,
    }
  }, [activeCategory, categories, locale])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setLightboxIndex(null)
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev < filtered.length - 1 ? prev + 1 : prev
    )
  }, [filtered.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : prev
    )
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      else if (e.key === "ArrowLeft") goPrev()
      else if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lightboxOpen, goNext, goPrev, closeLightbox])

  const currentImage = lightboxIndex !== null ? filtered[lightboxIndex] : null

  return (
    <div>
      {categories.length > 0 && (
        <div className="-mx-4 mb-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-1.5 pb-1 sm:flex-wrap sm:w-auto">
            <CategoryChip
              active={!activeCategory}
              onClick={() => setActiveCategory("")}
              label={allLabel}
              count={images.length}
            />
            {categories.map((cat) => (
              <CategoryChip
                key={cat.slug}
                active={activeCategory === cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                label={cat.label}
                count={cat.count}
              />
            ))}
          </div>
        </div>
      )}

      {activeMeta && (
        <div className="mb-6 flex items-baseline justify-between gap-4 border-l-2 border-primary/60 pl-4">
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {activeMeta.label}
            </p>
            {activeMeta.subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {activeMeta.subtitle}
              </p>
            )}
          </div>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {activeMeta.count}
          </span>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          {t("noResults")}
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {filtered.map((image, index) => (
            <GalleryTile
              key={image.id}
              image={image}
              priority={index < 4}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[95vw] border-0 bg-black/95 p-0 ring-0 sm:max-w-[95vw]"
        >
          {currentImage && (
            <div className="relative flex min-h-[50vh] items-center justify-center p-2">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="max-h-[85vh] max-w-full rounded object-contain"
              />

              <button
                onClick={closeLightbox}
                className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
              >
                <X className="h-5 w-5" />
              </button>

              {lightboxIndex !== null && lightboxIndex > 0 && (
                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white transition-colors hover:bg-black/80"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              {lightboxIndex !== null &&
                lightboxIndex < filtered.length - 1 && (
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white transition-colors hover:bg-black/80"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}

              {currentImage.alt && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-center text-sm text-white">
                    {currentImage.alt}
                  </p>
                </div>
              )}

              <div className="absolute bottom-4 right-4 text-xs text-white/60">
                {(lightboxIndex ?? 0) + 1} / {filtered.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

type TileProps = {
  image: GalleryImage
  priority: boolean
  onClick: () => void
}

function GalleryTile({ image, priority, onClick }: TileProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="mb-3 break-inside-avoid sm:mb-4">
      <button
        onClick={onClick}
        className="group relative block w-full overflow-hidden rounded-xl bg-muted/40 ring-1 ring-black/5 transition-shadow duration-300 hover:ring-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:ring-white/5"
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/50" />
        )}
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL ?? undefined}
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-[opacity,transform] duration-500 ease-out",
            "group-hover:scale-[1.04]",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 transition-colors duration-300 group-hover:from-black/60 group-hover:via-black/20" />
        {image.alt && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full px-3 pb-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
            <p className="text-left text-xs leading-snug text-white sm:text-sm">
              {image.alt}
            </p>
          </div>
        )}
      </button>
    </div>
  )
}

type ChipProps = {
  active: boolean
  onClick: () => void
  label: string
  count: number
}

function CategoryChip({ active, onClick, label, count }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0 text-[11px] font-semibold tabular-nums",
          active
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-muted text-muted-foreground/80"
        )}
      >
        {count}
      </span>
    </button>
  )
}
