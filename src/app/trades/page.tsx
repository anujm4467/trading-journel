import { MainLayout } from '@/components/layout/MainLayout'
import { TradesTable } from '@/components/trades/TradesTable'

export default function TradesPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <TradesTable />
      </div>
    </MainLayout>
  )
}
