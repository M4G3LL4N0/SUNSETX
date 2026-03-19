type CardProps = {
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl bg-white/5 p-4 ${className}`}>
      {title && <div className="text-sm text-zinc-400 mb-2">{title}</div>}
      {children}
    </div>
  )
}
