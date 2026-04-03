import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, Plus, BarChart3, Settings, LogOut, QrCode } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import ThemeToggle from '../ui/ThemeToggle'

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'My Queues' },
  { to: '/dashboard/new', icon: Plus, label: 'New Queue' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col h-screen sticky top-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center shadow-sm">
          <QrCode size={15} className="text-white" />
        </div>
        <span className="font-bold text-sm tracking-wide text-[var(--text-primary)]">QBYAZ</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-2">
        <div className="flex items-center justify-between px-2">
          <ThemeToggle />
        </div>
        <div className="divider" />
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className="text-[11px] text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-light)] transition-colors"
            title="Logout"
          >
            <LogOut size={15} />
          </motion.button>
        </div>
      </div>
    </aside>
  )
}
