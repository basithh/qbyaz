import { Link, useNavigate } from 'react-router-dom'
import { QrCode, LogOut, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="glass border-b border-white/[0.06] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <QrCode size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-wide text-white/90 group-hover:text-white transition-colors">QBYAZ</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/dashboard/new"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <Plus size={14} />
            New Queue
          </Link>

          <div className="h-5 w-px bg-white/[0.06] hidden sm:block" />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center border border-white/10">
              <span className="text-[10px] font-bold text-indigo-300">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block max-w-[120px] truncate">{user?.name}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
            title="Logout"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </nav>
  )
}
