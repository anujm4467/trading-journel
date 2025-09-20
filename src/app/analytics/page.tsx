import { MainLayout } from '@/components/layout/MainLayout'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <AnalyticsDashboard />
      </div>
    </MainLayout>
  )
}
