import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, MessageSquare, Tag, Phone, ArrowRight, MapPin, AlertCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassPanel from '../components/GlassPanel'
import ShimmerButton from '../components/ShimmerButton'
import { api } from '../api/client'

export default function JoinQueue() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    purpose: '',
    category: '',
    phone: '',
  })

  useEffect(() => {
    api.getSession(slug)
      .then(setSession)
      .catch(() => setError('Session not found or has been closed'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const token = await api.createToken(slug, {
        name: form.name,
        purpose: form.purpose || null,
        category: form.category || null,
        phone: form.phone || null,
      })
      navigate(`/join/${slug}/status/${token.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error && !session) {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center p-4">
        <GlassPanel className="max-w-sm text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Queue Not Found</h2>
          <p className="text-sm text-slate-400">{error}</p>
        </GlassPanel>
      </PageTransition>
    )
  }

  if (session?.status === 'CLOSED') {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center p-4">
        <GlassPanel className="max-w-sm text-center">
          <AlertCircle size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Queue Closed</h2>
          <p className="text-sm text-slate-400">This session is no longer accepting new entries.</p>
        </GlassPanel>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Session Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/25">
            <User size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">{session.name}</h1>
          {session.location && (
            <p className="text-slate-400 text-xs flex items-center justify-center gap-1 mt-1">
              <MapPin size={12} /> {session.location}
            </p>
          )}
        </motion.div>

        {/* Join Form */}
        <GlassPanel>
          <h2 className="text-base font-semibold text-white mb-1">Join the Queue</h2>
          <p className="text-xs text-slate-400 mb-5">Fill in your details to get a token</p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Name *</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500
                    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                <User size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Purpose (optional)</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.purpose}
                  onChange={(e) => updateForm('purpose', e.target.value)}
                  placeholder="Brief description of your visit"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500
                    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                <MessageSquare size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category (optional)</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => updateForm('category', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white appearance-none
                    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                >
                  <option value="" className="bg-slate-800">General</option>
                  <option value="consultation" className="bg-slate-800">Consultation</option>
                  <option value="follow-up" className="bg-slate-800">Follow-up</option>
                  <option value="new-visit" className="bg-slate-800">New Visit</option>
                  <option value="urgent" className="bg-slate-800">Urgent</option>
                </select>
                <Tag size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Phone (optional — for WhatsApp updates)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500
                    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Opt-in to receive queue updates via WhatsApp</p>
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
              loading={submitting}
              disabled={!form.name.trim()}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              Join Queue
              <ArrowRight size={16} />
            </ShimmerButton>
          </form>
        </GlassPanel>
      </div>
    </PageTransition>
  )
}
