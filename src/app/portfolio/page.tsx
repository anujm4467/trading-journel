import { MainLayout } from '@/components/layout/MainLayout'
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview'

export default function PortfolioPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <PortfolioOverview />
      </div>
    </MainLayout>
  )
}
