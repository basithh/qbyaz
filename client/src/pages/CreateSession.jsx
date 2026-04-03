import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, MapPin, ArrowLeft, LayoutDashboard, Monitor, QrCode } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
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
      <PageTransition className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg">
          <Card variant="elevated" className="text-center p-8 sm:p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-[var(--success-light)] flex items-center justify-center mx-auto mb-5"
            >
              <motion.svg
                width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.svg>
            </motion.div>

            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{session.name}</h1>
            {session.location && (
              <p className="text-[var(--text-secondary)] text-sm flex items-center justify-center gap-1.5 mb-8">
                <MapPin size={14} /> {session.location}
              </p>
            )}
            {!session.location && <div className="mb-8" />}

            <QRCodeDisplay slug={session.slug} />

            <p className="text-xs text-[var(--text-muted)] mt-5 mb-8">
              Customers scan this QR code to join the queue
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate(`/admin/${session.slug}`)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={16} />
                Open Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/display/${session.slug}`)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Monitor size={16} />
                Public Display
              </Button>
            </div>
          </Card>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="flex-1 w-full max-w-6xl mx-auto p-6 sm:p-12 lg:p-16 xl:p-24">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-12 lg:mb-16">
        <div className="p-2 rounded-full bg-[var(--surface-secondary)] group-hover:bg-[var(--border-primary)] transition-colors">
          <ArrowLeft size={16} />
        </div>
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        {/* Left Structure: Premium Hero Statement */}
        <div className="lg:col-span-5 pt-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-light)] border border-[rgba(212,165,40,0.2)] text-[var(--color-gold-600)] text-xs font-bold uppercase tracking-widest mb-8">
              <QrCode size={12} />
              Setup
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6">
              Create a <br/>
              <span className="gradient-text-gold">New Session</span>
            </h1>
            
            <p className="text-[var(--text-secondary)] text-[15px] sm:text-base leading-relaxed mb-10 max-w-md">
              Initiate a powerful queuing architecture for your business. Provide a striking name and an optional physical location to instantly generate your live customer dashboard.
            </p>

            <div className="hidden lg:flex items-center gap-6 text-[var(--text-muted)] mt-16 pt-16 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-primary)] flex items-center justify-center">
                    <Zap size={18} className="text-[var(--text-secondary)]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">Instant</h4>
                    <p className="text-[10px]">Zero-delay routing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-primary)] flex items-center justify-center">
                    <LayoutDashboard size={18} className="text-[var(--text-secondary)]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">Analytics</h4>
                    <p className="text-[10px]">Real-time data</p>
                  </div>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Right Structure: Form Input Platform */}
        <div className="lg:col-span-7">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card variant="elevated" className="p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
              {/* Premium Glow effect behind form */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--color-gold-500)] opacity-10 rounded-full blur-[80px] pointer-events-none"></div>

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
                <Input
                  label="Session Identifier"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Morning Triage, VIP Entrance"
                  required
                  icon={Zap}
                />

                <Input
                  label="Geographic Location"
                  optional
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Floor 3, Building B"
                  icon={MapPin}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium text-[var(--error)] bg-[var(--error-light)] border border-[rgba(220,38,38,0.2)] rounded-2xl px-5 py-4"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={!name.trim()}
                    size="lg"
                    className="w-full flex items-center justify-center gap-3 py-5 text-base"
                  >
                    Deploy Session Infrastructure
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
