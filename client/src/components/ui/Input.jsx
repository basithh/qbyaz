export default function Input({
  label,
  icon: Icon,
  error,
  helper,
  optional = false,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
          {label}
          {optional && <span className="text-[var(--text-muted)] normal-case font-normal ml-1">(optional)</span>}
        </label>
      )}
      <div className="relative">
        <input
          className={`q-input w-full rounded-2xl px-5 py-4 text-[15px] outline-none ${Icon ? 'pr-12' : ''} ${error ? 'border-[var(--error)]' : ''}`}
          {...props}
        />
        {Icon && (
          <Icon size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
        )}
      </div>
      {error && <p className="text-xs text-[var(--error)] mt-1.5">{error}</p>}
      {helper && !error && <p className="text-[10px] text-[var(--text-muted)] mt-1.5">{helper}</p>}
    </div>
  )
}
