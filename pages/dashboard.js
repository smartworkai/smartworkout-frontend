import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smartworkout-backend.vercel.app/api'

const NAV = [
  { icon: '🏠', label: 'Home', href: '/dashboard' },
  { icon: '💪', label: 'Train', href: '/workouts' },
  { icon: '🤖', label: 'AI', href: '/ai' },
  { icon: '📊', label: 'Progress', href: '/progress' },
  { icon: '👤', label: 'Profile', href: '/profile' },
]

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ streak: 0, weeklyWorkouts: 0, calories: 0 })
  const [greeting, setGreeting] = useState('Good morning')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/auth'; return }
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    const h = new Date().getHours()
    if (h < 12) setGreeting('Good morning')
    else if (h < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#050508', color: '#f0f0f8', padding: '1.5rem 1rem 6rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    avatar: { width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' },
    statCard: { backgroundColor: '#12121c', border: '1px solid #1e1e30', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' },
    card: { backgroundColor: '#12121c', border: '1px solid #1e1e30', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1rem' },
    accentBtn: { width: '100%', padding: '0.85rem', backgroundColor: '#c8f135', color: '#050508', border: 'none', borderRadius: '9999px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' },
    quickCard: { backgroundColor: '#12121c', border: '1px solid #1e1e30', borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center', cursor: 'pointer' },
    nav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', backgroundColor: '#12121c', borderTop: '1px solid #1e1e30', display: 'flex', justifyContent: 'space-around', padding: '0.6rem 0' },
    navItem: { textAlign: 'center', color: '#6b6b8a', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={{ color: '#6b6b8a', fontSize: '0.85rem' }}>{greeting} 👋</p>
          <h1 style={{ color: '#c8f135', fontSize: '1.4rem', margin: 0 }}>
            {user?.name || 'Athlete'}
          </h1>
        </div>
        <div style={s.avatar}>💪</div>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {[
          { label: 'Streak', value: stats.streak, icon: '🔥', unit: 'days' },
          { label: 'Workouts', value: stats.weeklyWorkouts, icon: '💪', unit: 'this week' },
          { label: 'Calories', value: stats.calories, icon: '⚡', unit: 'burned' },
        ].map((stat, i) => (
          <div key={i} style={s.statCard}>
            <div style={{ fontSize: '1.5rem' }}>{stat.icon}</div>
            <div style={{ color: '#c8f135', fontWeight: 'bold', fontSize: '1.3rem' }}>{stat.value}</div>
            <div style={{ color: '#6b6b8a', fontSize: '0.65rem', marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Today's Workout */}
      <div style={s.card}>
        <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>🏋️ Today's Workout</h2>
        <p style={{ color: '#6b6b8a', fontSize: '0.9rem' }}>
          No workout generated yet. Generate your personalized program!
        </p>
        <button style={s.accentBtn} onClick={() => window.location.href = '/workouts'}>
          Generate My Workout 🚀
        </button>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>⚡ Quick Actions</h2>
      <div style={s.grid2}>
        {[
          { icon: '🤖', label: 'AI Trainer', sub: 'Chat with coach', href: '/ai' },
          { icon: '🍽️', label: 'Meal Plan', sub: 'AI nutrition', href: '/meals' },
          { icon: '📷', label: 'Body Scan', sub: 'AI analysis', href: '/scan' },
          { icon: '📊', label: 'Progress', sub: 'Track metrics', href: '/progress' },
        ].map((item, i) => (
          <div key={i} style={s.quickCard} onClick={() => window.location.href = item.href}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.label}</div>
            <div style={{ color: '#6b6b8a', fontSize: '0.75rem', marginTop: '2px' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <nav style={s.nav}>
        {NAV.map((item, i) => (
          <a key={i} href={item.href} style={s.navItem}>
            <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.6rem' }}>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
