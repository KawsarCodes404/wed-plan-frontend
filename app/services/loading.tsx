export default function ServicesLoading() {
  return (
    <main
      className="content-wrap services-page"
      aria-busy="true"
      aria-label="Loading wedding services"
    >
      <div className="service-loading-heading" aria-hidden="true">
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-title" />
      </div>
      <div className="service-grid" role="status" aria-label="Loading services">
        {Array.from({ length: 6 }, (_, index) => (
          <article className="service-card service-card-skeleton" key={index}>
            <div className="service-image skeleton-block" />
            <div className="service-content">
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-short" />
              <div className="skeleton-block skeleton-action" />
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
