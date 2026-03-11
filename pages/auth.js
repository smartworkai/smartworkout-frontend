import { useEffect, useState } from 'react'
import Nav from '../components/Nav'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smartworkout-backend.vercel.app/api'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function StatCard({ icon, value, label, loading }) {
  return (
    <div style={{
      backgroundColor: '#12121c', border: '1px solid #1e1e2e',
      borderRadius: 14, padding: '14px 10px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{icon}</div>
      {loading
        ? <div className="skeleton" style={{ height: 24, width: 40, margin: '4px auto 6px' }} />
        : <div style={{ color: '#c8f135', fontWeight: 800, fontSize: '1.4rem',
            fontFamily: 'Barlow Condensed, sans-serif' }}>{value}</div>
      }
      <div style={{ color: '#5a5a7a', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em',
        textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [greeting, setGreeting] = useState('Good morning')
  const [today, setToday] = useState('')
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/auth'; return }
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    const h = new Date().getHours()
    if (h < 12) setGreeting('Good morning')
    else if (h < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
    const d = new Date()
    setToday(d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))

    fetchStats(token)
  }, [])

  const fetchStats = async (token) => {
    setStatsLoading(true)
    try {
      const res = await fetch(API + '/logs/stats', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      const data = await res.json()
      setStats(data)
    } catch (e) {
      setStats({ streak: 0, weekly_workouts: 0, total_calories: 0 })
    }
    setStatsLoading(false)
  }

  const todayDow = new Date().getDay()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050508', color: '#f0f0f8', paddingBottom: 80 }}>
      {/* Header */}
      <div className="fade-up" style={{ padding: '1.5rem 1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: '#5a5a7a', fontSize: '0.8rem', fontWeight: 500 }}>{today}</p>
            <p style={{ color: '#8888aa', fontSize: '0.85rem', marginTop: 2 }}>{greeting} 👋</p>
            <h1 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              color: '#f0f0f8', fontSize: '2rem', fontWeight: 800, marginTop: 2,
              letterSpacing: '0.02em', lineHeight: 1,
            }}>
              {user?.name?.split(' ')[0]?.toUpperCase() || 'ATHLETE'}
            </h1>
          </div>
          <div style={{
            width: 46, height: 46, borderRadius: '50%',
            background: 'linear-gradient(135deg, #c8f135, #7ab010)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', boxShadow: '0 4px 16px rgba(200,241,53,0.3)',
          }}>💪</div>
        </div>

        {/* Weekly day strip */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          backgroundColor: '#12121c', border: '1px solid #1e1e2e',
          borderRadius: 14, padding: '10px 12px', marginTop: '1rem',
        }}>
          {DAYS.map((day, i) => {
            const isToday = i === todayDow
            return (
              <div key={day} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ color: isToday ? '#c8f135' : '#5a5a7a', fontSize: '0.65rem',
                  fontWeight: 700, marginBottom: 5, textTransform: 'uppercase' }}>{day}</div>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', margin: '0 auto',
                  backgroundColor: isToday ? '#c8f135' : 'transparent',
                  border: isToday ? 'none' : '1.5px solid #1e1e2e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700,
                  color: isToday ? '#050508' : '#5a5a7a',
                }}>
                  {new Date(new Date().setDate(new Date().getDate() - todayDow + i)).getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up-2" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.65rem', padding: '1rem 1rem 0',
      }}>
        <StatCard icon="🔥" value={stats?.streak ?? 0} label="Day Streak" loading={statsLoading} />
        <StatCard icon="💪" value={stats?.weekly_workouts ?? 0} label="This Week" loading={statsLoading} />
        <StatCard icon="⚡" value={stats?.total_calories ?? 0} label="Calories" loading={statsLoading} />
      </div>

      {/* Today's Workout */}
      <div className="fade-up-3" style={{ padding: '1rem 1rem 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a2200, #0d1a00)',
          border: '1px solid rgba(200,241,53,0.2)',
          borderRadius: 14, padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#c8f135', fontSize: '0.75rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Today's Workout</p>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🏋️ Ready to train?</h2>
              <p style={{ color: '#8888aa', fontSize: '0.85rem', marginTop: 4 }}>
                Generate your AI-powered program to get started.
              </p>
            </div>
            <div style={{ fontSize: '2.5rem' }}>🎯</div>
          </div>
          <button onClick={() => window.location.href = '/workouts'} style={{
            width: '100%', padding: '12px',
            backgroundColor: '#c8f135', color: '#050508',
            border: 'none', borderRadius: 10,
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
            marginTop: '1rem',
            boxShadow: '0 4px 16px rgba(200,241,53,0.3)',
          }}>Start Training →</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fade-up-4" style={{ padding: '1rem 1rem 0' }}>
        <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5a5a7a',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          {[
            { icon: '🤖', label: 'AI Trainer', sub: 'Chat with coach', href: '/ai' },
            { icon: '🍽️', label: 'Meal Plan',  sub: 'AI nutrition',   href: '/ai'      },
            { icon: '📷', label: 'Body Scan',  sub: 'AI analysis',    href: '/ai'      },
            { icon: '📊', label: 'Progress',   sub: 'Track metrics',  href: '/progress'},
          ].map((item, i) => (
            <div key={i} onClick={() => window.location.href = item.href} style={{
              backgroundColor: '#12121c', border: '1px solid #1e1e2e',
              borderRadius: 14, padding: '1.1rem',
              cursor: 'pointer', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,241,53,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</div>
              <div style={{ color: '#5a5a7a', fontSize: '0.75rem', marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <Nav />
    </div>
  )
}
