import { Routes, Route, Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Psychologists from './pages/Psychologists/Psychologists'
import Favorites from './pages/Favorites/Favorites'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loader"><div className="spinner" /></div>
  return user ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="psychologists" element={<Psychologists />} />
        <Route
          path="favorites"
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}