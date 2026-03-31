import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AnimatedCounter({ value, className = '' }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  return (
    <div className={`relative overflow-hidden inline-flex ${className}`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayValue}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="font-mono font-bold"
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
