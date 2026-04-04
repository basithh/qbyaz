import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Users, CheckCircle2, WifiOff } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import AnimatedCounter from '../components/AnimatedCounter'
import TokenBadge from '../components/TokenBadge'
import { useSSE } from '../hooks/useSSE'

export default function JoinSuccess() {
  const { slug, tokenId } = useParams()
  const { queueState, connected } = useSSE(slug)

  const myToken = findMyToken(queueState, Number(tokenId))
  const position = getPosition(queueState, Number(tokenId))
  const isMyTurn = myToken?.status === 'IN_PROGRESS'
  const isDone = myToken?.status === 'COMPLETED'

  return (
    <div className="min-h-screen flex items-center justify-center p-5 sm:p-8 ambient-gold bg-[var(--surface)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px]"
      >
        {/* Connection */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {connected ? (
            <Badge variant="success" dot pulse>Live updates</Badge>
          ) : (
            <Badge variant="neutral" dot>
              <WifiOff size={10} /> Reconnecting...
            </Badge>
          )}
        </div>

        {/* Token Display */}
        <Card variant="elevated" className="text-center mb-5 p-10 sm:p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-gold-500)] opacity-[0.04] rounded-full blur-[60px] pointer-events-none" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-36 h-36 sm:w-40 sm:h-40 rounded-3xl flex items-center justify-center mx-auto mb-6 relative z-10 ${
              isMyTurn
                ? 'bg-[var(--accent-light)] pulse-gold glow-gold'
                : isDone
                  ? 'bg-[var(--success-light)] glow-success'
                  : 'bg-[var(--surface-inset)]'
            }`}
          >
            <span className={`font-mono text-6xl sm:text-7xl font-bold ${
              isMyTurn ? 'gradient-text-gold' : isDone ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'
            }`}>
              {myToken?.tokenNumber ?? '...'}
            </span>
          </motion.div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight relative z-10">
            {myToken?.name ?? 'Loading...'}
          </h2>

          <div className="relative z-10">
            {myToken && <TokenBadge status={myToken.status} />}
          </div>

          {/* Your Turn */}
          {isMyTurn && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mt-8 serving-highlight rounded-2xl p-6 sm:p-7 relative z-10"
            >
              <p className="gradient-text-gold font-extrabold text-xl sm:text-2xl">It's Your Turn!</p>
              <p className="text-[var(--text-muted)] text-sm mt-1.5">Please proceed to the counter</p>
            </motion.div>
          )}

          {isDone && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 bg-[var(--success-light)] rounded-2xl p-6 sm:p-7 relative z-10"
            >
              <CheckCircle2 size={28} className="text-[var(--success)] mx-auto mb-2.5" />
              <p className="text-[var(--success)] font-bold text-lg">Completed</p>
              <p className="text-[var(--text-muted)] text-sm mt-1">Thank you for your visit</p>
            </motion.div>
          )}
        </Card>

        {/* Queue Info */}
        {!isDone && !isMyTurn && queueState && (
          <div className="grid grid-cols-2 gap-4">
            <Card padding={false} className="text-center p-6 sm:p-7">
              <div className="flex items-center justify-center gap-1.5 text-[var(--text-muted)] text-[10px] sm:text-[11px] mb-3 uppercase tracking-wider font-semibold">
                <Users size={12} /> Position
              </div>
              <AnimatedCounter
                value={position > 0 ? position : '...'}
                className="text-3xl sm:text-4xl text-[var(--text-primary)]"
              />
            </Card>
            <Card padding={false} className="text-center p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-[var(--color-gold-500)] opacity-[0.05] rounded-full blur-[30px] pointer-events-none" />
              <div className="flex items-center justify-center gap-1.5 text-[var(--text-muted)] text-[10px] sm:text-[11px] mb-3 uppercase tracking-wider font-semibold">
                <Clock size={12} /> Serving
              </div>
              <AnimatedCounter
                value={queueState.currentlyServing?.tokenNumber ?? '—'}
                className="text-3xl sm:text-4xl gradient-text-gold"
              />
            </Card>
          </div>
        )}

        <p className="text-center text-[11px] text-[var(--text-muted)] mt-10">
          Updates automatically
        </p>
      </motion.div>
    </div>
  )
}

function findMyToken(queueState, tokenId) {
  if (!queueState) return null
  const all = [
    queueState.currentlyServing,
    ...(queueState.pending || []),
    ...(queueState.completed || []),
  ].filter(Boolean)
  return all.find(t => t.id === tokenId) || null
}

function getPosition(queueState, tokenId) {
  if (!queueState?.pending) return 0
  const idx = queueState.pending.findIndex(t => t.id === tokenId)
  return idx >= 0 ? idx + 1 : 0
}
