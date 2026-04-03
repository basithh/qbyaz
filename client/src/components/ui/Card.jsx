import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = false,
  onClick,
  padding = true,
}) {
  const base = variant === 'elevated' ? 'card-elevated' : variant === 'gold' ? 'card-gold' : 'card'
  const hoverClass = hover || onClick ? 'card-hover' : ''
  const interactiveClass = onClick ? 'card-interactive' : ''
  const paddingClass = padding ? 'p-8 sm:p-10 lg:p-12' : ''

  const Component = hover || onClick ? motion.div : 'div'
  const motionProps = hover || onClick ? {
    whileHover: { y: -2 },
    whileTap: onClick ? { scale: 0.99 } : {},
  } : {}

  return (
    <Component
      className={`${base} ${hoverClass} ${interactiveClass} rounded-2xl ${paddingClass} ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  )
}
