import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { ProfileSettings } from "@/components/dashboard/profile-settings"

export default function AdminSettingsPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Profile settings"
        description="Keep your account details up to date."
      />
      <ProfileSettings />
    </div>
  )
}
