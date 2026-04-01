import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateSession from './pages/CreateSession'
import JoinQueue from './pages/JoinQueue'
import JoinSuccess from './pages/JoinSuccess'
import AdminDashboard from './pages/AdminDashboard'
import PublicDisplay from './pages/PublicDisplay'

function AuthLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-2">{children}</div>
    </>
  )
}

function RootRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

export default function App() {
  return (
    <div className="ambient-bg min-h-screen">
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected admin routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AuthLayout><CreateSession /></AuthLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/:slug" element={
          <ProtectedRoute>
            <AuthLayout><AdminDashboard /></AuthLayout>
          </ProtectedRoute>
        } />

        {/* Public queue routes */}
        <Route path="/join/:slug" element={<JoinQueue />} />
        <Route path="/join/:slug/status/:tokenId" element={<JoinSuccess />} />
        <Route path="/display/:slug" element={<PublicDisplay />} />

        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
