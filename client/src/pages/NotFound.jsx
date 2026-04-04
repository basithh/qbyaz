import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, QrCode } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--surface)] ambient-gold">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center mx-auto mb-8 shadow-lg"
          style={{ boxShadow: '0 8px 32px rgba(212, 165, 40, 0.25)' }}>
          <QrCode size={28} className="text-white" />
        </div>
        <p className="stat-value text-8xl sm:text-9xl gradient-text-gold mb-6">404</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">Page not found</h1>
        <p className="text-[var(--text-secondary)] text-[15px] mb-10 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg" className="flex items-center gap-2.5 mx-auto">
            <Home size={18} />
            Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
