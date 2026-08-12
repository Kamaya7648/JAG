import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Board from './pages/Board.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/board/:vehicleId" element={<Board />} />
    </Routes>
  )
}
