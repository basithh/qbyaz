import { motion } from 'framer-motion'

const variantClasses = {
  gold: 'badge-gold',
  success: 'badge-success',
  error: 'badge-error',
  neutral: 'badge-neutral',
}

export default function Badge({ children, variant = 'neutral', dot = false, pulse = false, className = '' }) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`badge ${variantClasses[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current ${pulse ? 'animate-pulse' : ''}`} />
      )}
      {children}
    </motion.span>
  )
}
