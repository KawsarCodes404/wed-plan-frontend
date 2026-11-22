type DashboardVariant =
  | "overview"
  | "list"
  | "bookings"
  | "services"
  | "profile"
  | "subscription"
  | "form"

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span className={`dashboard-skeleton-block ${className}`} />
}

function PageHeadingSkeleton() {
  return (
    <header className="dashboard-page-title dashboard-skeleton-heading">
      <SkeletonBlock className="dashboard-skeleton-eyebrow" />
      <SkeletonBlock className="dashboard-skeleton-title" />
      <SkeletonBlock className="dashboard-skeleton-description" />
    </header>
  )
}

function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="dashboard-stat-grid dashboard-skeleton-stat-grid">
      {Array.from({ length: count }, (_, index) => (
        <article
          className="dashboard-stat-card dashboard-skeleton-stat"
          key={index}
        >
          <SkeletonBlock className="dashboard-skeleton-label" />
          <SkeletonBlock className="dashboard-skeleton-value" />
          <SkeletonBlock className="dashboard-skeleton-icon" />
        </article>
      ))}
    </div>
  )
}

function OverviewSkeleton({ stats = 4 }: { stats?: number }) {
  return (
    <>
      <StatCardsSkeleton count={stats} />
      <div className="dashboard-skeleton-panels">
        {[0, 1].map((panel) => (
          <section
            className="dashboard-panel dashboard-skeleton-panel"
            key={panel}
          >
            <SkeletonBlock className="dashboard-skeleton-panel-title" />
            <SkeletonBlock className="dashboard-skeleton-panel-line" />
            <SkeletonBlock className="dashboard-skeleton-panel-line short" />
            <SkeletonBlock className="dashboard-skeleton-button" />
          </section>
        ))}
      </div>
    </>
  )
}

function FilterSkeleton() {
  return (
    <div className="dashboard-filter-skeleton" aria-hidden="true">
      <SkeletonBlock className="dashboard-skeleton-input" />
      <SkeletonBlock className="dashboard-skeleton-select" />
    </div>
  )
}

function DataRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="dashboard-rows-skeleton" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div className="dashboard-row-skeleton" key={index}>
          <SkeletonBlock className="dashboard-skeleton-avatar" />
          <div className="dashboard-row-skeleton-copy">
            <SkeletonBlock className="dashboard-skeleton-row-title" />
            <SkeletonBlock className="dashboard-skeleton-row-detail" />
          </div>
          <SkeletonBlock className="dashboard-skeleton-pill" />
          <SkeletonBlock className="dashboard-skeleton-action" />
        </div>
      ))}
    </div>
  )
}

function BookingRowsSkeleton({ role }: { role: "customer" | "vendor" }) {
  return (
    <div className="dashboard-booking-skeleton-list" aria-hidden="true">
      {Array.from({ length: 2 }, (_, index) => (
        <article
          className={
            role === "customer"
              ? "customer-booking-card dashboard-booking-skeleton-card"
              : "request-card dashboard-request-skeleton-card"
          }
          key={index}
        >
          {role === "customer" ? (
            <>
              <SkeletonBlock className="dashboard-booking-skeleton-image" />
              <div className="dashboard-booking-skeleton-copy">
                <SkeletonBlock className="dashboard-skeleton-row-title" />
                <SkeletonBlock className="dashboard-skeleton-row-detail" />
                <SkeletonBlock className="dashboard-skeleton-row-detail short" />
              </div>
              <SkeletonBlock className="dashboard-skeleton-pill" />
            </>
          ) : (
            <>
              <div className="dashboard-request-skeleton-heading">
                <SkeletonBlock className="dashboard-skeleton-row-title" />
                <SkeletonBlock className="dashboard-skeleton-pill" />
                <SkeletonBlock className="dashboard-skeleton-pill" />
                <SkeletonBlock className="dashboard-skeleton-action" />
              </div>
              <SkeletonBlock className="dashboard-request-skeleton-details" />
              <SkeletonBlock className="dashboard-request-skeleton-note" />
            </>
          )}
        </article>
      ))}
    </div>
  )
}

function ManagedServicesSkeletonRows() {
  return (
    <div
      className="managed-service-list dashboard-managed-service-skeleton"
      aria-hidden="true"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div className="managed-service-row" key={index}>
          <SkeletonBlock className="managed-service-image dashboard-skeleton-image" />
          <div className="dashboard-row-skeleton-copy">
            <SkeletonBlock className="dashboard-skeleton-row-title" />
            <SkeletonBlock className="dashboard-skeleton-row-detail" />
          </div>
          <SkeletonBlock className="dashboard-skeleton-action" />
        </div>
      ))}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <section
      className="dashboard-panel dashboard-profile-skeleton"
      aria-hidden="true"
    >
      <div className="dashboard-profile-skeleton-photo">
        <SkeletonBlock className="dashboard-skeleton-avatar large" />
        <div className="dashboard-row-skeleton-copy">
          <SkeletonBlock className="dashboard-skeleton-row-title" />
          <SkeletonBlock className="dashboard-skeleton-button" />
        </div>
      </div>
      <div className="dashboard-profile-skeleton-fields">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <SkeletonBlock className="dashboard-skeleton-label" />
            <SkeletonBlock className="dashboard-skeleton-input" />
          </div>
        ))}
        <SkeletonBlock className="dashboard-skeleton-textarea" />
      </div>
      <SkeletonBlock className="dashboard-skeleton-button wide" />
    </section>
  )
}

