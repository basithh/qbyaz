import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight, QrCode, AlertCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassPanel from '../components/GlassPanel'
import ShimmerButton from '../components/ShimmerButton'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.register({ name, email, password })
      login(data.token, { name: data.name, email: data.email })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25"
          >
            <QrCode size={32} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">QBYAZ</h1>
          <p className="text-slate-400 text-sm">Smart Queue Management System</p>
        </motion.div>

        <GlassPanel className="p-6">
          <h2 className="text-lg font-semibold text-white mb-1">Create Account</h2>
          <p className="text-sm text-slate-400 mb-6">Set up your admin account to manage queues</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pr-10 py-3 text-sm text-white placeholder-slate-500
                    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pr-10 py-3 text-sm text-white placeholder-slate-500
                    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pr-10 py-3 text-sm text-white placeholder-slate-500
                    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <ShimmerButton
              loading={loading}
              disabled={!name.trim() || !email.trim() || !password.trim()}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              Create Account
              <ArrowRight size={16} />
            </ShimmerButton>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </GlassPanel>

        <p className="text-center text-xs text-slate-600 mt-6">
          Powered by QBYAZ Queue System
        </p>
      </div>
    </PageTransition>
  )
}
