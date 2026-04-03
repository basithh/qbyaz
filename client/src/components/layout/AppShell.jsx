import Sidebar from './Sidebar'
import MobileHeader from './MobileHeader'
import MobileNav from './MobileNav'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex bg-[var(--surface-secondary)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileHeader />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
