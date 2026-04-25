"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Edit2, Trash2, Image, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Banner {
  id: string
  title: string
  subtitle?: string
  image_url: string
  cta_text?: string
  cta_url?: string
  position: string
  sort_order: number
  is_active: boolean
  starts_at?: string
  ends_at?: string
}

const positionLabels: Record<string, string> = {
  home_hero: "Home Hero",
  home_mid: "Home Mid",
  category_top: "Category Top",
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    cta_text: "",
    cta_url: "",
    position: "home_hero",
    sort_order: 0,
    is_active: true,
    starts_at: "",
    ends_at: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchBanners()
  }, [])

  async function fetchBanners() {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order")

    if (data) setBanners(data)
    setIsLoading(false)
  }

  function openDialog(banner?: Banner) {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        image_url: banner.image_url,
        cta_text: banner.cta_text || "",
        cta_url: banner.cta_url || "",
        position: banner.position,
        sort_order: banner.sort_order,
        is_active: banner.is_active,
        starts_at: banner.starts_at ? banner.starts_at.split("T")[0] : "",
        ends_at: banner.ends_at ? banner.ends_at.split("T")[0] : "",
      })
    } else {
      setEditingBanner(null)
      setFormData({
        title: "",
        subtitle: "",
        image_url: "",
        cta_text: "",
        cta_url: "",
        position: "home_hero",
        sort_order: banners.length,
        is_active: true,
        starts_at: "",
        ends_at: "",
      })
    }
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const data = {
      ...formData,
      starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
    }

    if (editingBanner) {
      const { error } = await supabase.from("banners").update(data).eq("id", editingBanner.id)
      if (!error) {
        toast.success("Banner updated")
        fetchBanners()
        setIsDialogOpen(false)
      }
    } else {
      const { error } = await supabase.from("banners").insert(data)
      if (!error) {
        toast.success("Banner created")
        fetchBanners()
        setIsDialogOpen(false)
      }
    }
  }

  async function deleteBanner(banner: Banner) {
    if (!confirm(`Delete "${banner.title}"?`)) return

    const { error } = await supabase.from("banners").delete().eq("id", banner.id)
    if (!error) {
      toast.success("Banner deleted")
      fetchBanners()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground">{banners.length} banners</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <div className="aspect-[16/9] bg-muted rounded-t-xl overflow-hidden">
              {banner.image_url ? (
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Image className="w-8 h-8" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{banner.title}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    {positionLabels[banner.position] || banner.position}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openDialog(banner)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteBanner(banner)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {banner.subtitle && (
                <p className="text-sm text-muted-foreground line-clamp-2">{banner.subtitle}</p>
              )}
              {banner.starts_at && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(banner.starts_at).toLocaleDateString()} - {new Date(banner.ends_at!).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No banners yet</p>
            <Button onClick={() => openDialog()} className="mt-4">
              Add your first banner
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingBanner ? "Edit Banner" : "New Banner"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL *</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  placeholder="Shop Now"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA URL</Label>
                <Input
                  value={formData.cta_url}
                  onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                  placeholder="/products"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              >
                <option value="home_hero">Home Hero</option>
                <option value="home_mid">Home Mid</option>
                <option value="category_top">Category Top</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.ends_at}
                  onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <Button type="submit" className="w-full">
              {editingBanner ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}