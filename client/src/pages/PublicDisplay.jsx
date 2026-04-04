import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Users, Wifi, WifiOff, QrCode } from 'lucide-react'
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
    <div className="min-h-screen flex flex-col p-8 md:p-12 lg:p-16 bg-[var(--surface)] ambient-gold">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 md:mb-14">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 6px 24px rgba(212, 165, 40, 0.25)' }}>
            <QrCode size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">{queueState.sessionName}</h1>
            {queueState.sessionLocation && (
              <p className="text-sm md:text-base text-[var(--text-muted)] mt-0.5">{queueState.sessionLocation}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="card rounded-2xl px-6 py-3.5 flex items-center gap-3">
            <Users size={18} className="text-[var(--accent)]" />
            <span className="text-sm text-[var(--text-secondary)]">
              <span className="font-mono font-bold text-lg text-[var(--text-primary)]">{queueState.totalWaiting}</span> waiting
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
      <div className="flex-1 flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-20 items-center md:items-stretch">
        {/* Now Serving */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-8">
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
                  <div className="w-52 h-52 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-3xl bg-[var(--accent-light)] border border-[var(--accent)]/20 flex items-center justify-center mx-auto pulse-gold glow-gold relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold-500)]/5 to-transparent pointer-events-none" />
                    <span className="display-token-number text-8xl md:text-9xl lg:text-[10rem] relative z-10">
                      {current.tokenNumber}
                    </span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl lg:text-3xl text-[var(--text-primary)] font-bold mt-8"
                  >
                    {current.name}
                  </motion.p>
                  {current.purpose && (
                    <p className="text-sm md:text-base text-[var(--text-muted)] mt-2">{current.purpose}</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-52 h-52 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-3xl card flex items-center justify-center mx-auto"
                >
                  <div className="text-center">
                    <Clock size={56} className="text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                    <p className="text-[var(--text-muted)] text-base">Waiting to start</p>
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
        <div className="w-full md:w-80 lg:w-[420px]">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)] font-bold mb-6">
            Up Next
          </p>
          <div className="space-y-3">
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
                    className={`card rounded-2xl p-5 sm:p-6 flex items-center gap-5 ${
                      i === 0 ? 'serving-highlight' : ''
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-xl ${
                      i === 0
                        ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                        : 'bg-[var(--surface-inset)] text-[var(--text-muted)]'
                    }`}>
                      {token.tokenNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-base truncate ${i === 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {token.name}
                      </p>
                      {token.purpose && (
                        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{token.purpose}</p>
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
                  className="text-center py-20 text-[var(--text-muted)] text-base"
                >
                  No one in queue
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-10 flex items-center justify-center gap-10 text-sm text-[var(--text-muted)]">
        <span>Served: <span className="font-mono font-bold text-[var(--success)]">{queueState.totalServed}</span></span>
        <span>Waiting: <span className="font-mono font-bold text-[var(--accent)]">{queueState.totalWaiting}</span></span>
        <span className="font-semibold gradient-text-gold">QBYAZ</span>
      </div>
    </div>
  )
}
