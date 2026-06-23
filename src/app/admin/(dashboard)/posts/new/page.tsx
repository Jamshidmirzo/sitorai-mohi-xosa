"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PostForm } from "@/components/admin/post-form"
import { toast } from "sonner"

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: {
    slug: string
    coverImage: string | null
    published: boolean
    translations: {
      locale: string
      title: string
      excerpt: string
      content: string
    }[]
  }) => {
    setLoading(true)
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create post")
      }

      toast.success("Post created successfully")
      router.push("/admin/posts")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create post"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Post</h1>
        <p className="text-muted-foreground">Create a new news article</p>
      </div>
      <PostForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
