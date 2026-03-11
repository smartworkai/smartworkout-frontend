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
    if (!email || !password) { setError('Please fill in all fields.'); return }
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
        setError(data.error || data.message || 'Something went wrong. Please try again.')
      }
    } catch (e) {
      setError('Cannot connect to server. Please try again.')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    backgroundColor: '#0d0d14',
    border: '1.5px solid #1e1e2e',
    borderRadius: '12px',
    color: '#f0f0f8',
    marginBottom: '12px',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#050508',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(200,241,53,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="fade-up" style={{
        backgroundColor: '#12121c',
        border: '1px solid #1e1e2e',
        borderRadius: '24px',
        padding: '2rem 1.75rem',
        width: '100%', maxWidth: '400px',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #c8f135, #7ab010)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 1rem',
            boxShadow: '0 8px 32px rgba(200,241,53,0.25)',
          }}>💪</div>
          <h1 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            color: '#f0f0f8', fontSize: '1.9rem', fontWeight: 800,
            letterSpacing: '0.02em',
          }}>SMARTWORKOUT <span style={{ color: '#c8f135' }}>AI</span></h1>
          <p style={{ color: '#5a5a7a', fontSize: '0.875rem', marginTop: '4px' }}>
            Your FREE AI Personal Trainer
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', backgroundColor: '#0d0d14',
          borderRadius: '9999px', padding: '4px', marginBottom: '1.5rem',
        }}>
          {['Login', 'Sign Up'].map((label, i) => {
            const active = (label === 'Login') === isLogin
            return (
              <button key={label} onClick={() => setIsLogin(label === 'Login')} style={{
                flex: 1, padding: '10px',
                borderRadius: '9999px', border: 'none',
                backgroundColor: active ? '#c8f135' : 'transparent',
                color: active ? '#050508' : '#5a5a7a',
                fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}>{label}</button>
            )
          })}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#2d0f0f', border: '1px solid rgba(255,68,68,0.4)',
            color: '#ff6b6b', padding: '12px 14px', borderRadius: '10px',
            marginBottom: '14px', fontSize: '0.875rem', textAlign: 'center',
          }}>⚠️ {error}</div>
        )}

        {!isLogin && (
          <input style={inputStyle} placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
        )}
        <input style={inputStyle} placeholder="Email address" type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        <input style={inputStyle} placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '14px',
          backgroundColor: '#c8f135', color: '#050508',
          border: 'none', borderRadius: '12px',
          fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
          marginTop: '4px',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(200,241,53,0.3)',
          transition: 'all 0.2s',
        }}>
          {loading ? '⏳ Please wait...' : isLogin ? '🔐 Login' : '🚀 Create Account'}
        </button>

        <p style={{ textAlign: 'center', color: '#5a5a7a', fontSize: '0.8rem', marginTop: '1.25rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={{ color: '#c8f135', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up free' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  )
}
