import { useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smartworkout-backend.vercel.app/api'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup'
      const body = isLogin ? { email, password } : { name, email, password }
      const res = await fetch(API + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/dashboard'
      } else {
        setError(data.error || data.message || 'Something went wrong')
      }
    } catch (e) {
      setError('Cannot connect to server. Please try again.')
    }
    setLoading(false)
  }

  const s = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    },
    card: {
      backgroundColor: '#12121c',
      border: '1px solid #1e1e30',
      borderRadius: '1.5rem',
      padding: '2rem',
      width: '100%',
      maxWidth: '400px',
    },
    logo: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    toggle: {
      display: 'flex',
      backgroundColor: '#0d0d14',
      borderRadius: '9999px',
      padding: '4px',
      marginBottom: '1.5rem',
    },
    toggleBtn: (active) => ({
      flex: 1,
      padding: '0.6rem',
      borderRadius: '9999px',
      border: 'none',
      backgroundColor: active ? '#c8f135' : 'transparent',
      color: active ? '#050508' : '#6b6b8a',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '0.9rem',
    }),
    input: {
      width: '100%',
      padding: '0.85rem 1rem',
      backgroundColor: '#0d0d14',
      border: '1px solid #1e1e30',
      borderRadius: '0.75rem',
      color: '#f0f0f8',
      marginBottom: '1rem',
      fontSize: '1rem',
    },
    btn: {
      width: '100%',
      padding: '0.85rem',
      backgroundColor: '#c8f135',
      color: '#050508',
      border: 'none',
      borderRadius: '0.75rem',
      fontWeight: 'bold',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
    error: {
      backgroundColor: '#2d0f0f',
      border: '1px solid #ff4444',
      color: '#ff6b6b',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      fontSize: '0.9rem',
      textAlign: 'center',
    },
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={{ fontSize: '3rem' }}>💪</div>
          <h1 style={{ color: '#c8f135', fontSize: '1.8rem', marginTop: '0.5rem' }}>
            SmartWorkout AI
          </h1>
          <p style={{ color: '#6b6b8a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Your FREE AI Personal Trainer
          </p>
        </div>

        <div style={s.toggle}>
          <button style={s.toggleBtn(isLogin)} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button style={s.toggleBtn(!isLogin)} onClick={() => setIsLogin(false)}>
            Sign Up
          </button>
        </div>

        {error && <div style={s.error}>{error}</div>}

        {!isLogin && (
          <input
            style={s.input}
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}
        <input
          style={s.input}
          placeholder="Email address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={s.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ Please wait...' : isLogin ? '🔐 Login' : '🚀 Create Account'}
        </button>
      </div>
    </div>
  )
}
