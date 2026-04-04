import { motion } from 'framer-motion'
import { User, Mail, Sun, Moon, Monitor, Palette, Bell, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'

function SettingRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[var(--surface-inset)] flex items-center justify-center">
          <Icon size={18} className="text-[var(--text-secondary)]" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[var(--text-primary)]">{label}</p>
          {description && <p className="text-sm text-[var(--text-muted)] mt-0.5">{description}</p>}
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
      className={`flex-1 flex flex-col items-center gap-2.5 py-4 px-5 rounded-2xl border-2 transition-all ${
        isActive
          ? 'border-[var(--accent)] bg-[var(--accent-light)]'
          : 'border-[var(--border-subtle)] hover:border-[var(--border-primary)]'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'} />
      <span className={`text-sm font-semibold ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{label}</span>
    </button>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <PageTransition className="p-6 sm:p-10 md:p-12 lg:p-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 lg:mb-14"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">Settings</h1>
          <p className="text-[var(--text-secondary)] text-[15px]">Manage your account and preferences</p>
        </motion.div>

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="mb-6 sm:mb-8 p-8 sm:p-10">
            <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Profile</h3>
            <div className="flex items-center gap-5 mb-6">
              <Avatar name={user?.name} size="lg" />
              <div>
                <p className="text-lg font-bold text-[var(--text-primary)]">{user?.name}</p>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{user?.email}</p>
              </div>
            </div>
            <div className="divider" />
            <SettingRow icon={User} label="Name" description={user?.name}>
              <span className="text-xs badge-neutral badge px-3 py-1.5 rounded-full">Locked</span>
            </SettingRow>
            <div className="divider" />
            <SettingRow icon={Mail} label="Email" description={user?.email}>
              <span className="text-xs badge-neutral badge px-3 py-1.5 rounded-full">Locked</span>
            </SettingRow>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 sm:mb-8 p-8 sm:p-10">
            <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Appearance</h3>
            <p className="text-[15px] text-[var(--text-secondary)] mb-6">Choose your preferred theme</p>
            <div className="flex gap-4">
              <ThemeOption value="light" label="Light" icon={Sun} current={theme} onClick={setTheme} />
              <ThemeOption value="dark" label="Dark" icon={Moon} current={theme} onClick={setTheme} />
              <ThemeOption value="system" label="System" icon={Monitor} current={theme} onClick={setTheme} />
            </div>
          </Card>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="mb-6 sm:mb-8 p-8 sm:p-10 opacity-60">
            <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Notifications</h3>
            <SettingRow icon={Bell} label="Push Notifications" description="Get notified for queue updates">
              <span className="text-xs badge-gold badge px-3 py-1.5 rounded-full">Coming Soon</span>
            </SettingRow>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 sm:p-10 opacity-60">
            <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Branding</h3>
            <SettingRow icon={Palette} label="Custom Branding" description="Logo, colors, and themes">
              <span className="text-xs badge-gold badge px-3 py-1.5 rounded-full">Coming Soon</span>
            </SettingRow>
            <div className="divider" />
            <SettingRow icon={Shield} label="Security" description="Password and two-factor auth">
              <span className="text-xs badge-gold badge px-3 py-1.5 rounded-full">Coming Soon</span>
            </SettingRow>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}
