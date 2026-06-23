"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, Download } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface QrCodeDialogProps {
  exhibitId: string
  exhibitName: string
}

export function QrCodeDialog({ exhibitId, exhibitName }: QrCodeDialogProps) {
  const [qrData, setQrData] = useState<{
    qrCode: string
    url: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open && !qrData) {
      setLoading(true)
      fetch(`/api/exhibits/${exhibitId}/qr`)
        .then((r) => r.json())
        .then((data) => {
          setQrData(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [open, exhibitId, qrData])

  function handleDownload() {
    if (!qrData) return
    const link = document.createElement("a")
    link.href = qrData.qrCode
    link.download = `qr-${exhibitName.toLowerCase().replace(/\s+/g, "-")}.png`
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" title="QR Code" />
        }
      >
        <QrCode className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code: {exhibitName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {loading ? (
            <Skeleton className="h-[300px] w-[300px]" />
          ) : qrData ? (
            <>
              <img
                src={qrData.qrCode}
                alt={`QR code for ${exhibitName}`}
                className="h-[300px] w-[300px]"
              />
              <p className="break-all text-center text-sm text-muted-foreground">
                {qrData.url}
              </p>
              <Button onClick={handleDownload} className="gap-2">
                <Download className="size-4" />
                Download PNG
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground">Failed to generate QR code</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
