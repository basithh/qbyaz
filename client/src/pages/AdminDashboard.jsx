import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SkipForward, CheckCircle2, XCircle, Users, Clock, QrCode,
  Monitor, MapPin, Wifi, WifiOff, ChevronDown, ChevronUp, Power
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassPanel from '../components/GlassPanel'
import ShimmerButton from '../components/ShimmerButton'
import QueueList from '../components/QueueList'
import AnimatedCounter from '../components/AnimatedCounter'
import QRCodeDisplay from '../components/QRCodeDisplay'
import { useSSE } from '../hooks/useSSE'
import { api } from '../api/client'

export default function AdminDashboard() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { queueState, connected } = useSSE(slug)
  const [callingNext, setCallingNext] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)

  const handleCallNext = async () => {
    setCallingNext(true)
    try {
      await api.callNext(slug)
    } catch (err) {
      console.error(err)
    } finally {
      setCallingNext(false)
    }
  }

  const handleUpdateStatus = async (tokenId, status) => {
    try {
      await api.updateTokenStatus(tokenId, status)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCloseSession = async () => {
    if (window.confirm('Close this queue session? No new tokens will be accepted.')) {
      try {
        await api.closeSession(slug)
      } catch (err) {
        console.error(err)
      }
    }
  }

  if (!queueState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const isClosed = queueState.sessionStatus === 'CLOSED'
  const current = queueState.currentlyServing

  return (
    <PageTransition className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">{queueState.sessionName}</h1>
            <div className="flex items-center gap-3 mt-1">
              {queueState.sessionLocation && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={10} /> {queueState.sessionLocation}
                </span>
              )}
              {connected ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <Wifi size={10} /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-amber-400">
                  <WifiOff size={10} /> Offline
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQR(!showQR)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <QrCode size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/display/${slug}`)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Monitor size={18} />
            </motion.button>
          </div>
        </div>

        {/* QR Code Drawer */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <GlassPanel className="text-center p-6">
                <QRCodeDisplay slug={slug} size={180} />
                <p className="text-xs text-slate-500 mt-2">
                  Share: <span className="text-indigo-300 font-mono">{window.location.origin}/join/{slug}</span>
                </p>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <GlassPanel className="text-center p-3">
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Clock size={10} /> Now Serving
            </div>
            <AnimatedCounter
              value={current?.tokenNumber ?? '—'}
              className="text-xl text-amber-300"
            />
          </GlassPanel>
          <GlassPanel className="text-center p-3">
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Users size={10} /> Waiting
            </div>
            <AnimatedCounter
              value={queueState.totalWaiting}
              className="text-xl text-indigo-300"
            />
          </GlassPanel>
          <GlassPanel className="text-center p-3">
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 size={10} /> Served
            </div>
            <AnimatedCounter
              value={queueState.totalServed}
              className="text-xl text-emerald-300"
            />
          </GlassPanel>
        </div>

        {/* Currently Serving */}
        {current && (
          <GlassPanel className="mb-4 p-6 border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center pulse-ring-amber">
                  <span className="font-mono text-3xl font-bold text-amber-300">{current.tokenNumber}</span>
                </div>
                <div>
                  <p className="text-[10px] text-amber-400/70 uppercase tracking-wider font-semibold">Now Serving</p>
                  <p className="text-white font-semibold">{current.name}</p>
                  {current.purpose && <p className="text-xs text-slate-400">{current.purpose}</p>}
                </div>
              </div>
              <ShimmerButton
                variant="success"
                size="sm"
                onClick={() => handleUpdateStatus(current.id, 'COMPLETED')}
                className="flex items-center gap-1"
              >
                <CheckCircle2 size={14} />
                Done
              </ShimmerButton>
            </div>
          </GlassPanel>
        )}

        {/* Call Next Button */}
        {!isClosed && (
          <ShimmerButton
            variant="primary"
            size="lg"
            loading={callingNext}
            onClick={handleCallNext}
            disabled={queueState.totalWaiting === 0 && !current}
            className="w-full flex items-center justify-center gap-2 mb-4"
          >
            <SkipForward size={18} />
            {current ? 'Complete & Call Next' : 'Call First Token'}
          </ShimmerButton>
        )}

        {isClosed && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center mb-4">
            <p className="text-red-300 text-sm font-semibold">Session Closed</p>
            <p className="text-red-300/60 text-xs">No new tokens accepted</p>
          </div>
        )}

        {/* Pending Queue */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
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
                  className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                  title="Call this token"
                >
                  <SkipForward size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUpdateStatus(token.id, 'SKIPPED')}
                  className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                  title="Skip this token"
                >
                  <XCircle size={14} />
                </motion.button>
              </>
            )}
          />
        </div>

        {/* Completed (Collapsible) */}
        {queueState.completed?.length > 0 && (
          <div>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors mb-2"
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
          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCloseSession}
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1 mx-auto"
            >
              <Power size={12} />
              Close Session
            </motion.button>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
