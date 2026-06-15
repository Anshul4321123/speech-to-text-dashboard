import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSignInEmailPassword } from '@nhost/react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationMessage, setVerificationMessage] = useState('')
  const { signInEmailPassword, isLoading, error } = useSignInEmailPassword()
  const navigate = useNavigate()

  // Check URL for verification ticket
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ticket = params.get('ticket')
    const type = params.get('type')
    
    if (ticket && type === 'emailVerify') {
      setVerificationMessage('Email verified! You can now login.')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await signInEmailPassword(email, password)
    if (!result.error) {
      navigate('/dashboard')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        
        {verificationMessage && (
          <div style={styles.success}>{verificationMessage}</div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          {error && <div style={styles.error}>{error.message}</div>}
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  card: {
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    outline: 'none'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center'
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '14px'
  },
  link: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#666'
  }
}

export default Login