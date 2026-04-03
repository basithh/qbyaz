import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, MessageSquare, Tag, Phone, ArrowRight, MapPin, AlertCircle, Users } from 'lucide-react'
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
      <PageTransition className="min-h-screen flex items-center justify-center p-4 bg-[var(--surface)]">
        <Card variant="elevated" className="max-w-sm text-center p-8">
          <div className="w-14 h-14 rounded-full bg-[var(--error-light)] flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-[var(--error)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Queue Not Found</h2>
          <p className="text-sm text-[var(--text-secondary)]">{error}</p>
        </Card>
      </PageTransition>
    )
  }

  if (session?.status === 'CLOSED') {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center p-4 bg-[var(--surface)]">
        <Card variant="elevated" className="max-w-sm text-center p-8">
          <div className="w-14 h-14 rounded-full bg-[var(--warning-light)] flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-[var(--warning)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Queue Closed</h2>
          <p className="text-sm text-[var(--text-secondary)]">This session is no longer accepting new entries.</p>
        </Card>
      </PageTransition>
    )
  }

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-4 sm:px-6 py-10 sm:py-6 ambient-gold bg-[var(--surface)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px]"
      >
        {/* Session Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ boxShadow: '0 8px 24px rgba(212, 165, 40, 0.25)' }}
          >
            <Users size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{session.name}</h1>
          {session.location && (
            <p className="text-[var(--text-muted)] text-xs flex items-center justify-center gap-1.5 mt-1.5">
              <MapPin size={12} /> {session.location}
            </p>
          )}
        </motion.div>

        {/* Form */}
        <Card variant="elevated" className="p-7 sm:p-8">
          <div className="mb-7">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Join the Queue</h2>
            <p className="text-sm text-[var(--text-secondary)]">Fill in your details to get a token</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="text-sm text-[var(--error)] bg-[var(--error-light)] rounded-xl px-4 py-3"
              >
                {error}
              </motion.div>
            )}

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
          </form>
        </Card>

        <p className="text-center text-[10px] text-[var(--text-muted)] mt-8">
          Powered by QBYAZ
        </p>
      </motion.div>
    </div>
  )
}
