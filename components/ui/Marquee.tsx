import { cn } from "@/lib/utils"

interface MarqueeItem {
  text: string
  logo?: string
}

interface MarqueeProps {
  items: string[] | MarqueeItem[]
  className?: string
  speed?: "normal" | "slow"
  pauseOnHover?: boolean
  variant?: "text" | "pill" | "announcement" | "logo"
}

export function Marquee({ 
  items, 
  className, 
  speed = "normal", 
  pauseOnHover = true,
  variant = "pill"
}: MarqueeProps) {
  const normalizedItems: MarqueeItem[] = items.map((item) =>
    typeof item === "string" ? { text: item } : item
  )

  const gap = variant === "logo" ? "1.25rem" : "1rem"

  function renderItem(item: MarqueeItem, idx: number) {
    if (variant === "logo" && item.logo) {
      return (
        <div
          key={idx}
          className="flex-none flex items-center justify-center px-3 md:px-5 transition-all duration-300 cursor-default"
        >
          <img
            src={item.logo}
            alt={item.text}
            className="h-10 md:h-14 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 mix-blend-multiply"
          />
        </div>
      )
    }

    return (
      <div 
        key={idx} 
        className={cn(
          "flex-none whitespace-nowrap transition-all duration-300 cursor-default",
          variant === "pill" 
            ? "bg-brand-gray border border-border px-6 py-3 rounded-full font-bold text-brand-slate text-sm md:text-base hover:border-brand-primary hover:text-brand-primary hover:bg-white hover:scale-110 shadow-sm"
            : variant === "announcement"
            ? "text-white font-semibold text-xs md:text-sm tracking-wide opacity-70 hover:opacity-100 transition-opacity"
            : "text-brand-slate font-extrabold text-sm md:text-xl tracking-wider uppercase opacity-40 hover:opacity-100 hover:text-brand-primary hover:scale-110"
        )}
      >
        {item.text}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "group overflow-hidden p-2 relative",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max",
          speed === "normal" ? "marquee-scroll-normal" : "marquee-scroll-slow",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ gap }}
      >
        {/* First copy */}
        {normalizedItems.map((item, idx) => renderItem(item, idx))}
        {/* Second copy for seamless loop */}
        {normalizedItems.map((item, idx) => renderItem(item, normalizedItems.length + idx))}
      </div>
    </div>
  )
}
