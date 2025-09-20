import { MainLayout } from '@/components/layout/MainLayout'
import { SettingsOverview } from '@/components/settings/SettingsOverview'

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <SettingsOverview />
      </div>
    </MainLayout>
  )
}
