"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { PostForm } from "@/components/admin/post-form"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface PostData {
  id: string
  slug: string
  coverImage: string | null
  published: boolean
  translations: {
    locale: string
    title: string
    excerpt: string
    content: string
  }[]
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch post")
        }
        const data = await res.json()
        setPost(data)
      } catch {
        toast.error("Failed to load post")
        router.push("/admin/posts")
      } finally {
        setFetching(false)
      }
    }

    fetchPost()
  }, [id, router])

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
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to update post")
      }

      toast.success("Post updated successfully")
      router.push("/admin/posts")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update post"
      )
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground">Update the news article</p>
      </div>
      <PostForm
        initialData={post}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}