function SubscriptionSkeleton() {
  return (
    <>
      <section
        className="subscription-status-card dashboard-subscription-skeleton"
        aria-hidden="true"
      >
        <div>
          <SkeletonBlock className="dashboard-skeleton-label" />
          <SkeletonBlock className="dashboard-skeleton-panel-title" />
        </div>
        <SkeletonBlock className="dashboard-skeleton-button" />
      </section>
      <div
        className="plan-cards subscription-plan-cards dashboard-plan-skeletons"
        aria-hidden="true"
      >
        {[0, 1].map((plan) => (
          <article className="plan-card" key={plan}>
            <SkeletonBlock className="dashboard-skeleton-panel-title" />
            <SkeletonBlock className="dashboard-skeleton-row-detail" />
            <SkeletonBlock className="dashboard-skeleton-value" />
            <SkeletonBlock className="dashboard-skeleton-plan-lines" />
            <SkeletonBlock className="dashboard-skeleton-button" />
          </article>
        ))}
      </div>
      <section
        className="dashboard-panel dashboard-subscription-history-skeleton"
        aria-hidden="true"
      >
        <SkeletonBlock className="dashboard-skeleton-panel-title" />
        <DataRowsSkeleton rows={3} />
      </section>
    </>
  )
}

function FormSkeleton() {
  return (
    <section
      className="dashboard-panel dashboard-form-skeleton"
      aria-hidden="true"
    >
      <SkeletonBlock className="dashboard-skeleton-panel-title" />
      <div className="dashboard-profile-skeleton-fields">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <SkeletonBlock className="dashboard-skeleton-label" />
            <SkeletonBlock className="dashboard-skeleton-input" />
          </div>
        ))}
        <SkeletonBlock className="dashboard-skeleton-textarea" />
      </div>
      <SkeletonBlock className="dashboard-skeleton-button" />
    </section>
  )
}

export function DashboardRouteSkeleton({
  variant = "overview",
  stats = 6,
  role = "customer",
}: {
  variant?: DashboardVariant
  stats?: number
  role?: "customer" | "vendor"
}) {
  return (
    <div
      className={`dashboard-page dashboard-route-skeleton ${variant}`}
      role="status"
      aria-label="Loading dashboard"
      aria-busy="true"
    >
      <PageHeadingSkeleton />
      {variant === "overview" && <OverviewSkeleton stats={stats} />}
      {variant === "list" && (
        <>
          <FilterSkeleton />
          <section className="dashboard-panel dashboard-skeleton-list-panel">
            <DataRowsSkeleton />
          </section>
        </>
      )}
      {variant === "bookings" &&
        (role === "vendor" ? (
          <BookingRowsSkeleton role={role} />
        ) : (
          <section className="dashboard-panel dashboard-skeleton-list-panel">
            <SkeletonBlock className="dashboard-skeleton-panel-title" />
            <BookingRowsSkeleton role={role} />
          </section>
        ))}
      {variant === "services" && (
        <section className="dashboard-panel dashboard-skeleton-list-panel">
          <SkeletonBlock className="dashboard-skeleton-panel-title" />
          <ManagedServicesSkeletonRows />
        </section>
      )}
      {variant === "profile" && <ProfileSkeleton />}
      {variant === "subscription" && <SubscriptionSkeleton />}
      {variant === "form" && <FormSkeleton />}
    </div>
  )
}

export function AdminRouteSkeleton({
  kind,
}: {
  kind: "services" | "users" | "transactions"
}) {
  return (
    <div
      className="dashboard-page dashboard-route-skeleton"
      role="status"
      aria-label={`Loading admin ${kind}`}
      aria-busy="true"
    >
      <PageHeadingSkeleton />
      <AdminDataSkeleton kind={kind} />
    </div>
  )
}

export function BookingListSkeleton({ role }: { role: "customer" | "vendor" }) {
  return (
    <div
      className="dashboard-booking-loading"
      role="status"
      aria-label="Loading booking requests"
      aria-busy="true"
    >
      <BookingRowsSkeleton role={role} />
    </div>
  )
}

