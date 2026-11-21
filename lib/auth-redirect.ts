export function safeRedirectPath(value?: string | string[]) {
  const path = Array.isArray(value) ? value[0] : value
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/"
}

export function addWelcomeQuery(path: string) {
  const url = new URL(path, "http://wedplan.local")
  url.searchParams.set("welcome", "1")
  return `${url.pathname}${url.search}${url.hash}`
}

export function dashboardPath(role?: string) {
  if (role === "admin") return "/dashboard/admin"
  if (role === "vendor") return "/dashboard/vendor"
  return "/dashboard/customer"
}
