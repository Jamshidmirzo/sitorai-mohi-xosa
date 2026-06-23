"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { ImageIcon, PencilIcon, TrashIcon, UploadIcon, ImagePlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface GalleryImage {
  id: string
  url: string
  alt: string | null
  category: string | null
  order: number
  createdAt: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadAlt, setUploadAlt] = useState("")
  const [uploadCategory, setUploadCategory] = useState("")
  const [uploading, setUploading] = useState(false)

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false)
  const [editImage, setEditImage] = useState<GalleryImage | null>(null)
  const [editAlt, setEditAlt] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editOrder, setEditOrder] = useState(0)
  const [saving, setSaving] = useState(false)

  // Delete state
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery")
      if (!res.ok) throw new Error("Failed to fetch images")
      const data = await res.json()
      setImages(data)
    } catch {
      toast.error("Failed to load gallery images")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file")
      return
    }

    setUploading(true)

    try {
      // Upload the file
      const formData = new FormData()
      formData.append("file", uploadFile)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) throw new Error("File upload failed")

      const { url } = await uploadRes.json()

      // Create gallery image record
      const createRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          alt: uploadAlt || undefined,
          category: uploadCategory || undefined,
        }),
      })

      if (!createRes.ok) throw new Error("Failed to save image")

      toast.success("Image uploaded successfully")
      setUploadOpen(false)
      resetUploadForm()
      fetchImages()
    } catch {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const resetUploadForm = () => {
    setUploadFile(null)
    setUploadAlt("")
    setUploadCategory("")
  }

  const openEdit = (image: GalleryImage) => {
    setEditImage(image)
    setEditAlt(image.alt || "")
    setEditCategory(image.category || "")
    setEditOrder(image.order)
    setEditOpen(true)
  }

  const handleEdit = async () => {
    if (!editImage) return

    setSaving(true)

    try {
      const res = await fetch(`/api/gallery/${editImage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alt: editAlt,
          category: editCategory,
          order: editOrder,
        }),
      })

      if (!res.ok) throw new Error("Failed to update image")

      toast.success("Image updated successfully")
      setEditOpen(false)
      setEditImage(null)
      fetchImages()
    } catch {
      toast.error("Failed to update image")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete image")

      toast.success("Image deleted successfully")
      fetchImages()
    } catch {
      toast.error("Failed to delete image")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">Manage photo gallery</p>
        </div>

        <Dialog open={uploadOpen} onOpenChange={(open) => setUploadOpen(open)}>
          <DialogTrigger render={<Button />}>
            <UploadIcon data-icon="inline-start" />
            Upload Image
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>
                Select an image file and add optional details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upload-file">Image File</Label>
                <Input
                  id="upload-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setUploadFile(e.target.files?.[0] || null)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload-alt">Alt Text</Label>
                <Input
                  id="upload-alt"
                  placeholder="Describe the image..."
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload-category">Category</Label>
                <Input
                  id="upload-category"
                  placeholder="e.g. Exhibits, Events, Building..."
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleUpload}
                disabled={uploading || !uploadFile}
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <ImageIcon className="size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No images yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your first image to get started.
          </p>
          <Button
            className="mt-4"
            onClick={() => setUploadOpen(true)}
          >
            <ImagePlusIcon data-icon="inline-start" />
            Upload Image
          </Button>
        </div>
      )}

      {/* Image Grid */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border bg-card"
            >
              {/* Image Preview */}
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={image.url}
                  alt={image.alt || "Gallery image"}
                  className="size-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              {/* Card Info */}
              <div className="p-3 space-y-2">
                <p className="text-sm font-medium truncate">
                  {image.alt || "Untitled"}
                </p>
                <div className="flex items-center justify-between">
                  {image.category ? (
                    <Badge variant="secondary">{image.category}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No category
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEdit(image)}
                    >
                      <PencilIcon />
                      <span className="sr-only">Edit</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            disabled={deleting === image.id}
                          />
                        }
                      >
                        <TrashIcon />
                        <span className="sr-only">Delete</span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this image? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleDelete(image.id)}
                          >
                            {deleting === image.id
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(open: boolean) => {
          setEditOpen(open)
          if (!open) setEditImage(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Update image details and ordering.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-alt">Alt Text</Label>
              <Input
                id="edit-alt"
                placeholder="Describe the image..."
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                placeholder="e.g. Exhibits, Events, Building..."
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-order">Order</Label>
              <Input
                id="edit-order"
                type="number"
                value={editOrder}
                onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleEdit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
