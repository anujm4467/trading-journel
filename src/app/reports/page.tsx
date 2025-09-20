import { MainLayout } from '@/components/layout/MainLayout'
import { ReportsOverview } from '@/components/reports/ReportsOverview'

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <ReportsOverview />
      </div>
    </MainLayout>
  )
}
