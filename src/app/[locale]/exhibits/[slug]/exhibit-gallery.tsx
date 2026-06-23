"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  images: { url: string; alt: string }[]
}

export function ExhibitGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl bg-muted">
        <img
          src={activeImage.url}
          alt={activeImage.alt}
          className="aspect-square w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="h-16 w-16 object-cover sm:h-20 sm:w-20"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
