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

type TileSize = "big" | "wide" | "tall" | "std"

/// Repeating bento pattern. Yields varied tile sizes that flow with
/// CSS grid `auto-flow: dense`, producing a mosaic without per-image
/// manual tagging. Cycle length picked so it doesn't visibly repeat.
function tileSize(i: number): TileSize {
  const m = i % 11
  if (m === 0) return "big"
  if (m === 3) return "wide"
  if (m === 7) return "tall"
  return "std"
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
      {/* CHIPS */}
      {categories.length > 0 && (
        <div className="-mx-5 mb-6 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 pb-1 sm:flex-wrap sm:w-auto">
            <Chip
              active={!activeCategory}
              onClick={() => setActiveCategory("")}
              label={allLabel}
              count={images.length}
            />
            {categories.map((cat) => (
              <Chip
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

      {/* ACTIVE CATEGORY BANNER */}
      {activeMeta && (
        <div
          className="mb-7 flex items-baseline justify-between gap-4"
          style={{ borderLeft: "2px solid #D8B978", paddingLeft: 16 }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: 22,
                lineHeight: 1.2,
                color: "#F7EEDE",
                margin: 0,
              }}
            >
              {activeMeta.label}
            </p>
            {activeMeta.subtitle && (
              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 13,
                  color: "rgba(247,238,222,.6)",
                  marginTop: 4,
                }}
              >
                {activeMeta.subtitle}
              </p>
            )}
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              color: "rgba(247,238,222,.55)",
              flexShrink: 0,
            }}
          >
            {activeMeta.count}
          </span>
        </div>
      )}

      {/* MOSAIC */}
      {filtered.length === 0 ? (
        <div
          className="py-20 text-center"
          style={{ color: "rgba(247,238,222,.5)" }}
        >
          {t("noResults")}
        </div>
      ) : (
        <div className="gallery-mosaic">
          {filtered.map((image, index) => (
            <GalleryTile
              key={image.id}
              image={image}
              size={tileSize(index)}
              priority={index < 4}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
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

      <style jsx global>{`
        .gallery-mosaic {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 180px;
          grid-auto-flow: dense;
          gap: 10px;
        }
        @media (min-width: 768px) {
          .gallery-mosaic {
            grid-auto-rows: 220px;
            gap: 12px;
          }
        }
        @media (min-width: 1280px) {
          .gallery-mosaic {
            grid-auto-rows: 260px;
            gap: 14px;
          }
        }
        .gtile {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(216, 185, 120, 0.1);
          cursor: pointer;
          transition: border-color 0.4s ease, transform 0.4s ease;
        }
        .gtile:hover {
          border-color: rgba(216, 185, 120, 0.45);
          transform: translateY(-2px);
        }
        .gtile.std {
          grid-column: span 1;
          grid-row: span 1;
        }
        .gtile.wide {
          grid-column: span 2;
          grid-row: span 1;
        }
        .gtile.tall {
          grid-column: span 1;
          grid-row: span 2;
        }
        .gtile.big {
          grid-column: span 2;
          grid-row: span 2;
        }
        @media (max-width: 767px) {
          .gtile.tall {
            grid-row: span 2;
          }
          .gtile.wide,
          .gtile.big {
            grid-column: span 2;
          }
          .gtile.big {
            grid-row: span 2;
          }
        }
        .gtile-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            rgba(216, 185, 120, 0.04) 0%,
            rgba(216, 185, 120, 0.1) 50%,
            rgba(216, 185, 120, 0.04) 100%
          );
          background-size: 200% 100%;
          animation: gshimmer 1.6s ease-in-out infinite;
        }
        @keyframes gshimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .gtile-img {
          object-fit: cover;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .gtile:hover .gtile-img {
          transform: scale(1.05);
        }
        .gtile-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(7, 9, 15, 0.85) 0%,
            rgba(7, 9, 15, 0.3) 40%,
            transparent 65%
          );
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .gtile:hover .gtile-overlay {
          opacity: 1;
        }
        .gtile-caption {
          position: absolute;
          inset: auto 14px 14px 14px;
          color: rgba(247, 238, 222, 0.94);
          font-family: var(--font-body), sans-serif;
          font-size: 13px;
          line-height: 1.45;
          transform: translateY(8px);
          opacity: 0;
          transition: transform 0.35s ease, opacity 0.35s ease;
          pointer-events: none;
        }
        .gtile:hover .gtile-caption {
          transform: translateY(0);
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

type TileProps = {
  image: GalleryImage
  size: TileSize
  priority: boolean
  onClick: () => void
}

function GalleryTile({ image, size, priority, onClick }: TileProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <button onClick={onClick} className={cn("gtile", size)} aria-label={image.alt}>
      {!loaded && <div className="gtile-skeleton" />}
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={
          size === "big"
            ? "(min-width: 1024px) 50vw, 100vw"
            : size === "wide"
              ? "(min-width: 1024px) 50vw, 100vw"
              : size === "tall"
                ? "(min-width: 1024px) 25vw, 50vw"
                : "(min-width: 1024px) 25vw, 50vw"
        }
        placeholder={image.blurDataURL ? "blur" : "empty"}
        blurDataURL={image.blurDataURL ?? undefined}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className="gtile-img"
        style={{ opacity: loaded ? 1 : 0 }}
      />
      <div className="gtile-overlay" />
      {image.alt && <div className="gtile-caption">{image.alt}</div>}
    </button>
  )
}

type ChipProps = {
  active: boolean
  onClick: () => void
  label: string
  count: number
}

function Chip({ active, onClick, label, count }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 24,
        border: active
          ? "1px solid rgba(216,185,120,.6)"
          : "1px solid rgba(216,185,120,.18)",
        background: active ? "rgba(216,185,120,.14)" : "rgba(255,255,255,.03)",
        color: active ? "#F7EEDE" : "rgba(247,238,222,.7)",
        fontFamily: "var(--font-body), sans-serif",
        fontSize: 13,
        cursor: "pointer",
        whiteSpace: "nowrap",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "all .25s ease",
        flexShrink: 0,
      }}
    >
      <span>{label}</span>
      <span
        style={{
          padding: "1px 7px",
          borderRadius: 12,
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.08em",
          background: active ? "rgba(216,185,120,.28)" : "rgba(247,238,222,.08)",
          color: active ? "#F7EEDE" : "rgba(247,238,222,.55)",
        }}
      >
        {count}
      </span>
    </button>
  )
}
