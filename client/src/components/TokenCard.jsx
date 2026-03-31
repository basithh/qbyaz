import { motion } from 'framer-motion'
import TokenBadge from './TokenBadge'
import { User, MessageSquare, Tag, Phone } from 'lucide-react'

export default function TokenCard({ token, actions, index = 0 }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-light rounded-xl p-4 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Token Number */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-lg
          ${token.status === 'IN_PROGRESS'
            ? 'bg-amber-500/20 text-amber-300 pulse-ring-amber'
            : token.status === 'COMPLETED'
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-indigo-500/20 text-indigo-300'
          }`}
        >
          {token.tokenNumber}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white truncate">{token.name}</span>
            <TokenBadge status={token.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {token.purpose && (
              <span className="flex items-center gap-1 truncate">
                <MessageSquare size={10} />
                {token.purpose}
              </span>
            )}
            {token.category && token.category !== 'general' && (
              <span className="flex items-center gap-1">
                <Tag size={10} />
                {token.category}
              </span>
            )}
            {token.phone && (
              <span className="flex items-center gap-1">
                <Phone size={10} />
                {token.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
