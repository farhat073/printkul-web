export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-slate/20 border-t-brand-slate rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading...</p>
      </div>
    </div>
  )
}
