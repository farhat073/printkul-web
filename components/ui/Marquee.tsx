import { cn } from "@/lib/utils"

interface MarqueeProps {
  items: string[]
  className?: string
  speed?: "normal" | "slow"
  pauseOnHover?: boolean
  variant?: "text" | "pill"
}

export function Marquee({ 
  items, 
  className, 
  speed = "normal", 
  pauseOnHover = true,
  variant = "pill"
}: MarqueeProps) {
  return (
    <div 
      className={cn(
        "group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] relative",
        // This creates the "Lens" effect where sides fade out and middle is clear
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
      >
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className={cn(
              "whitespace-nowrap transition-all duration-300 cursor-default",
              variant === "pill" 
                ? "bg-brand-gray border border-border px-6 py-3 rounded-full font-bold text-brand-slate text-sm md:text-base hover:border-brand-primary hover:text-brand-primary hover:bg-white hover:scale-110 shadow-sm"
                : "text-brand-slate font-extrabold text-sm md:text-xl tracking-wider uppercase opacity-40 hover:opacity-100 hover:text-brand-primary hover:scale-110"
            )}
          >
            {item}
          </div>
        ))}
      </div>
      {/* Second track for seamless loop */}
      <div 
        aria-hidden="true"
        className={cn(
          "flex shrink-0 justify-around [gap:var(--gap)] min-w-full items-center",
          speed === "normal" ? "animate-marquee" : "animate-marquee-slow",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className={cn(
              "whitespace-nowrap transition-all duration-300 cursor-default",
              variant === "pill" 
                ? "bg-brand-gray border border-border px-6 py-3 rounded-full font-bold text-brand-slate text-sm md:text-base hover:border-brand-primary hover:text-brand-primary hover:bg-white hover:scale-110 shadow-sm"
                : "text-brand-slate font-extrabold text-sm md:text-xl tracking-wider uppercase opacity-40 hover:opacity-100 hover:text-brand-primary hover:scale-110"
            )}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}


