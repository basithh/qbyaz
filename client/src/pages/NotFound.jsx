import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--surface)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <p className="stat-value text-7xl gradient-text-gold mb-4">404</p>
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Page not found</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="flex items-center gap-2 mx-auto">
            <Home size={16} />
            Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
