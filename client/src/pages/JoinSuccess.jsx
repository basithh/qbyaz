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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 ambient-gold bg-[var(--surface)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Connection */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {connected ? (
            <Badge variant="success" dot pulse>Live updates</Badge>
          ) : (
            <Badge variant="neutral" dot>
              <WifiOff size={10} /> Reconnecting...
            </Badge>
          )}
        </div>

        {/* Token Display */}
        <Card variant="elevated" className="text-center mb-4 p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-5 ${
              isMyTurn
                ? 'bg-[var(--accent-light)] pulse-gold glow-gold'
                : isDone
                  ? 'bg-[var(--success-light)] glow-success'
                  : 'bg-[var(--surface-inset)]'
            }`}
          >
            <span className={`font-mono text-5xl font-bold ${
              isMyTurn ? 'gradient-text-gold' : isDone ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'
            }`}>
              {myToken?.tokenNumber ?? '...'}
            </span>
          </motion.div>

          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {myToken?.name ?? 'Loading...'}
          </h2>

          {myToken && <TokenBadge status={myToken.status} />}

          {/* Your Turn */}
          {isMyTurn && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mt-6 serving-highlight rounded-2xl p-5"
            >
              <p className="gradient-text-gold font-bold text-lg">It's Your Turn!</p>
              <p className="text-[var(--text-muted)] text-xs mt-1">Please proceed to the counter</p>
            </motion.div>
          )}

          {isDone && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 bg-[var(--success-light)] rounded-2xl p-5"
            >
              <CheckCircle2 size={24} className="text-[var(--success)] mx-auto mb-2" />
              <p className="text-[var(--success)] font-semibold">Completed</p>
              <p className="text-[var(--text-muted)] text-xs mt-1">Thank you for your visit</p>
            </motion.div>
          )}
        </Card>

        {/* Queue Info */}
        {!isDone && !isMyTurn && queueState && (
          <div className="grid grid-cols-2 gap-3">
            <Card padding={false} className="text-center p-5">
              <div className="flex items-center justify-center gap-1.5 text-[var(--text-muted)] text-[10px] mb-2.5 uppercase tracking-wider font-semibold">
                <Users size={11} /> Position
              </div>
              <AnimatedCounter
                value={position > 0 ? position : '...'}
                className="text-2xl text-[var(--text-primary)]"
              />
            </Card>
            <Card padding={false} className="text-center p-5">
              <div className="flex items-center justify-center gap-1.5 text-[var(--text-muted)] text-[10px] mb-2.5 uppercase tracking-wider font-semibold">
                <Clock size={11} /> Serving
              </div>
              <AnimatedCounter
                value={queueState.currentlyServing?.tokenNumber ?? '—'}
                className="text-2xl gradient-text-gold"
              />
            </Card>
          </div>
        )}

        <p className="text-center text-[10px] text-[var(--text-muted)] mt-8">
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
