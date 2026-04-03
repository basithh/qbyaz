import { motion } from 'framer-motion'
import { User, Mail, Sun, Moon, Monitor, Palette, Bell, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'

function SettingRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--surface-inset)] flex items-center justify-center">
          <Icon size={16} className="text-[var(--text-secondary)]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
          {description && <p className="text-xs text-[var(--text-muted)]">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

function ThemeOption({ value, label, icon: Icon, current, onClick }) {
  const isActive = current === value
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex-1 flex flex-col items-center gap-2 py-3 px-4 rounded-xl border transition-all ${
        isActive
          ? 'border-[var(--accent)] bg-[var(--accent-light)]'
          : 'border-[var(--border-subtle)] hover:border-[var(--border-primary)]'
      }`}
    >
      <Icon size={18} className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'} />
      <span className={`text-xs font-medium ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{label}</span>
    </button>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <PageTransition className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">Manage your account and preferences</p>

        {/* Profile */}
        <Card className="mb-6">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Profile</h3>
          <div className="flex items-center gap-4 mb-4">
            <Avatar name={user?.name} size="lg" />
            <div>
              <p className="text-base font-semibold text-[var(--text-primary)]">{user?.name}</p>
              <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
            </div>
          </div>
          <div className="divider" />
          <SettingRow icon={User} label="Name" description={user?.name}>
            <span className="text-xs badge-neutral badge">Locked</span>
          </SettingRow>
          <div className="divider" />
          <SettingRow icon={Mail} label="Email" description={user?.email}>
            <span className="text-xs badge-neutral badge">Locked</span>
          </SettingRow>
        </Card>

        {/* Appearance */}
        <Card className="mb-6">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Appearance</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Choose your preferred theme</p>
          <div className="flex gap-3">
            <ThemeOption value="light" label="Light" icon={Sun} current={theme} onClick={setTheme} />
            <ThemeOption value="dark" label="Dark" icon={Moon} current={theme} onClick={setTheme} />
            <ThemeOption value="system" label="System" icon={Monitor} current={theme} onClick={setTheme} />
          </div>
        </Card>

        {/* Coming Soon */}
        <Card className="mb-6 opacity-60">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Notifications</h3>
          <SettingRow icon={Bell} label="Push Notifications" description="Get notified for queue updates">
            <span className="text-xs badge-gold badge">Coming Soon</span>
          </SettingRow>
        </Card>

        <Card className="opacity-60">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Branding</h3>
          <SettingRow icon={Palette} label="Custom Branding" description="Logo, colors, and themes">
            <span className="text-xs badge-gold badge">Coming Soon</span>
          </SettingRow>
          <div className="divider" />
          <SettingRow icon={Shield} label="Security" description="Password and two-factor auth">
            <span className="text-xs badge-gold badge">Coming Soon</span>
          </SettingRow>
        </Card>
      </div>
    </PageTransition>
  )
}
