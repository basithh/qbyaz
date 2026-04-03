import { motion } from 'framer-motion'

export default function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 p-1 rounded-xl bg-[var(--surface-inset)] ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            active === tab.value
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          {active === tab.value && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute inset-0 bg-[var(--surface-elevated)] rounded-lg shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
