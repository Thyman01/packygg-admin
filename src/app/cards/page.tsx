import { DashboardLayout } from "@/components/dashboard-layout"
import { CardsTable } from "@/components/cards-table"

export default function CardsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cards</h1>
          <p className="text-muted-foreground">
            View and manage all cards in your collection. Sort by different fields and filter by set.
          </p>
        </div>

        <CardsTable />
      </div>
    </DashboardLayout>
  )
}
