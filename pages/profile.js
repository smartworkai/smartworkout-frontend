import { useEffect, useState } from 'react'

const NAV = [
  { icon: '🏠', label: 'Home', href: '/dashboard' },
  { icon: '💪', label: 'Train', href: '/workouts' },
  { icon: '🤖', label: 'AI', href: '/ai' },
  { icon: '📊', label: 'Progress', href: '/progress' },
  { icon: '👤', label: 'Profile', href: '/profile' },
]

export default function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/auth'
  }

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#050508', color: '#f0f0f8', padding: '1.5rem 1rem 6rem' },
    card: { backgroundColor: '#12121c', border: '1px solid #1e1e30', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1rem' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #c8f135, #85a820)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1rem' },
    statsRow: { display: 'flex', justifyContent: 'space-around', padding: '1rem 0' },
    statItem: { textAlign: 'center' },
    logoutBtn: { width: '100%', padding: '0.85rem', backgroundColor: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '9999px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
    nav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', backgroundColor: '#12121c', borderTop: '1px solid #1e1e30', display: 'flex', justifyContent: 'space-around', padding: '0.6rem 0' },
    navItem: { textAlign: 'center', color: '#6b6b8a', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  }

  return (
    <div style={s.page}>
      <h1 style={{ color: '#c8f135', fontSize: '1.4rem', marginBottom: '1.5rem' }}>👤 Profile</h1>

      <div style={{ ...s.card, textAlign: 'center' }}>
        <div style={s.avatar}>💪</div>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{user?.name || 'Athlete'}</h2>
        <p style={{ color: '#6b6b8a', fontSize: '0.9rem' }}>{user?.email || ''}</p>
        <span style={{ backgroundColor: '#c8f135', color: '#050508', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.5rem', display: 'inline-block' }}>
          FREE PLAN
        </span>

        <div style={s.statsRow}>
          {[
            { label: 'Workouts', value: '0' },
            { label: 'Streak', value: '0' },
            { label: 'Points', value: '0' },
          ].map((stat, i) => (
            <div key={i} style={s.statItem}>
              <div style={{ color: '#c8f135', fontWeight: 'bold', fontSize: '1.3rem' }}>{stat.value}</div>
              <div style={{ color: '#6b6b8a', fontSize: '0.75rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>⭐ Upgrade to Pro</h2>
        <p style={{ color: '#6b6b8a', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Unlock AI meal planner, body scan, voice coach and more!
        </p>
        {['🍽️ AI Meal Planner', '📷 AI Body Scan', '🎙️ Voice Coach', '📊 Advanced Analytics'].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#c8f135' }}>✓</span>
            <span style={{ fontSize: '0.9rem' }}>{f}</span>
          </div>
        ))}
        <button style={{ width: '100%', padding: '0.85rem', backgroundColor: '#c8f135', color: '#050508', border: 'none', borderRadius: '9999px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}>
          Upgrade to Pro — $14/mo 🚀
        </button>
      </div>

      <button style={s.logoutBtn} onClick={logout}>
        🚪 Sign Out
      </button>

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
