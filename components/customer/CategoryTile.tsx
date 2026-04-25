import Link from "next/link"

interface CategoryTileProps {
  category: {
    slug: string
    name: string
    description?: string
    banner_url?: string
    icon_url?: string
  }
}

export function CategoryTile({ category }: CategoryTileProps) {
  return (
    <Link
      href={`/${category.slug}`}
      className="group block bg-white rounded-xl border border-[#e9ecef] overflow-hidden card-hover"
    >
      <div className="aspect-[4/3] relative bg-[#f1f3f5] overflow-hidden">
        {category.banner_url ? (
          <img
            src={category.banner_url}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center">
            {category.icon_url ? (
              <img src={category.icon_url} alt="" className="w-16 h-16 opacity-40" />
            ) : (
              <div className="w-16 h-16 bg-amber/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-amber/40">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-[#0f1b2d] text-sm group-hover:text-amber transition-colors line-clamp-1">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-[#adb5bd] mt-0.5 line-clamp-1">{category.description}</p>
        )}
      </div>
    </Link>
  )
}