import { motion } from 'framer-motion'

const statusConfig = {
  PENDING: {
    bg: 'bg-slate-500/20',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    label: 'Waiting',
  },
  IN_PROGRESS: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
    label: 'Serving',
    pulse: true,
  },
  COMPLETED: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
    label: 'Done',
  },
  SKIPPED: {
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    dot: 'bg-red-400',
    label: 'Skipped',
  },
}

export default function TokenBadge({ status }) {
  const config = statusConfig[status] || statusConfig.PENDING

  return (
    <motion.span
      layout
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.pulse ? 'animate-pulse' : ''}`} />
      {config.label}
    </motion.span>
  )
}
