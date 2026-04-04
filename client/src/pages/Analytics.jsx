import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { api } from '../api/client'

function StatCard({ icon: Icon, label, value, sub, color = 'var(--text-primary)', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card padding={false} className="p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-[40px] pointer-events-none opacity-[0.05]"
          style={{ background: color }} />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-inset)] flex items-center justify-center">
            <Icon size={18} className="text-[var(--text-secondary)]" />
          </div>
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</p>
        </div>
        <p className="stat-value text-3xl sm:text-4xl" style={{ color }}>{value}</p>
        {sub && <p className="text-sm text-[var(--text-muted)] mt-2">{sub}</p>}
      </Card>
    </motion.div>
  )
}

function Bar({ label, value, max, color = 'var(--accent)' }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-[var(--text-muted)] w-12 text-right font-mono">{label}</span>
      <div className="flex-1 h-8 rounded-lg bg-[var(--surface-inset)] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-lg"
          style={{ background: color }}
        />
      </div>
      <span className="text-sm font-mono font-bold text-[var(--text-secondary)] w-10">{value}</span>
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

  const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm']
  const mockData = [3, 7, 12, 15, 10, 8, 14, 9, 5]
  const maxVal = Math.max(...mockData, 1)

  return (
    <PageTransition className="p-6 sm:p-10 md:p-12 lg:p-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-10 lg:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">Analytics</h1>
            <p className="text-[var(--text-secondary)] text-[15px]">Queue performance overview</p>
          </motion.div>
          <Badge variant="gold">Beta</Badge>
        </div>

        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--accent-light)] border border-[rgba(212,165,40,0.15)] mb-8 lg:mb-10"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center shrink-0">
            <AlertCircle size={16} className="text-[var(--accent)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Hourly breakdown shows sample data. Full analytics with real-time insights coming soon.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10 lg:mb-14">
          <StatCard icon={BarChart3} label="Queues" value={sessions.length} sub="Total created" delay={0.05} />
          <StatCard icon={TrendingUp} label="Active" value={activeSessions} color="var(--success)" delay={0.1} />
          <StatCard icon={Users} label="Served" value={totalServed} color="var(--accent)" delay={0.15} />
          <StatCard icon={Clock} label="Waiting" value={totalWaiting} sub="Right now" delay={0.2} />
        </div>

        {/* Hourly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="mb-6 sm:mb-8 p-8 sm:p-10">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Tokens by Hour</h3>
            <p className="text-sm text-[var(--text-muted)] mb-8">Sample data</p>
            <div className="space-y-3">
              {hours.map((h, i) => (
                <Bar key={h} label={h} value={mockData[i]} max={maxVal} />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Per-Queue Breakdown */}
        {sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 sm:p-10">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Per-Queue Breakdown</h3>
              <div className="space-y-1">
                {sessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)] last:border-0">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.status === 'ACTIVE' ? 'bg-[var(--success)]' : 'bg-[var(--text-muted)]'}`} />
                      <span className="text-[15px] font-medium text-[var(--text-primary)] truncate">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <span className="text-[var(--text-muted)]">
                        <span className="font-mono font-bold text-[var(--accent)]">{s.totalWaiting}</span> waiting
                      </span>
                      <span className="text-[var(--text-muted)]">
                        <span className="font-mono font-bold text-[var(--success)]">{s.totalServed}</span> served
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
