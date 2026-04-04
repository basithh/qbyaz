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
    <aside className="hidden md:flex w-[260px] shrink-0 flex-col h-screen sticky top-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]">
      {/* Logo */}
      <div className="px-6 h-[72px] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center shadow-sm"
          style={{ boxShadow: '0 4px 16px rgba(212, 165, 40, 0.2)' }}>
          <QrCode size={16} className="text-white" />
        </div>
        <span className="font-bold text-[15px] tracking-wide text-[var(--text-primary)]">QBYAZ</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-3 space-y-1.5">
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
      <div className="px-4 pb-5 space-y-3">
        <div className="flex items-center justify-between px-2">
          <ThemeToggle />
        </div>
        <div className="divider" />
        <div className="flex items-center gap-3 px-3 py-3">
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className="text-[11px] text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-light)] transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </motion.button>
        </div>
      </div>
    </aside>
  )
}
