"use client"

import { useState, useCallback } from "react"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import { ImagePlus, X, Loader2, GripVertical } from "lucide-react"
import { toast } from "sonner"

interface ImageUploaderProps {
  value: string | string[]
  onChange: (value: string | string[]) => void
  folder?: string
  multiple?: boolean
  maxFiles?: number
  label?: string
}

interface UploadingFile {
  id: string
  name: string
  progress: number
}

export function ImageUploader({
  value,
  onChange,
  folder = "printkul/products",
  multiple = false,
  maxFiles = 10,
  label = "Upload Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const images = multiple
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (typeof value === "string" && value ? [value] : [])

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"))

      if (fileArray.length === 0) return

      if (!multiple && fileArray.length > 1) {
        toast.error("Only one image allowed")
        return
      }

      if (multiple && images.length + fileArray.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`)
        return
      }

      const uploadPromises = fileArray.map(async (file) => {
        const id = crypto.randomUUID()
        setUploading((prev) => [...prev, { id, name: file.name, progress: 0 }])

        try {
          const result = await uploadToCloudinary(file, folder)
          setUploading((prev) => prev.filter((u) => u.id !== id))
          return result.secure_url
        } catch (error) {
          setUploading((prev) => prev.filter((u) => u.id !== id))
          toast.error(`Failed to upload ${file.name}`)
          return null
        }
      })

      setUploading((prev) => prev)
      const urls = (await Promise.all(uploadPromises)).filter(Boolean) as string[]

      if (urls.length > 0) {
        if (multiple) {
          onChange([...images, ...urls])
        } else {
          onChange(urls[0])
        }
        toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`)
      }
    },
    [images, multiple, maxFiles, folder, onChange]
  )

  const removeImage = useCallback(
    (index: number) => {
      if (multiple) {
        const newImages = images.filter((_, i) => i !== index)
        onChange(newImages)
      } else {
        onChange("")
      }
    },
    [images, multiple, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className={`grid gap-3 ${multiple ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 max-w-xs"}`}>
          {images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative group rounded-xl overflow-hidden border border-border bg-muted aspect-square"
            >
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              {multiple && (
                <div className="absolute top-2 left-2 w-6 h-6 bg-black/40 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {(multiple || images.length === 0) && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer hover:border-brand-accent/50 hover:bg-brand-accent/5 ${
            isDragging
              ? "border-brand-accent bg-brand-accent/10 scale-[1.02]"
              : "border-border"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <ImagePlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground font-medium">
            {isDragging ? "Drop images here" : "Click or drag images to upload"}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            PNG, JPG, WebP • Max 10MB
          </p>
        </div>
      )}

      {/* Uploading Progress */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <Loader2 className="w-4 h-4 animate-spin text-brand-accent flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate flex-1">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground">Uploading...</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
