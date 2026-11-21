import { SiteNavbar } from "@/components/side-navbar"

export default function ServiceDetailsLoading() {
  return (
    <>
      <SiteNavbar />
      <main className="service-detail-page" aria-busy="true">
        <div className="content-wrap detail-layout">
          <div className="detail-main">
            <div className="detail-cover skeleton-block" />
            <article className="detail-information">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line" />
              <div className="skeleton-block skeleton-action" />
            </article>
          </div>
          <aside className="booking-card">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-block skeleton-action" />
            <div className="skeleton-block skeleton-action" />
          </aside>
        </div>
      </main>
    </>
  )
}
