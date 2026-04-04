import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SkipForward, CheckCircle2, XCircle, Users, Clock, QrCode,
  Monitor, MapPin, ChevronDown, ChevronUp, Power, ArrowLeft
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Spinner from '../components/ui/Spinner'
import QueueList from '../components/QueueList'
import AnimatedCounter from '../components/AnimatedCounter'
import QRCodeDisplay from '../components/QRCodeDisplay'
import { useSSE } from '../hooks/useSSE'
import { useToast } from '../context/ToastContext'
import { api } from '../api/client'

export default function AdminDashboard() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { queueState, connected } = useSSE(slug)
  const [callingNext, setCallingNext] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  const handleCallNext = async () => {
    setCallingNext(true)
    try {
      await api.callNext(slug)
      toast.success('Next token called')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCallingNext(false)
    }
  }

  const handleUpdateStatus = async (tokenId, status) => {
    try {
      await api.updateTokenStatus(tokenId, status)
      const labels = { COMPLETED: 'completed', SKIPPED: 'skipped', IN_PROGRESS: 'called' }
      toast.success(`Token ${labels[status] || 'updated'}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleCloseSession = async () => {
    try {
      await api.closeSession(slug)
      toast.success('Session closed')
      setConfirmClose(false)
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (!queueState) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" className="text-[var(--accent)]" />
      </div>
    )
  }

  const isClosed = queueState.sessionStatus === 'CLOSED'
  const current = queueState.currentlyServing

  return (
    <PageTransition className="flex-1 p-6 sm:p-10 md:p-12 pb-28 md:pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8">
          <div className="p-1.5 rounded-full bg-[var(--surface-secondary)] transition-colors">
            <ArrowLeft size={14} />
          </div>
          My Queues
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">{queueState.sessionName}</h1>
            <div className="flex items-center gap-4 mt-2.5">
              {queueState.sessionLocation && (
                <span className="text-sm text-[var(--text-muted)] flex items-center gap-1.5">
                  <MapPin size={13} /> {queueState.sessionLocation}
                </span>
              )}
              {connected ? (
                <Badge variant="success" dot pulse>Live</Badge>
              ) : (
                <Badge variant="neutral" dot>Offline</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQR(!showQR)}
              className="p-3 rounded-2xl card text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <QrCode size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/display/${slug}`)}
              className="p-3 rounded-2xl card text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Monitor size={20} />
            </motion.button>
          </div>
        </div>

        {/* QR Drawer */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <Card variant="elevated" className="text-center p-10 sm:p-12">
                <QRCodeDisplay slug={slug} size={200} />
                <p className="text-sm text-[var(--text-muted)] mt-5">
                  Share: <span className="text-[var(--accent)] font-mono text-xs">{window.location.origin}/join/{slug}</span>
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-5 mb-8">
          <Card padding={false} className="text-center p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-[var(--color-gold-500)] opacity-[0.05] rounded-full blur-[30px] pointer-events-none" />
            <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 mb-3 uppercase tracking-wider font-semibold">
              <Clock size={11} /> Serving
            </div>
            <AnimatedCounter
              value={current?.tokenNumber ?? '—'}
              className="text-2xl sm:text-3xl gradient-text-gold"
            />
          </Card>
          <Card padding={false} className="text-center p-5 sm:p-7">
            <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 mb-3 uppercase tracking-wider font-semibold">
              <Users size={11} /> Waiting
            </div>
            <AnimatedCounter
              value={queueState.totalWaiting}
              className="text-2xl sm:text-3xl text-[var(--text-primary)]"
            />
          </Card>
          <Card padding={false} className="text-center p-5 sm:p-7">
            <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 mb-3 uppercase tracking-wider font-semibold">
              <CheckCircle2 size={11} /> Served
            </div>
            <AnimatedCounter
              value={queueState.totalServed}
              className="text-2xl sm:text-3xl text-[var(--success)]"
            />
          </Card>
        </div>

        {/* Currently Serving */}
        {current && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="serving-highlight rounded-3xl mb-6 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center pulse-gold glow-gold">
                  <span className="font-mono text-4xl font-bold gradient-text-gold">{current.tokenNumber}</span>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--accent)] uppercase tracking-widest font-bold mb-1">Now Serving</p>
                  <p className="text-[var(--text-primary)] font-bold text-lg">{current.name}</p>
                  {current.purpose && <p className="text-sm text-[var(--text-muted)] mt-0.5">{current.purpose}</p>}
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdateStatus(current.id, 'COMPLETED')}
                className="flex items-center gap-2"
              >
                <CheckCircle2 size={15} />
                Done
              </Button>
            </div>
          </motion.div>
        )}

        {/* Call Next */}
        {!isClosed && (
          <Button
            size="lg"
            loading={callingNext}
            onClick={handleCallNext}
            disabled={queueState.totalWaiting === 0 && !current}
            className="w-full flex items-center justify-center gap-2.5 mb-8"
          >
            <SkipForward size={18} />
            {current ? 'Complete & Call Next' : 'Call First Token'}
          </Button>
        )}

        {isClosed && (
          <Card padding={false} className="bg-[var(--error-light)] border-[var(--error)]/15 p-6 text-center mb-8 rounded-2xl">
            <p className="text-[var(--error)] text-base font-bold">Session Closed</p>
            <p className="text-[var(--error)] opacity-50 text-sm mt-1">No new tokens accepted</p>
          </Card>
        )}

        {/* Pending Queue */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-2.5 uppercase tracking-widest">
            <Users size={14} />
            Waiting ({queueState.pending?.length || 0})
          </h3>
          <QueueList
            tokens={queueState.pending}
            emptyMessage="No one waiting"
            renderActions={(token) => (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUpdateStatus(token.id, 'IN_PROGRESS')}
                  className="p-2.5 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-colors"
                  title="Call this token"
                >
                  <SkipForward size={15} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUpdateStatus(token.id, 'SKIPPED')}
                  className="p-2.5 rounded-xl bg-[var(--error-light)] text-[var(--error)] transition-colors"
                  title="Skip this token"
                >
                  <XCircle size={15} />
                </motion.button>
              </>
            )}
          />
        </div>

        {/* Completed */}
        {queueState.completed?.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4 uppercase tracking-widest font-bold"
            >
              <CheckCircle2 size={14} />
              Completed ({queueState.completed.length})
              {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {showCompleted && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <QueueList tokens={queueState.completed} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Close Session */}
        {!isClosed && (
          <div className="mt-16 pt-8 border-t border-[var(--border-subtle)] text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfirmClose(true)}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--error)] transition-colors flex items-center gap-2 mx-auto"
            >
              <Power size={14} />
              Close Session
            </motion.button>
          </div>
        )}

        <ConfirmDialog
          open={confirmClose}
          onClose={() => setConfirmClose(false)}
          onConfirm={handleCloseSession}
          title="Close this session?"
          description="No new tokens will be accepted. This action cannot be undone."
          confirmText="Close Session"
        />
      </div>
    </PageTransition>
  )
}
