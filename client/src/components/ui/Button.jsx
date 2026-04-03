import { motion } from 'framer-motion'

const variants = {
  primary: 'btn-gold',
  secondary: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const sizes = {
  xs: 'text-xs px-4 py-2 rounded-xl tracking-wide',
  sm: 'text-sm px-5 py-2.5 rounded-xl tracking-wide',
  md: 'text-[15px] px-8 py-4 rounded-2xl tracking-wide',
  lg: 'text-[16px] px-10 py-5 rounded-[20px] tracking-wide',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      whileHover={!loading && !disabled ? { scale: 1.01, y: -1 } : {}}
      whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
      type={type}
      disabled={loading || disabled}
      className={`${variants[variant]} ${sizes[size]} font-semibold transition-all duration-200 ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {typeof children === 'string' ? children : 'Loading...'}
        </span>
      ) : children}
    </motion.button>
  )
}
