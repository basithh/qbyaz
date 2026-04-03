import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-16 ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface-inset)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto mb-5">
          <Icon size={28} className="text-[var(--text-muted)]" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1.5">{title}</h3>
      {description && <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-xs mx-auto">{description}</p>}
      {action}
    </motion.div>
  )
}
