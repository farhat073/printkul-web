"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ImagePlus, Copy, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminMediaPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const supabase = createClient()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  async function handleUpload() {
    if (files.length === 0) return

    setUploading(true)
    setUploadedUrls([])

    try {
      const urls: string[] = []

      for (const file of files) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (error) throw error

        const { data } = supabase.storage.from("product-images").getPublicUrl(fileName)
        urls.push(data.publicUrl)
      }

      setUploadedUrls(urls)
      toast.success(`${files.length} file(s) uploaded successfully`)
      setFiles([])
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload files")
    } finally {
      setUploading(false)
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold">Media Library</h1>
        <p className="text-muted-foreground">Upload images to Supabase Storage</p>
      </div>

      {/* Upload Area */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-heading">Upload Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-amber/50 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <ImagePlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Click to select or drag and drop images here
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP up to 10MB each
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{files.length} file(s) selected</p>
              <div className="flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <div key={i} className="px-3 py-2 bg-muted rounded-lg text-sm">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Upload {files.length} File(s)
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Uploaded Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <img src={url} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{url.split("/").pop()}</p>
                    <p className="text-xs text-muted-foreground truncate">{url}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => copyUrl(url)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}