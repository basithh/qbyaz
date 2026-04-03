import { Link, useNavigate } from 'react-router-dom'
import { QrCode, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import ThemeToggle from '../ui/ThemeToggle'

export default function MobileHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="md:hidden sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-lg border-b border-[var(--border-subtle)]">
      <div className="flex items-center justify-between px-4 h-14">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center">
            <QrCode size={13} className="text-white" />
          </div>
          <span className="font-bold text-sm text-[var(--text-primary)]">QBYAZ</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Avatar name={user?.name} size="xs" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
          >
            <LogOut size={16} />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
