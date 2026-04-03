import { ChevronDown } from 'lucide-react'

export default function Select({ label, optional = false, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
          {label}
          {optional && <span className="text-[var(--text-muted)] normal-case font-normal ml-1">(optional)</span>}
        </label>
      )}
      <div className="relative">
        <select
          className="q-input w-full rounded-xl px-4 py-3 text-sm outline-none appearance-none pr-11"
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
      </div>
    </div>
  )
}
