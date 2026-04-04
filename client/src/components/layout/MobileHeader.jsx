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
    <header className="md:hidden sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--border-subtle)]">
      <div className="flex items-center justify-between px-5 h-16">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center"
            style={{ boxShadow: '0 3px 12px rgba(212, 165, 40, 0.2)' }}>
            <QrCode size={14} className="text-white" />
          </div>
          <span className="font-bold text-[15px] text-[var(--text-primary)] tracking-wide">QBYAZ</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Avatar name={user?.name} size="xs" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
          >
            <LogOut size={16} />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
