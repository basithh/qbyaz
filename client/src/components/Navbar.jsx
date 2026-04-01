import { Link, useNavigate } from 'react-router-dom'
import { QrCode, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="glass border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-indigo-300 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <QrCode size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm">QBYAZ</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
