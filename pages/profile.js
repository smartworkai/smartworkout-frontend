import { useEffect, useState } from 'react'
import Nav from '../components/Nav'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smartworkout-backend.vercel.app/api'

const PRO_FEATURES = [
  { icon: '🍽️', label: 'AI Meal Planner' },
  { icon: '📷', label: 'AI Body Scan' },
  { icon: '🎙️', label: 'Voice Coach' },
  { icon: '📊', label: 'Advanced Analytics' },
]

export default function Profile() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ workouts: 0, streak: 0, points: 0 })

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    const token = localStorage.getItem('token')
    if (token) fetchStats(token)
  }, [])

  const fetchStats = async (token) => {
    try {
      const res = await fetch(API + '/logs/stats', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      const data = await res.json()
      setStats({
        workouts: data.total_workouts || 0,
        streak:   data.streak         || 0,
        points:   data.points          || 0,
      })
    } catch (e) {}
  }

  const startCheckout = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API + '/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Could not start checkout. Please try again.')
    } catch (e) {
      alert('Could not connect. Please try again.')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/auth'
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '💪'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050508', color: '#f0f0f8', paddingBottom: 80 }}>
      <div style={{ padding: '1.5rem 1rem 0' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          👤 <span style={{ color: '#c8f135' }}>PROFILE</span>
        </h1>

        {/* Avatar + name card */}
        <div className="fade-up" style={{
          backgroundColor: '#12121c', border: '1px solid #1e1e2e',
          borderRadius: 14, padding: '1.5rem', textAlign: 'center', marginBottom: '0.75rem',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #c8f135, #7ab010)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: initials.length === 2 ? '1.8rem' : '2.2rem',
            fontWeight: 800, fontFamily: 'Barlow Condensed, sans-serif',
            color: '#050508', margin: '0 auto 0.75rem',
            boxShadow: '0 8px 24px rgba(200,241,53,0.3)',
          }}>{initials}</div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
            {user?.name || 'Athlete'}
          </h2>
          <p style={{ color: '#5a5a7a', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            {user?.email || ''}
          </p>
          <span style={{
            backgroundColor: 'rgba(200,241,53,0.12)', color: '#c8f135',
            padding: '4px 14px', borderRadius: 9999,
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
          }}>FREE PLAN</span>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-around',
            marginTop: '1.25rem', paddingTop: '1.25rem',
            borderTop: '1px solid #1e1e2e' }}>
            {[
              { label: 'Workouts', value: stats.workouts },
              { label: 'Streak',   value: stats.streak   },
              { label: 'Points',   value: stats.points   },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
                  color: '#c8f135', fontWeight: 800, fontSize: '1.7rem' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#5a5a7a', fontSize: '0.72rem', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro upgrade */}
        <div className="fade-up-2" style={{
          background: 'linear-gradient(135deg, #1a2200, #0d1a00)',
          border: '1px solid rgba(200,241,53,0.3)',
          borderRadius: 14, padding: '1.25rem', marginBottom: '0.75rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#c8f135' }}>
                ⭐ Upgrade to Pro
              </h2>
              <p style={{ color: '#8888aa', fontSize: '0.82rem', marginTop: 4 }}>
                Unlock the full AI fitness experience
              </p>
            </div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
              color: '#c8f135', fontWeight: 800, fontSize: '1.3rem',
              textAlign: 'right', lineHeight: 1 }}>
              $14<span style={{ fontSize: '0.7rem', color: '#8888aa', fontFamily: 'DM Sans' }}>/mo</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
            {PRO_FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#c8f135', fontSize: '0.85rem' }}>✓</span>
                <span style={{ fontSize: '0.82rem', color: '#f0f0f8' }}>{f.icon} {f.label}</span>
              </div>
            ))}
          </div>

          <button onClick={startCheckout} style={{
            width: '100%', padding: '13px',
            backgroundColor: '#c8f135', color: '#050508',
            border: 'none', borderRadius: 12,
            fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(200,241,53,0.3)',
          }}>
            Upgrade to Pro — $14/mo 🚀
          </button>
        </div>

        {/* Sign out */}
        <button onClick={logout} className="fade-up-3" style={{
          width: '100%', padding: '13px',
          backgroundColor: 'transparent', color: '#ff4444',
          border: '1.5px solid rgba(255,68,68,0.35)',
          borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
        }}>
          🚪 Sign Out
        </button>
      </div>

      <Nav />
    </div>
  )
}
