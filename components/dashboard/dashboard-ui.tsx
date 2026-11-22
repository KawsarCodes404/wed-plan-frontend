import type { ReactNode } from "react"

export function DashboardTitle({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <header className="dashboard-page-title">
      <span className="eyebrow">YOUR WEDPLAN WORKSPACE</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  )
}

export function StatCards({
  items,
  className = "",
}: {
  items: {
    label: string
    value: string | number
    tone?: string
    iconTone?: string
    icon?: ReactNode
  }[]
  className?: string
}) {
  return (
    <div className={`dashboard-stat-grid ${className}`}>
      {items.map((item) => (
        <article
          className={`dashboard-stat-card ${item.icon ? "dashboard-stat-card-featured" : ""}`}
          key={item.label}
        >
          <span>{item.label}</span>
          {item.icon && (
            <span
              className={`dashboard-stat-icon ${item.iconTone || item.tone || ""}`}
            >
              {item.icon}
            </span>
          )}
          <strong className={item.tone || ""}>{item.value}</strong>
        </article>
      ))}
    </div>
  )
}
