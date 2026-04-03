import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, MapPin, Users, CheckCircle2, Clock, ArrowRight,
  Inbox, LayoutGrid, Activity
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
    <PageTransition className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Greeting */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {greeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Manage your queue sessions
            </p>
          </div>
          <Button
            onClick={() => navigate('/dashboard/new')}
            className="hidden sm:flex items-center gap-2"
          >
            <Plus size={16} />
            New Queue
          </Button>
        </div>

        {/* Summary Stats */}
        {!loading && sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <Card padding={false} className="p-4 text-center">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Total Queues
              </p>
              <p className="stat-value text-2xl text-[var(--text-primary)]">{sessions.length}</p>
            </Card>
            <Card padding={false} className="p-4 text-center">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1">
                <Activity size={10} /> Active
              </p>
              <p className="stat-value text-2xl text-[var(--accent)]">{activeCount}</p>
            </Card>
            <Card padding={false} className="p-4 text-center">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Total Served
              </p>
              <p className="stat-value text-2xl text-[var(--success)]">{totalServed}</p>
            </Card>
          </div>
        )}

        {/* Filter Tabs + Header */}
        {!loading && sessions.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <Tabs
              tabs={[
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Closed', value: 'closed' },
              ]}
              active={filter}
              onChange={setFilter}
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty State */}
        {!loading && sessions.length === 0 && (
          <EmptyState
            icon={Inbox}
            title="No queues yet"
            description="Create your first queue session to start managing customers"
            action={
              <Button
                onClick={() => navigate('/dashboard/new')}
                className="flex items-center gap-2 mx-auto"
                size="lg"
              >
                <Plus size={16} />
                Create Your First Queue
              </Button>
            }
          />
        )}

        {/* Session Cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card
                  hover
                  onClick={() => navigate(`/admin/${session.slug}`)}
                  className="group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="text-base font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                        {session.name}
                      </h3>
                      {session.location && (
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1 truncate">
                          <MapPin size={11} className="shrink-0" /> {session.location}
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

                  <div className="flex items-center gap-5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <Users size={12} className="text-[var(--accent)]" />
                      <span className="font-mono font-semibold">{session.totalWaiting}</span>
                      <span className="text-[var(--text-muted)]">waiting</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <CheckCircle2 size={12} className="text-[var(--success)]" />
                      <span className="font-mono font-semibold">{session.totalServed}</span>
                      <span className="text-[var(--text-muted)]">served</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <Clock size={10} />
                      {timeAgo(session.createdAt)}
                    </span>
                    <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && sessions.length > 0 && (
          <EmptyState
            icon={LayoutGrid}
            title={`No ${filter} queues`}
            description="Try a different filter"
          />
        )}

        {/* Mobile FAB */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/new')}
          className="sm:hidden fixed right-4 bottom-24 w-14 h-14 rounded-full btn-gold flex items-center justify-center shadow-xl z-40"
        >
          <Plus size={22} />
        </motion.button>
      </div>
    </PageTransition>
  )
}
