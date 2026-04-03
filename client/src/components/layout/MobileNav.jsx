import { NavLink } from 'react-router-dom'
import { LayoutGrid, Plus, BarChart3, Settings } from 'lucide-react'

const items = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Queues' },
  { to: '/dashboard/new', icon: Plus, label: 'New' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-nav">
      <div className="flex items-center justify-around px-2 py-1 safe-area-bottom">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `mobile-nav-item flex-1 ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
