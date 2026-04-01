import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Users, Wifi, WifiOff } from 'lucide-react'
import AnimatedCounter from '../components/AnimatedCounter'
import { useSSE } from '../hooks/useSSE'

export default function PublicDisplay() {
  const { slug } = useParams()
  const { queueState, connected } = useSSE(slug)

  if (!queueState) {
    return (
      <div className="min-h-screen flex items-center justify-center ambient-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const current = queueState.currentlyServing
  const upcoming = queueState.pending?.slice(0, 5) || []

  return (
    <div className="min-h-screen ambient-bg flex flex-col p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{queueState.sessionName}</h1>
          {queueState.sessionLocation && (
            <p className="text-sm text-slate-400 mt-0.5">{queueState.sessionLocation}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
            <Users size={16} className="text-slate-400" />
            <span className="text-sm text-slate-300">
              <span className="font-mono font-bold text-white">{queueState.totalWaiting}</span> waiting
            </span>
          </div>
          {connected ? (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <Wifi size={12} /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <WifiOff size={12} />
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-stretch">
        {/* Now Serving - Large */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80 font-semibold mb-4">
              Now Serving
            </p>

            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={current.tokenNumber}
                  initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
                  animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotateX: 90 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto pulse-ring-amber">
                    <span className="font-mono text-8xl md:text-9xl font-bold text-amber-300">
                      {current.tokenNumber}
                    </span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-white font-semibold mt-6"
                  >
                    {current.name}
                  </motion.p>
                  {current.purpose && (
                    <p className="text-sm text-slate-400 mt-1">{current.purpose}</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-white/5 border-2 border-white/10 flex items-center justify-center mx-auto"
                >
                  <div className="text-center">
                    <Clock size={48} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Waiting to start</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="md:hidden h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Up Next */}
        <div className="w-full md:w-80 lg:w-96">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-400/80 font-semibold mb-4">
            Up Next
          </p>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {upcoming.length > 0 ? (
                upcoming.map((token, i) => (
                  <motion.div
                    key={token.id}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`glass-light rounded-xl p-4 flex items-center gap-4
                      ${i === 0 ? 'border border-indigo-500/20' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg
                      ${i === 0 ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-400'}`}
                    >
                      {token.tokenNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${i === 0 ? 'text-white' : 'text-slate-300'}`}>
                        {token.name}
                      </p>
                      {token.purpose && (
                        <p className="text-xs text-slate-500 truncate">{token.purpose}</p>
                      )}
                    </div>
                    {i === 0 && (
                      <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                        Next
                      </span>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-slate-500 text-sm"
                >
                  No one in queue
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-auto pt-6 flex items-center justify-center gap-4 sm:gap-8 text-xs text-slate-500">
        <span>Total Served: <span className="font-mono text-emerald-400">{queueState.totalServed}</span></span>
        <span>Waiting: <span className="font-mono text-indigo-400">{queueState.totalWaiting}</span></span>
        <span className="text-[10px]">QBYAZ Queue System</span>
      </div>
    </div>
  )
}
