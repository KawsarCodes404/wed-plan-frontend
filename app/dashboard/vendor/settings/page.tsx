import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
export default function VendorSettingsPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Profile settings"
        description="Help couples get to know you and the work you love doing."
      />
      <ProfileSettings />
    </div>
  )
}
