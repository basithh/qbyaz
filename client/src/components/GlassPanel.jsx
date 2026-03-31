import { motion } from 'framer-motion'

export default function GlassPanel({ children, className = '', hover = false, onClick }) {
  const Component = hover ? motion.div : 'div'
  const hoverProps = hover
    ? {
        whileHover: { y: -2, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.15)' },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 },
      }
    : {}

  return (
    <Component
      className={`glass rounded-2xl p-6 ${className}`}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </Component>
  )
}