export function AdminDataSkeleton({
  kind,
}: {
  kind: "services" | "users" | "transactions"
}) {
  if (kind === "services") {
    return (
      <div
        className="admin-service-list dashboard-admin-service-skeleton"
        role="status"
        aria-label="Loading services"
        aria-busy="true"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <article className="admin-service-card" key={index}>
            <SkeletonBlock className="admin-service-image dashboard-skeleton-image" />
            <div className="admin-service-info">
              <SkeletonBlock className="dashboard-skeleton-row-title" />
              <SkeletonBlock className="dashboard-skeleton-row-detail" />
              <SkeletonBlock className="dashboard-skeleton-row-detail short" />
            </div>
            <SkeletonBlock className="dashboard-skeleton-action" />
          </article>
        ))}
      </div>
    )
  }

  const tableClass =
    kind === "users" ? "admin-users-table" : "admin-transactions-table"
  const headingCount = kind === "users" ? 5 : 5

  return (
    <div
      className={`${kind === "users" ? "admin-users-table-scroll" : "admin-transactions-scroll"} dashboard-admin-table-skeleton`}
      role="status"
      aria-label={`Loading ${kind}`}
      aria-busy="true"
    >
      <table className={tableClass} aria-hidden="true">
        <thead>
          <tr>
            {Array.from({ length: headingCount }, (_, index) => (
              <th key={index}>
                <SkeletonBlock className="dashboard-skeleton-label" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_, row) => (
            <tr key={row}>
              {Array.from({ length: headingCount }, (_, column) => (
                <td key={column}>
                  <SkeletonBlock
                    className={
                      column === 0
                        ? "dashboard-skeleton-row-title"
                        : "dashboard-skeleton-row-detail"
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ManagedServicesSkeleton() {
  return (
    <div role="status" aria-label="Loading your services" aria-busy="true">
      <ManagedServicesSkeletonRows />
    </div>
  )
}

export function ProfileSettingsSkeleton() {
  return (
    <div role="status" aria-label="Loading profile settings" aria-busy="true">
      <ProfileSkeleton />
    </div>
  )
}

export function SubscriptionContentSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading subscription details"
      aria-busy="true"
    >
      <SubscriptionSkeleton />
    </div>
  )
}

export function BookingFormSkeleton() {
  return (
    <aside
      className="booking-panel dashboard-booking-form-skeleton"
      role="status"
      aria-label="Loading booking form"
      aria-busy="true"
    >
      <SkeletonBlock className="dashboard-skeleton-panel-title" />
      <SkeletonBlock className="dashboard-skeleton-row-detail" />
      <SkeletonBlock className="dashboard-skeleton-label" />
      <SkeletonBlock className="dashboard-skeleton-input" />
      <SkeletonBlock className="dashboard-skeleton-label" />
      <SkeletonBlock className="dashboard-skeleton-input" />
      <SkeletonBlock className="dashboard-skeleton-textarea" />
      <SkeletonBlock className="dashboard-skeleton-button wide" />
    </aside>
  )
}

export function HomePageSkeleton() {
  return (
    <main
      className="home-page-skeleton"
      role="status"
      aria-label="Loading WedPlan"
      aria-busy="true"
    >
      <header className="home-nav-skeleton" aria-hidden="true">
        <SkeletonBlock className="home-nav-logo-skeleton" />
        <SkeletonBlock className="home-nav-links-skeleton" />
        <SkeletonBlock className="home-nav-account-skeleton" />
      </header>
      <section className="home-hero-skeleton" aria-hidden="true">
        <div className="home-hero-copy-skeleton">
          <SkeletonBlock className="home-hero-kicker-skeleton" />
          <SkeletonBlock className="home-hero-title-skeleton" />
          <SkeletonBlock className="home-hero-description-skeleton" />
          <SkeletonBlock className="home-hero-button-skeleton" />
          <SkeletonBlock className="home-hero-proof-skeleton" />
        </div>
        <SkeletonBlock className="home-hero-photo-skeleton" />
      </section>
      <section
        className="featured-section content-wrap home-featured-skeleton"
        aria-hidden="true"
      >
        <div className="section-row">
          <div className="dashboard-row-skeleton-copy">
            <SkeletonBlock className="dashboard-skeleton-label" />
            <SkeletonBlock className="dashboard-skeleton-panel-title" />
            <SkeletonBlock className="dashboard-skeleton-row-detail" />
          </div>
        </div>
        <div className="service-grid">
          {[0, 1, 2].map((card) => (
            <SkeletonBlock className="service-skeleton" key={card} />
          ))}
        </div>
      </section>
    </main>
  )
}

export function CheckoutSuccessSkeleton() {
  return (
    <main
      className="checkout-result-page"
      role="status"
      aria-label="Checking payment status"
      aria-busy="true"
    >
      <section
        className="checkout-result-card checkout-skeleton-card"
        aria-hidden="true"
      >
        <SkeletonBlock className="checkout-skeleton-icon" />
        <SkeletonBlock className="dashboard-skeleton-panel-title" />
        <SkeletonBlock className="dashboard-skeleton-row-detail" />
        <SkeletonBlock className="checkout-skeleton-details" />
        <SkeletonBlock className="dashboard-skeleton-button" />
      </section>
    </main>
  )
}
