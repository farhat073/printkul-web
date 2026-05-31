"use client"

import { useState } from "react"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePlus, Copy, Trash2, Loader2, CheckCircle, X } from "lucide-react"
import { toast } from "sonner"

interface UploadedImage {
  url: string
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")))
    }
  }

  async function handleUpload() {
    if (files.length === 0) return

    setUploading(true)

    try {
      const results: UploadedImage[] = []

      for (const file of files) {
        const result = await uploadToCloudinary(file, "printkul/media")
        results.push(result)
      }

      setUploadedImages((prev) => [...results, ...prev])
      toast.success(`${files.length} image${files.length > 1 ? "s" : ""} uploaded to Cloudinary`)
      setFiles([])
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(image: UploadedImage) {
    if (!confirm("Delete this image from Cloudinary?")) return

    try {
      await deleteFromCloudinary(image.public_id)
      setUploadedImages((prev) => prev.filter((img) => img.public_id !== image.public_id))
      toast.success("Image deleted")
    } catch (error) {
      toast.error("Failed to delete image")
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-brand-slate">Media Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload images to Cloudinary CDN for fast delivery
        </p>
      </div>

      {/* Upload Area */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
              isDragging
                ? "border-brand-accent bg-brand-accent/5 scale-[1.01]"
                : "border-border hover:border-brand-accent/40"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />
            <ImagePlus className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {isDragging ? "Drop images here" : "Click or drag images to upload"}
            </p>
            <p className="text-xs text-muted-foreground/60">
              PNG, JPG, WebP — Max 10MB each — Uploaded to Cloudinary CDN
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg text-sm">
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4 mr-2" />
                      Upload {files.length} Image{files.length > 1 ? "s" : ""}
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setFiles([])}>
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-bold text-brand-slate">
              Uploaded ({uploadedImages.length})
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <Card key={image.public_id} className="overflow-hidden border-border/50 group">
                <div className="aspect-square relative">
                  <img
                    src={image.secure_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => copyUrl(image.secure_url)}
                      className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Copy className="w-4 h-4 text-brand-slate" />
                    </button>
                    <button
                      onClick={() => handleDelete(image)}
                      className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs font-medium truncate text-brand-slate">{image.public_id.split("/").pop()}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {image.width}×{image.height} • {image.format.toUpperCase()} • {formatBytes(image.bytes)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}