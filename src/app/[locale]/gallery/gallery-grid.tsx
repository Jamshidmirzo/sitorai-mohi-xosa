"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type GalleryImage = {
  id: string
  url: string
  alt: string
  category: string
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
}

export function GalleryGrid({ images, categories, allLabel }: Props) {
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
        <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
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

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          {t("noResults")}
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {filtered.map((image, index) => (
            <div key={image.id} className="mb-3 break-inside-avoid sm:mb-4">
              <button
                onClick={() => openLightbox(index)}
                className="group relative block w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={1000}
                  height={1333}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="h-auto w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-xl bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
                {image.alt && (
                  <div className="absolute inset-x-0 bottom-0 translate-y-full rounded-b-xl bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
                    <p className="text-sm text-white">{image.alt}</p>
                  </div>
                )}
              </button>
            </div>
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
