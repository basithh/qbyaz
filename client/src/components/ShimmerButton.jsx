import Button from './ui/Button'

// Legacy wrapper - delegates to new Button component
export default function ShimmerButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const variantMap = {
    primary: 'primary',
    ghost: 'ghost',
    success: 'primary',
    danger: 'danger',
  }
  return (
    <Button
      variant={variantMap[variant] || 'primary'}
      size={size}
      loading={loading}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </Button>
  )
}
