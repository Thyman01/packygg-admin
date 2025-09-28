import { DashboardLayout } from "@/components/dashboard-layout"
import { CSVImportForm } from "@/components/csv-import-form"

export default function ImportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Cards</h1>
          <p className="text-muted-foreground">
            Import cards from CSV files into your sets. Select a set and upload your CSV file to get started.
          </p>
        </div>

        <CSVImportForm />
      </div>
    </DashboardLayout>
  )
}
