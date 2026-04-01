import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('qbyaz_token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('qbyaz_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem('qbyaz_token', newToken)
    localStorage.setItem('qbyaz_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('qbyaz_token')
    localStorage.removeItem('qbyaz_user')
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
