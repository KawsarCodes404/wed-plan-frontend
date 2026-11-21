"use client"

import { useCallback, useEffect, useState } from "react"
import { BadgeCheck, MapPin, Shield, UserRound } from "lucide-react"
import { getApiToken } from "@/lib/api-token"
import { useSession } from "@/lib/auth-client"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")
type Service = {
  _id: string
  serviceName: string
  category: string
  location: string
  price: number
  description: string
  status: string
  vendor?: { name?: string; businessName?: string; email?: string }
}
type User = {
  _id: string
  name: string
  email: string
  role: string
  isBlocked: boolean
  businessName?: string
  subscriptionPlan?: string
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

export function AdminManager({
  kind,
}: {
  kind: "services" | "users" | "transactions"
}) {
  const { data: session } = useSession()
  const [rows, setRows] = useState<(Service | User | Transaction)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState("")
  const [filter, setFilter] = useState(kind === "services" ? "Pending" : "")
  const load = useCallback(async () => {
    const token = await getApiToken()
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const query = filter
        ? `?${kind === "services" ? "status" : "role"}=${encodeURIComponent(filter)}`
        : ""
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
  }, [session, kind, filter])
  useEffect(() => {
    void load()
  }, [load])
  async function action(row: Service | User, operation: string) {
    const token = await getApiToken()
    if (!token) return
    setBusy(row._id)
    setError("")
    let endpoint = "",
      body: unknown = {},
      method = "PATCH"
    if (kind === "services") {
      endpoint = `services/${row._id}/review`
      body = { status: operation }
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
      const result = await response.json()
      if (!response.ok)
        throw new Error(result.message || "Could not save the change.")
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the change.")
    } finally {
      setBusy("")
    }
  }
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-heading">
        <div>
          <span className="eyebrow">WEDPLAN ADMIN</span>
          <h2>
            {kind === "services"
              ? "Service review queue"
              : kind === "users"
                ? "User accounts"
                : "Subscription transactions"}
          </h2>
        </div>
        {kind !== "transactions" && (
          <select
            className="admin-filter"
            aria-label="Filter records"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {kind === "services" ? (
              <>
                <option value="">All services</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </>
            ) : (
              <>
                <option value="">All roles</option>
                <option value="vendor">Vendors</option>
                <option value="customer">Customers</option>
                <option value="admin">Admins</option>
              </>
            )}
          </select>
        )}
      </div>
      {error && (
        <p role="alert" className="dashboard-error">
          {error}
        </p>
      )}
      {loading ? (
        <p className="dashboard-muted">Loading records…</p>
      ) : !rows.length ? (
        <div className="dashboard-empty">
          <h3>Nothing to review right now</h3>
          <p>New marketplace activity will appear here.</p>
        </div>
      ) : kind === "services" ? (
        <div className="admin-record-list">
          {(rows as Service[]).map((row) => (
            <article className="admin-record" key={row._id}>
              <span className="admin-record-icon">
                <BadgeCheck size={18} />
              </span>
              <div className="admin-record-info">
                <strong>{row.serviceName}</strong>
                <span>
                  {row.category} · ${Number(row.price).toLocaleString()}
                </span>
                <small>
                  <MapPin size={12} />
                  {row.location} ·{" "}
                  {row.vendor?.businessName || row.vendor?.name || "Vendor"}
                </small>
                <p>{row.description}</p>
              </div>
              <span
                className={`status-chip status-${row.status.toLowerCase()}`}
              >
                {row.status}
              </span>
              {row.status === "Pending" && (
                <div className="admin-row-actions">
                  <button
                    className="button button-primary"
                    disabled={busy === row._id}
                    onClick={() => void action(row, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="button button-outline"
                    disabled={busy === row._id}
                    onClick={() => void action(row, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : kind === "users" ? (
        <div className="admin-record-list">
          {(rows as User[]).map((row) => (
            <article className="admin-user" key={row._id}>
              <span className="admin-record-icon">
                <UserRound size={18} />
              </span>
              <div className="admin-record-info">
                <strong>
                  {row.name || row.businessName || "WedPlan member"}
                </strong>
                <span>{row.email}</span>
                <small>
                  {row.role}
                  {row.subscriptionPlan === "Premium" ? " · Premium" : ""}
                </small>
              </div>
              <span
                className={`status-chip ${row.isBlocked ? "status-rejected" : "status-accepted"}`}
              >
                {row.isBlocked ? "Blocked" : "Active"}
              </span>
              <button
                className="button button-outline"
                disabled={busy === row._id || row.role === "admin"}
                onClick={() =>
                  void action(row, row.isBlocked ? "unblock" : "block")
                }
              >
                <Shield size={14} />
                {row.isBlocked ? "Unblock" : "Block"}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-record-list">
          {(rows as Transaction[]).map((row) => (
            <article className="admin-user" key={row._id}>
              <span className="admin-record-icon">
                <BadgeCheck size={18} />
              </span>
              <div className="admin-record-info">
                <strong>
                  {row.vendor?.businessName ||
                    row.vendor?.name ||
                    "Vendor subscription"}
                </strong>
                <span>{row.vendor?.email || row.plan}</span>
                <small>
                  {row.plan} · {new Date(row.createdAt).toLocaleDateString()}
                </small>
              </div>
              <span
                className={`status-chip ${row.status === "Completed" ? "status-accepted" : "status-pending"}`}
              >
                {row.status}
              </span>
              <strong className="transaction-total">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: (row.currency || "usd").toUpperCase(),
                }).format((row.amount || 0) / 100)}
              </strong>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
