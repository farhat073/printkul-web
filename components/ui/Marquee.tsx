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

  function renderItem(item: MarqueeItem, idx: number) {
    if (variant === "logo" && item.logo) {
      return (
        <div
          key={idx}
          className="flex items-center justify-center px-6 md:px-10 transition-all duration-300 cursor-default"
        >
          <img
            src={item.logo}
            alt={item.text}
            className="h-10 md:h-14 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />
        </div>
      )
    }

    return (
      <div 
        key={idx} 
        className={cn(
          "whitespace-nowrap transition-all duration-300 cursor-default",
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
        "group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] relative",
        "[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
        className
      )}
    >
      <div 
        className={cn(
          "flex shrink-0 justify-around [gap:var(--gap)] min-w-full items-center",
          speed === "normal" ? "animate-marquee" : "animate-marquee-slow",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        {normalizedItems.map((item, idx) => renderItem(item, idx))}
      </div>
      {/* Second track for seamless loop */}
      <div 
        aria-hidden="true"
        className={cn(
          "flex shrink-0 justify-around [gap:var(--gap)] min-w-full items-center",
          speed === "normal" ? "animate-marquee" : "animate-marquee-slow",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        {normalizedItems.map((item, idx) => renderItem(item, idx))}
      </div>
    </div>
  )
}
