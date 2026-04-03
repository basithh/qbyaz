import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { api } from '../api/client'

function StatCard({ icon: Icon, label, value, sub, color = 'var(--text-primary)' }) {
  return (
    <Card padding={false} className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--surface-inset)] flex items-center justify-center">
          <Icon size={16} className="text-[var(--text-secondary)]" />
        </div>
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
      </div>
      <p className="stat-value text-3xl" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
    </Card>
  )
}

function Bar({ label, value, max, color = 'var(--accent)' }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--text-muted)] w-10 text-right font-mono">{label}</span>
      <div className="flex-1 h-7 rounded-md bg-[var(--surface-inset)] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-md"
          style={{ background: color }}
        />
      </div>
      <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] w-8">{value}</span>
    </div>
  )
}

export default function Analytics() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSessions()
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalServed = sessions.reduce((sum, s) => sum + (s.totalServed || 0), 0)
  const totalWaiting = sessions.reduce((sum, s) => sum + (s.totalWaiting || 0), 0)
  const activeSessions = sessions.filter(s => s.status === 'ACTIVE').length

  // Mock hourly data for visualization
  const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm']
  const mockData = [3, 7, 12, 15, 10, 8, 14, 9, 5]
  const maxVal = Math.max(...mockData, 1)

  return (
    <PageTransition className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Queue performance overview</p>
          </div>
          <Badge variant="gold">Beta</Badge>
        </div>

        {/* Info banner */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--accent-light)] border border-[var(--accent)]/10 mb-6">
          <AlertCircle size={16} className="text-[var(--accent)] shrink-0" />
          <p className="text-xs text-[var(--text-secondary)]">
            Hourly breakdown shows sample data. Full analytics coming soon.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BarChart3} label="Queues" value={sessions.length} sub="Total created" />
          <StatCard icon={TrendingUp} label="Active" value={activeSessions} color="var(--success)" />
          <StatCard icon={Users} label="Served" value={totalServed} color="var(--accent)" />
          <StatCard icon={Clock} label="Waiting" value={totalWaiting} sub="Right now" />
        </div>

        {/* Hourly Chart */}
        <Card className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Tokens by Hour</h3>
          <p className="text-xs text-[var(--text-muted)] mb-5">Sample data</p>
          <div className="space-y-2">
            {hours.map((h, i) => (
              <Bar key={h} label={h} value={mockData[i]} max={maxVal} />
            ))}
          </div>
        </Card>

        {/* Per-Queue Breakdown */}
        {sessions.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Per-Queue Breakdown</h3>
            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${s.status === 'ACTIVE' ? 'bg-[var(--success)]' : 'bg-[var(--text-muted)]'}`} />
                    <span className="text-sm text-[var(--text-primary)] truncate">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <span className="text-[var(--text-muted)]">
                      <span className="font-mono font-semibold text-[var(--accent)]">{s.totalWaiting}</span> waiting
                    </span>
                    <span className="text-[var(--text-muted)]">
                      <span className="font-mono font-semibold text-[var(--success)]">{s.totalServed}</span> served
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
