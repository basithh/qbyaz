import Card from './ui/Card'

// Legacy wrapper - delegates to new Card component
export default function GlassPanel({ children, className = '', hover = false, onClick, variant = 'default' }) {
  const cardVariant = variant === 'flat' ? 'default' : 'elevated'
  return (
    <Card variant={cardVariant} hover={hover} onClick={onClick} className={className}>
      {children}
    </Card>
  )
}
