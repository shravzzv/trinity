import AppBottomNav from '@/components/app-bottom-nav'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { FastingProvider } from '@/providers/fasting-provider'
import { GamificationProvider } from '@/providers/gamification-provider'
import { WeightProvider } from '@/providers/weight-provider'
import { cookies } from 'next/headers'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <FastingProvider>
      <WeightProvider>
        <GamificationProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className='mx-auto w-full max-w-xl p-6'>{children}</main>
            <AppBottomNav />
          </SidebarProvider>
        </GamificationProvider>
      </WeightProvider>
    </FastingProvider>
  )
}
