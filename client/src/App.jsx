import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateSession from './pages/CreateSession'
import AdminDashboard from './pages/AdminDashboard'
import JoinQueue from './pages/JoinQueue'
import JoinSuccess from './pages/JoinSuccess'
import PublicDisplay from './pages/PublicDisplay'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'

function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  )
}

function RootRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected admin routes */}
      <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/dashboard/new" element={<AdminLayout><CreateSession /></AdminLayout>} />
      <Route path="/admin/:slug" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
      <Route path="/analytics" element={<AdminLayout><Analytics /></AdminLayout>} />

      {/* Public queue routes */}
      <Route path="/join/:slug" element={<JoinQueue />} />
      <Route path="/join/:slug/status/:tokenId" element={<JoinSuccess />} />
      <Route path="/display/:slug" element={<PublicDisplay />} />

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
