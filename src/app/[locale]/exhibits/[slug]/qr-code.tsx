"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

export function QrCode({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 2, width: 200 }).then(setDataUrl)
  }, [url])

  if (!dataUrl) return null

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-4">
      <p className="text-sm font-medium">Share this exhibit</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="QR Code" className="h-32 w-32" />
    </div>
  )
}
