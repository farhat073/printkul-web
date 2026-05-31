import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  return profile?.role === "admin"
}

export async function POST(req: NextRequest) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json(
      { error: "Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local" },
      { status: 500 }
    )
  }

  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "printkul"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    // Generate signature
    const timestamp = Math.round(Date.now() / 1000)
    const crypto = await import("crypto")
    const signature = crypto
      .createHash("sha256")
      .update(`folder=${folder}&timestamp=${timestamp}${API_SECRET}`)
      .digest("hex")

    // Upload to Cloudinary
    const uploadForm = new FormData()
    uploadForm.append("file", dataUri)
    uploadForm.append("folder", folder)
    uploadForm.append("timestamp", timestamp.toString())
    uploadForm.append("api_key", API_KEY)
    uploadForm.append("signature", signature)

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadForm }
    )

    if (!cloudinaryRes.ok) {
      const err = await cloudinaryRes.json()
      return NextResponse.json({ error: err.error?.message || "Cloudinary upload failed" }, { status: 500 })
    }

    const result = await cloudinaryRes.json()

    return NextResponse.json({
      url: result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
  }

  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { public_id } = await req.json()

    if (!public_id) {
      return NextResponse.json({ error: "No public_id provided" }, { status: 400 })
    }

    const timestamp = Math.round(Date.now() / 1000)
    const crypto = await import("crypto")
    const signature = crypto
      .createHash("sha256")
      .update(`public_id=${public_id}&timestamp=${timestamp}${API_SECRET}`)
      .digest("hex")

    const form = new URLSearchParams()
    form.append("public_id", public_id)
    form.append("timestamp", timestamp.toString())
    form.append("api_key", API_KEY)
    form.append("signature", signature)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      { method: "POST", body: form }
    )

    const result = await res.json()

    if (result.result !== "ok") {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
