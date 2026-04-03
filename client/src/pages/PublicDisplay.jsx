import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Users, Wifi, WifiOff } from 'lucide-react'
import AnimatedCounter from '../components/AnimatedCounter'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { useSSE } from '../hooks/useSSE'

export default function PublicDisplay() {
  const { slug } = useParams()
  const { queueState, connected } = useSSE(slug)

  if (!queueState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <Spinner size="lg" className="text-[var(--accent)]" />
      </div>
    )
  }

  const current = queueState.currentlyServing
  const upcoming = queueState.pending?.slice(0, 5) || []

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-10 bg-[var(--surface)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">{queueState.sessionName}</h1>
          {queueState.sessionLocation && (
            <p className="text-sm text-[var(--text-muted)] mt-1">{queueState.sessionLocation}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="card rounded-2xl px-5 py-2.5 flex items-center gap-3">
            <Users size={16} className="text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-secondary)]">
              <span className="font-mono font-bold text-[var(--text-primary)]">{queueState.totalWaiting}</span> waiting
            </span>
          </div>
          {connected ? (
            <Badge variant="success" dot pulse>Live</Badge>
          ) : (
            <Badge variant="neutral" dot>Offline</Badge>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-stretch">
        {/* Now Serving */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] font-semibold mb-6">
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
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-[var(--accent-light)] border border-[var(--accent)]/20 flex items-center justify-center mx-auto pulse-gold glow-gold">
                    <span className="display-token-number text-8xl md:text-9xl">
                      {current.tokenNumber}
                    </span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-[var(--text-primary)] font-semibold mt-6"
                  >
                    {current.name}
                  </motion.p>
                  {current.purpose && (
                    <p className="text-sm text-[var(--text-muted)] mt-1">{current.purpose}</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-3xl card flex items-center justify-center mx-auto"
                >
                  <div className="text-center">
                    <Clock size={48} className="text-[var(--text-muted)] mx-auto mb-3" />
                    <p className="text-[var(--text-muted)] text-sm">Waiting to start</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-[var(--border-subtle)]" />
        <div className="md:hidden h-px w-full bg-[var(--border-subtle)]" />

        {/* Up Next */}
        <div className="w-full md:w-80 lg:w-96">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold mb-5">
            Up Next
          </p>
          <div className="space-y-2.5">
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
                    className={`card rounded-2xl p-4 flex items-center gap-4 ${
                      i === 0 ? 'serving-highlight' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg ${
                      i === 0
                        ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                        : 'bg-[var(--surface-inset)] text-[var(--text-muted)]'
                    }`}>
                      {token.tokenNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${i === 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {token.name}
                      </p>
                      {token.purpose && (
                        <p className="text-xs text-[var(--text-muted)] truncate">{token.purpose}</p>
                      )}
                    </div>
                    {i === 0 && (
                      <Badge variant="gold">Next</Badge>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-[var(--text-muted)] text-sm"
                >
                  No one in queue
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 flex items-center justify-center gap-8 text-xs text-[var(--text-muted)]">
        <span>Served: <span className="font-mono text-[var(--success)]">{queueState.totalServed}</span></span>
        <span>Waiting: <span className="font-mono text-[var(--accent)]">{queueState.totalWaiting}</span></span>
        <span>QBYAZ</span>
      </div>
    </div>
  )
}
