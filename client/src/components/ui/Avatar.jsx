const sizes = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-14 h-14 text-base',
}

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U'

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center font-bold text-white shrink-0 ${className}`}
    >
      {initials}
    </div>
  )
}
