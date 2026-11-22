"use client"

import { useCallback, useEffect, useState } from "react"
import { Fragment } from "react"
import {
  BadgeCheck,
  Ban,
  Check,
  Eye,
  Shield,
  Trash2,
  UserRound,
  X,
} from "lucide-react"
import { getApiToken } from "@/lib/api-token"
import { useSession } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { FilterDropdown } from "@/components/ui/filter-dropdown"
import { AdminDataSkeleton } from "@/components/dashboard/loading-skeletons"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")

const roleOptions = [
  { value: "", label: "All roles" },
  { value: "vendor", label: "Vendors" },
  { value: "customer", label: "Customers" },
  { value: "admin", label: "Admins" },
]
const serviceStatusOptions = [
  { value: "", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
]
const categoryOptions = [
  { value: "", label: "All categories" },
  { value: "Photography & Videography", label: "Photography & Videography" },
  { value: "Wedding Venues", label: "Wedding Venues" },
  { value: "Decoration & Florist", label: "Decoration & Florist" },
  { value: "Catering Services", label: "Catering Services" },
  { value: "Makeup & Styling", label: "Makeup & Styling" },
  { value: "Wedding Fashion", label: "Wedding Fashion" },
]
const serviceQueueOptions = [
  { value: "", label: "All services" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
]
type Service = {
  _id: string
  serviceName: string
  category: string
  location: string
  price: number
  description: string
  status: string
  isActive?: boolean
  images?: string[]
  vendor?: {
    name?: string
    businessName?: string
    email?: string
    image?: string | null
  }
}
type User = {
  _id: string
  name: string
  email: string
  role: string
  isBlocked: boolean
  businessName?: string
  location?: string | null
  bio?: string | null
  createdAt?: string
  subscriptionPlan?: string
  subscriptionExpiresAt?: string | null
  image?: string | null
}
type Transaction = {
  _id: string
  vendorId: string
  plan: string
  amount: number
  currency: string
  status: string
  createdAt: string
  vendor?: { name?: string; email?: string; businessName?: string }
}

function formatUserDate(value?: string | null) {
  if (!value) return "Date unavailable"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Date unavailable"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function AdminManager({
  kind,
}: {
  kind: "services" | "users" | "transactions"
}) {
  const { data: session, isPending } = useSession()
  const [rows, setRows] = useState<(Service | User | Transaction)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState("")
  const [filter, setFilter] = useState("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [viewingUser, setViewingUser] = useState("")
  const serviceSearch = kind === "services" ? search : ""
  const load = useCallback(async () => {
    if (isPending) return
    if (!session) {
      setLoading(false)
      return
    }
    setLoading(true)
    const token = await getApiToken()
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const params = new URLSearchParams()
      if (filter) params.set(kind === "services" ? "status" : "role", filter)
      if (serviceSearch.trim()) {
        params.set("search", serviceSearch.trim())
      }
      if (kind === "services" && category) params.set("category", category)
      const query = params.size ? `?${params.toString()}` : ""
      const response = await fetch(`${apiBase}/admin/${kind}${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.message || "Could not load admin data.")
      setRows(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load admin data.")
    } finally {
      setLoading(false)
    }
  }, [isPending, session, kind, filter, serviceSearch, category])
  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0)
    return () => window.clearTimeout(timeout)
  }, [load])
  async function action(row: Service | User, operation: string) {
    if (
      operation === "delete" &&
      !window.confirm("Delete this service? This action cannot be undone.")
    ) {
      return
    }
    const token = await getApiToken()
    if (!token) return
    setBusy(row._id)
    setError("")
    let endpoint = "",
      body: unknown = {},
      method = "PATCH"
    if (kind === "services") {
      if (operation === "delete") {
        endpoint = `services/${row._id}`
        method = "DELETE"
      } else if (operation === "activate" || operation === "pause") {
        endpoint = `services/${row._id}/availability`
        body = { isActive: operation === "activate" }
      } else {
        endpoint = `services/${row._id}/review`
        body = { status: operation }
      }
    } else {
      endpoint = `users/${row._id}/block`
      body = { isBlocked: operation === "block" }
    }
    try {
      const response = await fetch(`${apiBase}/admin/${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      const result = response.status === 204 ? {} : await response.json()
      if (!response.ok)
        throw new Error(result.message || "Could not save the change.")
      toast.add({
        title:
          result.message ||
          (operation === "delete" ? "Service deleted." : "Change saved."),
        type: "success",
      })
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the change.")
    } finally {
      setBusy("")
    }
  }
  const visibleUsers = (rows as (Service | User | Transaction)[])
    .filter((row): row is User => kind === "users" && "role" in row)
    .filter((row) => {
      const query = search.trim().toLowerCase()
      return (
        !query ||
        [row.name, row.email, row.businessName]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query))
      )
    })
  return (
    <section
      className={`dashboard-panel ${kind === "users" ? "admin-users-panel" : ""}`}
    >
      {kind !== "users" && (
        <div className="dashboard-panel-heading">
          <div>
            <span className="eyebrow">WEDPLAN ADMIN</span>
            <h2>
              {kind === "services"
                ? "Service review queue"
                : "Subscription transactions"}
            </h2>
          </div>
          {kind === "services" && (
            <FilterDropdown
              className="admin-dropdown admin-service-status-filter"
              label="Filter services by status"
              value={filter}
              onChange={setFilter}
              options={serviceQueueOptions}
            />
          )}
        </div>
      )}
      {kind === "users" && (
        <div className="admin-user-toolbar">
          <input
            type="search"
            aria-label="Search users"
            placeholder="Search by name, email, or business name…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <FilterDropdown
            className="admin-dropdown"
            label="Filter users by role"
            value={filter}
            onChange={setFilter}
            options={roleOptions}
          />
        </div>
      )}
      {kind === "services" && (
        <div className="admin-service-filters">
          <input
            aria-label="Search services"
            placeholder="Search by service name or location…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <FilterDropdown
            className="admin-dropdown"
            label="Filter service status"
            value={filter}
            onChange={setFilter}
            options={serviceStatusOptions}
          />
          <FilterDropdown
            className="admin-dropdown"
            label="Filter service category"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />
        </div>
      )}
      {error && (
        <p role="alert" className="dashboard-error">
          {error}
        </p>
      )}
      {loading || isPending ? (
        <AdminDataSkeleton kind={kind} />
      ) : !rows.length ? (
        <div className="dashboard-empty">
          <h3>Nothing to review right now</h3>
          <p>New marketplace activity will appear here.</p>
        </div>
      ) : kind === "services" ? (
        <div className="admin-service-list">
          {(rows as Service[]).map((row) => (
            <article className="admin-service-card" key={row._id}>
              {row.images?.[0] ? (
                <span
                  className="admin-service-image"
                  role="img"
                  aria-label={`${row.serviceName} photo`}
                  style={{ backgroundImage: `url("${row.images[0]}")` }}
                />
              ) : (
                <span className="admin-service-image admin-service-image-empty">
                  <BadgeCheck size={20} />
                </span>
              )}
              <div className="admin-service-info">
                <div className="admin-service-title-row">
                  <strong>{row.serviceName}</strong>
                  {row.status === "Pending" && (
                    <span className="service-status-badge pending">
                      Pending
                    </span>
                  )}
                </div>
                {row.status === "Approved" && (
                  <span className="service-status-badge approved">
                    Approved
                  </span>
                )}
                {row.status === "Rejected" && (
                  <span className="service-status-badge rejected">
                    Rejected
                  </span>
                )}
                <span className="admin-service-meta">
                  {row.category} · ${Number(row.price).toLocaleString()} ·{" "}
                  {row.location}
                </span>
                <small>
                  Vendor:{" "}
                  {row.vendor?.businessName || row.vendor?.name || "Vendor"}
                  {row.vendor?.email ? ` (${row.vendor.email})` : ""}
                </small>
                {row.description && <p>{row.description}</p>}
              </div>
              <div className="admin-service-actions">
                {row.status === "Pending" ? (
                  <>
                    <button
                      className="admin-action-button approve"
                      disabled={busy === row._id}
                      onClick={() => void action(row, "Approved")}
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      className="admin-action-button reject"
                      disabled={busy === row._id}
                      onClick={() => void action(row, "Rejected")}
                    >
                      <X size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <>
                    {row.status === "Approved" && (
                      <>
                        <button
                          className="admin-action-button reject"
                          disabled={busy === row._id}
                          onClick={() => void action(row, "Rejected")}
                        >
                          <X size={14} /> Reject
                        </button>
                        <button
                          className="availability-toggle"
                          type="button"
                          role="switch"
                          aria-checked={row.isActive !== false}
                          aria-label={`${row.isActive === false ? "Activate" : "Pause"} ${row.serviceName}`}
                          disabled={busy === row._id}
                          onClick={() =>
                            void action(
                              row,
                              row.isActive === false ? "activate" : "pause"
                            )
                          }
                        >
                          <span>
                            {row.isActive === false ? "Inactive" : "Active"}
                          </span>
                          <span
                            className="availability-track"
                            aria-hidden="true"
                          />
                        </button>
                      </>
                    )}
                    {row.status === "Rejected" && (
                      <button
                        className="admin-action-button approve"
                        disabled={busy === row._id}
                        onClick={() => void action(row, "Approved")}
                      >
                        <Check size={14} /> Approve
                      </button>
                    )}
                  </>
                )}
                <button
                  className="admin-action-button delete"
                  disabled={busy === row._id}
                  onClick={() => void action(row, "delete")}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : kind === "users" ? (
        <div className="admin-users-table-scroll">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Role</th>
                <th scope="col">Plan</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((row) => (
                <Fragment key={row._id}>
                  <tr>
                    <td>
                      <span className="admin-user-identity">
                        {row.image ? (
                          <img src={row.image} alt="" />
                        ) : (
                          <span className="admin-user-initials">
                            {(row.name || row.businessName || "W")
                              .split(/\s+/)
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </span>
                        )}
                        <span>
                          <strong>
                            {row.name || row.businessName || "WedPlan member"}
                          </strong>
                          <small>{row.email}</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="admin-user-role">
                        {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      {row.role === "vendor" ? (
                        <span
                          className={`admin-user-plan ${row.subscriptionPlan === "Premium" ? "premium" : ""}`}
                        >
                          {row.subscriptionPlan || "Free"}
                        </span>
                      ) : (
                        <span className="admin-user-no-plan">—</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`admin-user-status ${row.isBlocked ? "blocked" : "active"}`}
                      >
                        {row.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>
                      <span className="admin-user-actions">
                        <button
                          type="button"
                          className="admin-user-view"
                          aria-expanded={viewingUser === row._id}
                          onClick={() =>
                            setViewingUser((current) =>
                              current === row._id ? "" : row._id
                            )
                          }
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          type="button"
                          className={`admin-user-block ${row.isBlocked ? "unblock" : ""}`}
                          disabled={busy === row._id || row.role === "admin"}
                          onClick={() =>
                            void action(
                              row,
                              row.isBlocked ? "unblock" : "block"
                            )
                          }
                        >
                          {row.isBlocked ? (
                            <Shield size={14} />
                          ) : (
                            <Ban size={14} />
                          )}
                          {row.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </span>
                    </td>
                  </tr>
                  {viewingUser === row._id && (
                    <tr className="admin-user-details-row">
                      <td colSpan={5}>
                        <div className="admin-user-details-card">
                          <div className="admin-user-details-heading">
                            <div className="admin-user-details-person">
                              {row.image ? (
                                <img src={row.image} alt="" />
                              ) : (
                                <span className="admin-user-initials">
                                  {(row.name || "W")
                                    .split(/\s+/)
                                    .map((part) => part[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                                </span>
                              )}
                              <span>
                                <small>ACCOUNT DETAILS</small>
                                <strong>{row.name || "WedPlan member"}</strong>
                                <span>{row.email}</span>
                              </span>
                            </div>
                            <div className="admin-user-details-badges">
                              <span className="admin-user-role">
                                {row.role.charAt(0).toUpperCase() +
                                  row.role.slice(1)}
                              </span>
                              <span
                                className={`admin-user-status ${row.isBlocked ? "blocked" : "active"}`}
                              >
                                {row.isBlocked ? "Blocked" : "Active"}
                              </span>
                            </div>
                          </div>
                          <div className="admin-user-details-grid">
                            {row.businessName && (
                              <div>
                                <span>Business name</span>
                                <strong>{row.businessName}</strong>
                              </div>
                            )}
                            {row.location && (
                              <div>
                                <span>Location</span>
                                <strong>{row.location}</strong>
                              </div>
                            )}
                            <div>
                              <span>Account type</span>
                              <strong>
                                {row.role.charAt(0).toUpperCase() +
                                  row.role.slice(1)}
                              </strong>
                            </div>
                            <div>
                              <span>Vendor plan</span>
                              <strong>
                                {row.role === "vendor"
                                  ? row.subscriptionPlan || "Free"
                                  : "Not applicable"}
                              </strong>
                            </div>
                            <div>
                              <span>Member since</span>
                              <strong>{formatUserDate(row.createdAt)}</strong>
                            </div>
                            {row.subscriptionPlan === "Premium" &&
                              row.subscriptionExpiresAt && (
                                <div>
                                  <span>Premium through</span>
                                  <strong>
                                    {formatUserDate(
                                      row.subscriptionExpiresAt
                                    )}
                                  </strong>
                                </div>
                              )}
                          </div>
                          {row.bio && (
                            <div className="admin-user-details-bio">
                              <span>About</span>
                              <p>{row.bio}</p>
                            </div>
                          )}
                          <div className="admin-user-account-id">
                            <span>Account ID</span>
                            <code>{row._id}</code>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {visibleUsers.length === 0 && (
                <tr>
                  <td className="admin-users-empty" colSpan={5}>
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-transactions-scroll">
          <table className="admin-transactions-table">
            <thead>
              <tr>
                <th scope="col">Vendor</th>
                <th scope="col">Plan</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Transaction date</th>
              </tr>
            </thead>
            <tbody>
              {(rows as Transaction[]).map((row) => (
                <tr key={row._id}>
                  <td>
                    <span className="admin-transaction-vendor">
                      <strong>
                        {row.vendor?.businessName ||
                          row.vendor?.name ||
                          "Vendor subscription"}
                      </strong>
                      {row.vendor?.email && <small>{row.vendor.email}</small>}
                    </span>
                  </td>
                  <td>{row.plan}</td>
                  <td className="admin-transaction-amount">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: (row.currency || "usd").toUpperCase(),
                    }).format((row.amount || 0) / 100)}
                  </td>
                  <td>
                    <span
                      className={`admin-transaction-status ${row.status.toLowerCase()}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="admin-transaction-date">
                    {new Date(row.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
