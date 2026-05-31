// Cloudinary upload utilities for Printkul admin
// Uses unsigned upload preset for client-side uploads via API route

export interface CloudinaryUploadResult {
  url: string
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Upload a file to Cloudinary via our API route (signed, server-side)
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "printkul"
): Promise<CloudinaryUploadResult> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)

  const res = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Upload failed")
  }

  return res.json()
}

/**
 * Delete an image from Cloudinary via our API route
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const res = await fetch("/api/cloudinary/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: publicId }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Delete failed")
  }
}

/**
 * Generate an optimized Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
    crop?: string
  } = {}
): string {
  if (!url || !url.includes("cloudinary.com")) return url

  const { width, height, quality = 80, format = "auto", crop = "fill" } = options
  const transforms: string[] = [`f_${format}`, `q_${quality}`]

  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if (width || height) transforms.push(`c_${crop}`)

  // Insert transforms into Cloudinary URL
  return url.replace("/upload/", `/upload/${transforms.join(",")}/`)
}
