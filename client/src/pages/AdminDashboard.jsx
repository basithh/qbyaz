import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SkipForward, CheckCircle2, XCircle, Users, Clock, QrCode,
  Monitor, MapPin, Wifi, WifiOff, ChevronDown, ChevronUp, Power, ArrowLeft
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
    <PageTransition className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4">
          <ArrowLeft size={14} />
          My Queues
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{queueState.sessionName}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              {queueState.sessionLocation && (
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <MapPin size={11} /> {queueState.sessionLocation}
                </span>
              )}
              {connected ? (
                <Badge variant="success" dot pulse>Live</Badge>
              ) : (
                <Badge variant="neutral" dot>Offline</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQR(!showQR)}
              className="p-2.5 rounded-xl card text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <QrCode size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/display/${slug}`)}
              className="p-2.5 rounded-xl card text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Monitor size={18} />
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
              className="overflow-hidden mb-4"
            >
              <Card className="text-center p-8">
                <QRCodeDisplay slug={slug} size={180} />
                <p className="text-xs text-[var(--text-muted)] mt-3">
                  Share: <span className="text-[var(--accent)] font-mono text-[11px]">{window.location.origin}/join/{slug}</span>
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Card padding={false} className="text-center p-4">
            <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 mb-2 uppercase tracking-wider font-semibold">
              <Clock size={10} /> Serving
            </div>
            <AnimatedCounter
              value={current?.tokenNumber ?? '—'}
              className="text-xl gradient-text-gold"
            />
          </Card>
          <Card padding={false} className="text-center p-4">
            <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 mb-2 uppercase tracking-wider font-semibold">
              <Users size={10} /> Waiting
            </div>
            <AnimatedCounter
              value={queueState.totalWaiting}
              className="text-xl text-[var(--text-primary)]"
            />
          </Card>
          <Card padding={false} className="text-center p-4">
            <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 mb-2 uppercase tracking-wider font-semibold">
              <CheckCircle2 size={10} /> Served
            </div>
            <AnimatedCounter
              value={queueState.totalServed}
              className="text-xl text-[var(--success)]"
            />
          </Card>
        </div>

        {/* Currently Serving */}
        {current && (
          <div className="serving-highlight rounded-2xl mb-4 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center pulse-gold glow-gold">
                  <span className="font-mono text-3xl font-bold gradient-text-gold">{current.tokenNumber}</span>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--accent)] uppercase tracking-wider font-semibold mb-0.5">Now Serving</p>
                  <p className="text-[var(--text-primary)] font-semibold">{current.name}</p>
                  {current.purpose && <p className="text-xs text-[var(--text-muted)] mt-0.5">{current.purpose}</p>}
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdateStatus(current.id, 'COMPLETED')}
                className="flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                Done
              </Button>
            </div>
          </div>
        )}

        {/* Call Next */}
        {!isClosed && (
          <Button
            size="lg"
            loading={callingNext}
            onClick={handleCallNext}
            disabled={queueState.totalWaiting === 0 && !current}
            className="w-full flex items-center justify-center gap-2 mb-5"
          >
            <SkipForward size={18} />
            {current ? 'Complete & Call Next' : 'Call First Token'}
          </Button>
        )}

        {isClosed && (
          <Card padding={false} className="bg-[var(--error-light)] border-[var(--error)]/15 p-4 text-center mb-5">
            <p className="text-[var(--error)] text-sm font-semibold">Session Closed</p>
            <p className="text-[var(--error)] opacity-50 text-xs mt-0.5">No new tokens accepted</p>
          </Card>
        )}

        {/* Pending Queue */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Users size={13} />
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
                  className="p-2 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-colors"
                  title="Call this token"
                >
                  <SkipForward size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUpdateStatus(token.id, 'SKIPPED')}
                  className="p-2 rounded-xl bg-[var(--error-light)] text-[var(--error)] transition-colors"
                  title="Skip this token"
                >
                  <XCircle size={14} />
                </motion.button>
              </>
            )}
          />
        </div>

        {/* Completed */}
        {queueState.completed?.length > 0 && (
          <div>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-3 uppercase tracking-wider font-semibold"
            >
              <CheckCircle2 size={13} />
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
          <div className="mt-10 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfirmClose(true)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors flex items-center gap-1.5 mx-auto"
            >
              <Power size={12} />
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
