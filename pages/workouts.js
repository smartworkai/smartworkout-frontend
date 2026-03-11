import { useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smartworkout-backend.vercel.app/api'
const NAV = [
  { icon: '🏠', label: 'Home', href: '/dashboard' },
  { icon: '💪', label: 'Train', href: '/workouts' },
  { icon: '🤖', label: 'AI', href: '/ai' },
  { icon: '📊', label: 'Progress', href: '/progress' },
  { icon: '👤', label: 'Profile', href: '/profile' },
]

export default function Workouts() {
  const [loading, setLoading] = useState(false)
  const [program, setProgram] = useState(null)
  const [activeDay, setActiveDay] = useState(0)

  const generateProgram = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API + '/workouts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      })
      const data = await res.json()
      setProgram(data)
    } catch (e) {
      alert('Could not generate workout. Try again.')
    }
    setLoading(false)
  }

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#050508', color: '#f0f0f8', padding: '1.5rem 1rem 6rem' },
    genBtn: { width: '100%', padding: '1rem', backgroundColor: '#c8f135', color: '#050508', border: 'none', borderRadius: '9999px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '1.5rem' },
    dayTabs: { display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' },
    dayTab: (active) => ({ padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none', backgroundColor: active ? '#c8f135' : '#12121c', color: active ? '#050508' : '#6b6b8a', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.85rem' }),
    exCard: { backgroundColor: '#12121c', border: '1px solid #1e1e30', borderRadius: '1rem', padding: '1.25rem', marginBottom: '0.75rem' },
    badge: (diff) => ({ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 'bold', backgroundColor: diff === 'easy' ? '#0d2d0d' : diff === 'medium' ? '#2d1f00' : '#2d0000', color: diff === 'easy' ? '#4ade80' : diff === 'medium' ? '#fbbf24' : '#f87171' }),
    nav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', backgroundColor: '#12121c', borderTop: '1px solid #1e1e30', display: 'flex', justifyContent: 'space-around', padding: '0.6rem 0' },
    navItem: { textAlign: 'center', color: '#6b6b8a', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  }

  const activeWorkout = program?.workouts?.[activeDay]

  return (
    <div style={s.page}>
      <h1 style={{ color: '#c8f135', fontSize: '1.4rem', marginBottom: '1.5rem' }}>💪 My Program</h1>

      <button style={s.genBtn} onClick={generateProgram} disabled={loading}>
        {loading ? '⏳ Generating...' : program ? '🔄 Regenerate Program' : '⚡ Generate My Program'}
      </button>

      {program && (
        <>
          <div style={{ backgroundColor: '#12121c', border: '1px solid #c8f135', borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#c8f135', fontSize: '1rem' }}>{program.name || 'My Workout Program'}</h2>
            <p style={{ color: '#6b6b8a', fontSize: '0.85rem', marginTop: '0.25rem' }}>{program.workouts?.length} training days per week</p>
          </div>

          <div style={s.dayTabs}>
            {program.workouts?.map((w, i) => (
              <button key={i} style={s.dayTab(activeDay === i)} onClick={() => setActiveDay(i)}>
                Day {i + 1}
              </button>
            ))}
          </div>

          {activeWorkout && (
            <>
              <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#f0f0f8' }}>
                {activeWorkout.name || `Day ${activeDay + 1}`}
              </h2>
              {activeWorkout.exercises?.map((ex, i) => (
                <div key={i} style={s.exCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', flex: 1 }}>{ex.name}</h3>
                    <span style={s.badge(ex.difficulty)}>{ex.difficulty}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#c8f135', fontWeight: 'bold', fontSize: '0.9rem' }}>{ex.sets} sets</span>
                    <span style={{ color: '#c8f135', fontWeight: 'bold', fontSize: '0.9rem' }}>{ex.reps} reps</span>
                    <span style={{ color: '#6b6b8a', fontSize: '0.85rem' }}>{ex.muscle_group}</span>
                  </div>
                  {ex.coaching_tip && (
                    <p style={{ color: '#6b6b8a', fontSize: '0.8rem', backgroundColor: '#0d0d14', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      💡 {ex.coaching_tip}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}
        </>
      )}

      {!program && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b6b8a' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏋️</div>
          <p>No program yet. Generate your personalized workout above!</p>
        </div>
      )}

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
