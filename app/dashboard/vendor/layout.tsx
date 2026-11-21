import { requireRole } from "@/lib/core/server";

const VendorDashboardLayout = async({ children }: { children: React.ReactNode }) => {
    await requireRole('vendor');
    return children;
};

export default VendorDashboardLayout;