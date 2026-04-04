import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight, QrCode, Users, BarChart3 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

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
    <div className="min-h-screen flex bg-[var(--surface)] ambient-gold">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold-600)] to-[var(--color-gold-800)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <QrCode size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">QBYAZ</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] mb-6">
            Start managing<br />
            <span className="text-white/70">your queues today.</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md">
            Create your admin account to unlock powerful queue management tools designed for clinics, labs, events, and more.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Users size={16} className="text-white/80" />
            </div>
            <div>
              <p className="text-white/90 text-xs font-semibold">Multi-queue</p>
              <p className="text-white/40 text-[10px]">Unlimited sessions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <BarChart3 size={16} className="text-white/80" />
            </div>
            <div>
              <p className="text-white/90 text-xs font-semibold">Analytics</p>
              <p className="text-white/40 text-[10px]">Full insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[480px]"
        >
          <div className="lg:hidden text-center mb-12">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ boxShadow: '0 8px 32px rgba(212, 165, 40, 0.3)' }}>
              <QrCode size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text-gold">QBYAZ</h1>
            <p className="text-[var(--text-muted)] text-xs mt-1">Smart Queue Management</p>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">Create account</h2>
            <p className="text-[var(--text-secondary)] text-[15px]">Set up your admin profile</p>
          </div>

          <Card variant="elevated" className="p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-gold-500)] opacity-[0.04] rounded-full blur-[60px] pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                icon={User}
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                icon={Mail}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                icon={Lock}
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
                  loading={loading}
                  disabled={!name.trim() || !email.trim() || !password.trim()}
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  Create Account
                  <ArrowRight size={16} />
                </Button>
              </div>
            </form>
          </Card>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
