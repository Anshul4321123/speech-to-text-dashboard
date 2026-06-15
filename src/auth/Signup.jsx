import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSignUpEmailPassword } from '@nhost/react'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signUpEmailPassword, isLoading, error } = useSignUpEmailPassword()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await signUpEmailPassword(email, password)
    if (!result.error) {
      navigate('/dashboard')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign Up</h1>
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={styles.input}
          />
          {error && <div style={styles.error}>{error.message}</div>}
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
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
  link: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#666'
  }
}

export default Signup