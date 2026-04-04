import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, MessageSquare, Tag, Phone, ArrowRight, MapPin, AlertCircle, Users, QrCode } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Spinner from '../components/ui/Spinner'
import { api } from '../api/client'

export default function JoinQueue() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', purpose: '', category: '', phone: '' })

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
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <Spinner size="lg" className="text-[var(--accent)]" />
      </div>
    )
  }

  if (error && !session) {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center p-6 bg-[var(--surface)]">
        <Card variant="elevated" className="max-w-sm text-center p-10 sm:p-12">
          <div className="w-18 h-18 rounded-2xl bg-[var(--error-light)] flex items-center justify-center mx-auto mb-6" style={{ width: 72, height: 72 }}>
            <AlertCircle size={32} className="text-[var(--error)]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">Queue Not Found</h2>
          <p className="text-[var(--text-secondary)] text-[15px]">{error}</p>
        </Card>
      </PageTransition>
    )
  }

  if (session?.status === 'CLOSED') {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center p-6 bg-[var(--surface)]">
        <Card variant="elevated" className="max-w-sm text-center p-10 sm:p-12">
          <div className="w-18 h-18 rounded-2xl bg-[var(--warning-light)] flex items-center justify-center mx-auto mb-6" style={{ width: 72, height: 72 }}>
            <AlertCircle size={32} className="text-[var(--warning)]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">Queue Closed</h2>
          <p className="text-[var(--text-secondary)] text-[15px]">This session is no longer accepting new entries.</p>
        </Card>
      </PageTransition>
    )
  }

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-5 sm:px-8 py-12 sm:py-8 ambient-gold bg-[var(--surface)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px]"
      >
        {/* Session Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center mx-auto mb-5 shadow-lg"
            style={{ boxShadow: '0 8px 32px rgba(212, 165, 40, 0.3)' }}
          >
            <Users size={28} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">{session.name}</h1>
          {session.location && (
            <p className="text-[var(--text-muted)] text-sm flex items-center justify-center gap-1.5 mt-2">
              <MapPin size={13} /> {session.location}
            </p>
          )}
        </motion.div>

        {/* Form */}
        <Card variant="elevated" className="p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-gold-500)] opacity-[0.04] rounded-full blur-[60px] pointer-events-none" />

          <div className="mb-8 relative z-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-1.5 tracking-tight">Join the Queue</h2>
            <p className="text-[var(--text-secondary)] text-[15px]">Fill in your details to get a token</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <Input
              label="Name"
              type="text"
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              placeholder="Your name"
              required
              icon={User}
            />

            <Input
              label="Purpose"
              optional
              type="text"
              value={form.purpose}
              onChange={(e) => updateForm('purpose', e.target.value)}
              placeholder="Brief description of your visit"
              icon={MessageSquare}
            />

            <Select
              label="Category"
              optional
              value={form.category}
              onChange={(e) => updateForm('category', e.target.value)}
            >
              <option value="">General</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="new-visit">New Visit</option>
              <option value="urgent">Urgent</option>
            </Select>

            <Input
              label="Phone"
              optional
              type="tel"
              value={form.phone}
              onChange={(e) => updateForm('phone', e.target.value)}
              placeholder="+91 98765 43210"
              icon={Phone}
              helper="Opt-in to receive queue updates via WhatsApp"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-[var(--error)] bg-[var(--error-light)] border border-[rgba(220,38,38,0.15)] rounded-2xl px-5 py-4"
              >
                {error}
              </motion.div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                loading={submitting}
                disabled={!form.name.trim()}
                size="lg"
                className="w-full flex items-center justify-center gap-2"
              >
                Join Queue
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-[11px] text-[var(--text-muted)] mt-10">
          Powered by <span className="font-semibold gradient-text-gold">QBYAZ</span>
        </p>
      </motion.div>
    </div>
  )
}
