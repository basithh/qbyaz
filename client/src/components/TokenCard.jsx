import { motion } from 'framer-motion'
import TokenBadge from './TokenBadge'
import { MessageSquare, Tag, Phone } from 'lucide-react'

export default function TokenCard({ token, actions, index = 0 }) {
  const numberStyles = {
    IN_PROGRESS: 'bg-[var(--accent-light)] text-[var(--color-gold-600)] dark:text-[var(--color-gold-400)] pulse-gold',
    COMPLETED: 'bg-[var(--success-light)] text-[var(--success)]',
    SKIPPED: 'bg-[var(--error-light)] text-[var(--error)]',
    PENDING: 'bg-[var(--surface-inset)] text-[var(--text-secondary)]',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card rounded-2xl p-4 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-lg ${numberStyles[token.status] || numberStyles.PENDING}`}>
          {token.tokenNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{token.name}</span>
            <TokenBadge status={token.status} />
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
            {token.purpose && (
              <span className="flex items-center gap-1 truncate">
                <MessageSquare size={10} /> {token.purpose}
              </span>
            )}
            {token.category && token.category !== 'general' && (
              <span className="flex items-center gap-1">
                <Tag size={10} /> {token.category}
              </span>
            )}
            {token.phone && (
              <span className="flex items-center gap-1">
                <Phone size={10} /> {token.phone}
              </span>
            )}
          </div>
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </motion.div>
  )
}
