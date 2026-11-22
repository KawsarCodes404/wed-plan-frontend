import { DashboardRouteSkeleton } from "@/components/dashboard/loading-skeletons"

export default function Loading() {
  return <DashboardRouteSkeleton variant="overview" stats={6} />
}
