import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight, QrCode } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

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
    <div className="min-h-screen flex items-start sm:items-center justify-center px-4 sm:px-6 py-12 sm:py-6 ambient-gold bg-[var(--surface)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px]"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.2 }}
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ boxShadow: '0 8px 24px rgba(212, 165, 40, 0.25)' }}
          >
            <QrCode size={24} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold gradient-text-gold mb-1">QBYAZ</h1>
          <p className="text-[var(--text-muted)] text-xs tracking-wide">Smart Queue Management</p>
        </motion.div>

        {/* Card */}
        <div className="card-elevated rounded-2xl p-7 sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">Create account</h2>
            <p className="text-sm text-[var(--text-secondary)]">Set up your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              icon={User}
            />

            <Input
              label="Email"
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
                className="text-sm text-[var(--error)] bg-[var(--error-light)] rounded-xl px-4 py-3"
              >
                {error}
              </motion.div>
            )}

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
          </form>

          <div className="divider my-7" />

          <p className="text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-[var(--text-muted)] mt-8">
          Powered by QBYAZ
        </p>
      </motion.div>
    </div>
  )
}
