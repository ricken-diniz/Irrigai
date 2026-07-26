import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'
import Header from '#/components/Header'
import BottomNav from '#/components/BottomNav'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw redirect({ to: '/login' })
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--irr-background)]">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
