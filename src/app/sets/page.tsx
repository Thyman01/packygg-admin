import { DashboardLayout } from "@/components/dashboard-layout"
import { SetsTable } from "@/components/sets-table"

export default function SetsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sets Management</h1>
          <p className="text-muted-foreground">
            Manage your card sets collection. Add, edit, and view all your sets.
          </p>
        </div>
        
        <SetsTable />
      </div>
    </DashboardLayout>
  )
}

