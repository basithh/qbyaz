import Badge from './ui/Badge'

const statusConfig = {
  PENDING: { variant: 'neutral', label: 'Waiting' },
  IN_PROGRESS: { variant: 'gold', label: 'Serving', dot: true, pulse: true },
  COMPLETED: { variant: 'success', label: 'Done' },
  SKIPPED: { variant: 'error', label: 'Skipped' },
}

export default function TokenBadge({ status }) {
  const config = statusConfig[status] || statusConfig.PENDING
  return (
    <Badge variant={config.variant} dot={config.dot} pulse={config.pulse}>
      {config.label}
    </Badge>
  )
}
