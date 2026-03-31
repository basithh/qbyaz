import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QrCode, MapPin, Zap, ArrowRight, LayoutDashboard, Monitor } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassPanel from '../components/GlassPanel'
import ShimmerButton from '../components/ShimmerButton'
import QRCodeDisplay from '../components/QRCodeDisplay'
import { api } from '../api/client'

export default function CreateSession() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.createSession({ name, location: location || null })
      setSession(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (session) {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <GlassPanel className="text-center">
            {/* Success checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
            >
              <motion.svg
                width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.svg>
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-1">{session.name}</h1>
            {session.location && (
              <p className="text-slate-400 text-sm flex items-center justify-center gap-1 mb-6">
                <MapPin size={14} /> {session.location}
              </p>
            )}

            <QRCodeDisplay slug={session.slug} />

            <p className="text-xs text-slate-500 mt-4 mb-6">
              Customers scan this QR code to join the queue
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <ShimmerButton
                onClick={() => navigate(`/admin/${session.slug}`)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={16} />
                Open Dashboard
              </ShimmerButton>
              <ShimmerButton
                variant="ghost"
                onClick={() => navigate(`/display/${session.slug}`)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Monitor size={16} />
                Public Display
              </ShimmerButton>
            </div>
          </GlassPanel>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Hero */}
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

        {/* Form */}
        <GlassPanel>
          <h2 className="text-lg font-semibold text-white mb-1">Create a Queue Session</h2>
          <p className="text-sm text-slate-400 mb-6">Set up a new queue for your business</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Session Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Morning Queue, Support Desk"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500
                    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:shadow-lg focus:shadow-indigo-500/5
                    transition-all duration-200"
                />
                <Zap size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Location (optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Room 101, Front Desk"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500
                    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:shadow-lg focus:shadow-indigo-500/5
                    transition-all duration-200"
                />
                <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <ShimmerButton
              loading={loading}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              Create Session
              <ArrowRight size={16} />
            </ShimmerButton>
          </form>
        </GlassPanel>

        <p className="text-center text-xs text-slate-600 mt-6">
          Powered by QBYAZ Queue System
        </p>
      </div>
    </PageTransition>
  )
}
