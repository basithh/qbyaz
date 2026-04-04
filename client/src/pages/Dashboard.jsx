import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, MapPin, Users, CheckCircle2, Clock, ArrowRight,
  Inbox, LayoutGrid, Activity, Zap, QrCode
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Tabs from '../components/ui/Tabs'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'
import PageTransition from '../components/PageTransition'

function timeAgo(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.getSessions()
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all'
    ? sessions
    : sessions.filter(s => s.status === filter.toUpperCase())

  const activeCount = sessions.filter(s => s.status === 'ACTIVE').length
  const totalServed = sessions.reduce((sum, s) => sum + (s.totalServed || 0), 0)

  return (
    <PageTransition className="p-6 sm:p-10 md:p-12 lg:p-16">
      <div className="max-w-5xl mx-auto">
        {/* Hero Greeting */}
        <div className="flex items-start justify-between mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.1] mb-2">
              {greeting()},<br />
              <span className="gradient-text-gold">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-[15px] sm:text-base mt-3">
              Manage and monitor your queue sessions
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Button
              onClick={() => navigate('/dashboard/new')}
              className="hidden sm:flex items-center gap-2.5"
              size="md"
            >
              <Plus size={16} />
              New Queue
            </Button>
          </motion.div>
        </div>

        {/* Summary Stats */}
        {!loading && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-3 gap-4 sm:gap-6 mb-10 lg:mb-14"
          >
            <Card padding={false} className="p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--color-gold-500)] opacity-[0.04] rounded-full blur-[40px] pointer-events-none" />
              <p className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Total Queues
              </p>
              <p className="stat-value text-3xl sm:text-4xl text-[var(--text-primary)]">{sessions.length}</p>
            </Card>
            <Card padding={false} className="p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--color-gold-500)] opacity-[0.06] rounded-full blur-[40px] pointer-events-none" />
              <p className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
                <Activity size={11} /> Active
              </p>
              <p className="stat-value text-3xl sm:text-4xl text-[var(--accent)]">{activeCount}</p>
            </Card>
            <Card padding={false} className="p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500 opacity-[0.04] rounded-full blur-[40px] pointer-events-none" />
              <p className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Total Served
              </p>
              <p className="stat-value text-3xl sm:text-4xl text-[var(--success)]">{totalServed}</p>
            </Card>
          </motion.div>
        )}

        {/* Filter Tabs */}
        {!loading && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-8"
          >
            <Tabs
              tabs={[
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Closed', value: 'closed' },
              ]}
              active={filter}
              onChange={setFilter}
            />
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty State */}
        {!loading && sessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20 sm:py-32"
          >
            <div className="w-20 h-20 rounded-3xl bg-[var(--accent-light)] border border-[rgba(212,165,40,0.15)] flex items-center justify-center mx-auto mb-8">
              <QrCode size={36} className="text-[var(--accent)]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">No queues yet</h2>
            <p className="text-[var(--text-secondary)] text-[15px] max-w-md mx-auto mb-10">
              Create your first queue session to start managing customers with real-time tracking and QR access.
            </p>
            <Button
              onClick={() => navigate('/dashboard/new')}
              className="flex items-center gap-2.5 mx-auto"
              size="lg"
            >
              <Plus size={18} />
              Create Your First Queue
            </Button>
          </motion.div>
        )}

        {/* Session Cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {filtered.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card
                  hover
                  onClick={() => navigate(`/admin/${session.slug}`)}
                  padding={false}
                  className="group cursor-pointer p-6 sm:p-8 relative overflow-hidden"
                >
                  {session.status === 'ACTIVE' && (
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-[var(--color-gold-500)] opacity-[0.04] rounded-full blur-[50px] pointer-events-none" />
                  )}

                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="flex-1 min-w-0 mr-4">
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                        {session.name}
                      </h3>
                      {session.location && (
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-1.5 truncate">
                          <MapPin size={12} className="shrink-0" /> {session.location}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={session.status === 'ACTIVE' ? 'success' : 'neutral'}
                      dot
                      pulse={session.status === 'ACTIVE'}
                    >
                      {session.status === 'ACTIVE' ? 'Active' : 'Closed'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 mb-5 relative z-10">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <div className="w-7 h-7 rounded-lg bg-[var(--accent-light)] flex items-center justify-center">
                        <Users size={13} className="text-[var(--accent)]" />
                      </div>
                      <span className="font-mono font-bold">{session.totalWaiting}</span>
                      <span className="text-[var(--text-muted)] text-xs">waiting</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <div className="w-7 h-7 rounded-lg bg-[var(--success-light)] flex items-center justify-center">
                        <CheckCircle2 size={13} className="text-[var(--success)]" />
                      </div>
                      <span className="font-mono font-bold">{session.totalServed}</span>
                      <span className="text-[var(--text-muted)] text-xs">served</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between relative z-10 pt-4 border-t border-[var(--border-subtle)]">
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                      <Clock size={11} />
                      {timeAgo(session.createdAt)}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors font-medium">
                      Open
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && sessions.length > 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface-inset)] flex items-center justify-center mx-auto mb-5">
              <LayoutGrid size={24} className="text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No {filter} queues</h3>
            <p className="text-sm text-[var(--text-secondary)]">Try a different filter</p>
          </div>
        )}

        {/* Mobile FAB */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/new')}
          className="sm:hidden fixed right-5 bottom-24 w-16 h-16 rounded-2xl btn-gold flex items-center justify-center shadow-xl z-40"
          style={{ boxShadow: '0 8px 32px rgba(212, 165, 40, 0.35)' }}
        >
          <Plus size={24} />
        </motion.button>
      </div>
    </PageTransition>
  )
}
