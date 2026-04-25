"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ContentItem {
  key: string
  value: string
  value_type: string
  label: string
  section: string
}

const sections: Record<string, { label: string; keys: string[] }> = {
  home: {
    label: "Home",
    keys: ["home_hero_title", "home_hero_subtitle", "home_featured_heading"],
  },
  contact: {
    label: "Contact & WhatsApp",
    keys: ["whatsapp_number", "contact_phone", "contact_email", "contact_address"],
  },
  footer: {
    label: "Footer",
    keys: ["footer_tagline", "footer_about_blurb"],
  },
  about: {
    label: "About",
    keys: ["about_hero_title", "about_body"],
  },
  delivery: {
    label: "Delivery",
    keys: ["delivery_info", "gst_note"],
  },
}

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from("site_content")
        .select("key, value")

      if (data) {
        const contentMap: Record<string, string> = {}
        data.forEach((item: any) => {
          contentMap[item.key] = item.value
        })
        setContent(contentMap)
      }
      setIsLoading(false)
    }

    fetchContent()
  }, [])

  async function handleSave() {
    setIsSaving(true)

    try {
      const updates = Object.entries(content).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }))

      for (const update of updates) {
        await supabase
          .from("site_content")
          .upsert({ key: update.key, value: update.value, updated_at: update.updated_at }, { onConflict: "key" })
      }

      toast.success("Content saved successfully")
    } catch (error) {
      toast.error("Failed to save content")
    } finally {
      setIsSaving(false)
    }
  }

  function handleChange(key: string, value: string) {
    setContent({ ...content, [key]: value })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Site Content</h1>
          <p className="text-muted-foreground">Edit all site copy and settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save All Changes"
          )}
        </Button>
      </div>

      {Object.entries(sections).map(([sectionKey, section]) => (
        <Card key={sectionKey} className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading">{section.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.keys.map((key) => {
              const isLongContent = key.includes("body") || key.includes("desc")
              return (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  {isLongContent ? (
                    <textarea
                      value={content[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background resize-none"
                      placeholder={`Enter ${key.replace(/_/g, " ")}...`}
                    />
                  ) : (
                    <Input
                      value={content[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={`Enter ${key.replace(/_/g, " ")}...`}
                    />
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}