import { Routes, Route } from 'react-router-dom'
import CreateSession from './pages/CreateSession'
import JoinQueue from './pages/JoinQueue'
import JoinSuccess from './pages/JoinSuccess'
import AdminDashboard from './pages/AdminDashboard'
import PublicDisplay from './pages/PublicDisplay'

export default function App() {
  return (
    <div className="ambient-bg min-h-screen">
      <Routes>
        <Route path="/" element={<CreateSession />} />
        <Route path="/join/:slug" element={<JoinQueue />} />
        <Route path="/join/:slug/status/:tokenId" element={<JoinSuccess />} />
        <Route path="/admin/:slug" element={<AdminDashboard />} />
        <Route path="/display/:slug" element={<PublicDisplay />} />
      </Routes>
    </div>
  )
}
