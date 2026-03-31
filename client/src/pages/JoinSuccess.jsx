import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Users, CheckCircle2, Wifi, WifiOff } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassPanel from '../components/GlassPanel'
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
    <PageTransition className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Connection status */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {connected ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <Wifi size={10} /> Live updates active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-amber-400">
              <WifiOff size={10} /> Reconnecting...
            </span>
          )}
        </div>

        {/* Token Display */}
        <GlassPanel className="text-center mb-4">
          {/* Token Number */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-28 h-28 rounded-2xl flex items-center justify-center mx-auto mb-4
              ${isMyTurn
                ? 'bg-amber-500/20 pulse-ring-amber'
                : isDone
                  ? 'bg-emerald-500/20'
                  : 'bg-indigo-500/20 pulse-ring'
              }`}
          >
            <span className={`font-mono text-5xl font-bold
              ${isMyTurn ? 'text-amber-300' : isDone ? 'text-emerald-300' : 'text-indigo-300'}`}>
              {myToken?.tokenNumber ?? '—'}
            </span>
          </motion.div>

          <h2 className="text-lg font-semibold text-white mb-1">
            {myToken?.name ?? 'Loading...'}
          </h2>

          {myToken && <TokenBadge status={myToken.status} />}

          {/* Your Turn Banner */}
          {isMyTurn && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mt-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/30"
            >
              <p className="text-amber-300 font-bold text-lg">It's Your Turn!</p>
              <p className="text-amber-200/70 text-xs mt-1">Please proceed to the counter</p>
            </motion.div>
          )}

          {isDone && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20"
            >
              <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-1" />
              <p className="text-emerald-300 font-semibold">Completed</p>
              <p className="text-emerald-200/60 text-xs mt-1">Thank you for your visit</p>
            </motion.div>
          )}
        </GlassPanel>

        {/* Queue Info */}
        {!isDone && !isMyTurn && queueState && (
          <div className="grid grid-cols-2 gap-3">
            <GlassPanel className="text-center !p-4">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] mb-2">
                <Users size={12} />
                Position
              </div>
              <AnimatedCounter
                value={position > 0 ? position : '—'}
                className="text-2xl text-white"
              />
            </GlassPanel>

            <GlassPanel className="text-center !p-4">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] mb-2">
                <Clock size={12} />
                Now Serving
              </div>
              <AnimatedCounter
                value={queueState.currentlyServing?.tokenNumber ?? '—'}
                className="text-2xl text-amber-300"
              />
            </GlassPanel>
          </div>
        )}

        <p className="text-center text-[10px] text-slate-600 mt-6">
          This page updates automatically
        </p>
      </div>
    </PageTransition>
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
