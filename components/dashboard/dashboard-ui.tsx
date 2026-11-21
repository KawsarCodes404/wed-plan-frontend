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
}: {
  items: { label: string; value: string | number; tone?: string }[]
}) {
  return (
    <div className="dashboard-stat-grid">
      {items.map((item) => (
        <article className="dashboard-stat-card" key={item.label}>
          <span>{item.label}</span>
          <strong className={item.tone || ""}>{item.value}</strong>
        </article>
      ))}
    </div>
  )
}
