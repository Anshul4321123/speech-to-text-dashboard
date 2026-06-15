import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthenticationStatus } from '@nhost/react'
import Login from './auth/Login'
import Signup from './auth/Signup'
import Dashboard from './dashboard/Dashboard'

function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
        } />
        <Route path="/signup" element={
          !isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    fontSize: '18px'
  }
}

export default App