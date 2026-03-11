import { useState, useEffect } from 'react'
import Nav from '../components/Nav'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smartworkout-backend.vercel.app/api'

function SparkLine({ data, color = '#c8f135', height = 60 }) {
  if (!data || data.length < 2) return (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#5a5a7a', fontSize: '0.8rem' }}>Not enough data yet</p>
    </div>
  )
  const w = 340, h = height
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 12) - 4
    return `${x},${y}`
  })
  const pathD = 'M ' + pts.join(' L ')
  const areaD = `M 0,${h} L ${pathD.slice(2)} L ${w},${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height, overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle
        cx={pts[pts.length - 1].split(',')[0]}
        cy={pts[pts.length - 1].split(',')[1]}
        r="4" fill={color}
      />
    </svg>
  )
}

export default function Progress() {
  const [metrics, setMetrics] = useState({ weight: '', waist: '', hips: '', arms: '', body_fat: '' })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ streak: 0, workouts: 0, calories: 0, points: 0 })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetchStats(token)
  }, [])

  const fetchStats = async (token) => {
    try {
      const res = await fetch(API + '/logs/stats', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      const data = await res.json()
      setStats({
        streak:   data.streak        || 0,
        workouts: data.weekly_workouts || 0,
        calories: data.total_calories || 0,
        points:   data.points         || 0,
      })
      if (data.weight_history) setHistory(data.weight_history)
    } catch (e) {}
  }

  const saveMetrics = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await fetch(API + '/profile/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(metrics),
      })
      if (metrics.weight) {
        setHistory(prev => [...prev, parseFloat(metrics.weight)])
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      alert('Could not save metrics. Please try again.')
    }
    setLoading(false)
  }

  const STAT_CARDS = [
    { icon: '🔥', label: 'Day Streak', value: stats.streak },
    { icon: '💪', label: 'Workouts',   value: stats.workouts },
    { icon: '⚡', label: 'Calories',   value: stats.calories },
    { icon: '🏆', label: 'Points',     value: stats.points },
  ]

  const metricFields = [
    { key: 'weight',   label: 'Weight',   unit: 'kg',  icon: '⚖️',  placeholder: '70' },
    { key: 'waist',    label: 'Waist',    unit: 'cm',  icon: '📏',  placeholder: '80' },
    { key: 'hips',     label: 'Hips',     unit: 'cm',  icon: '📐',  placeholder: '95' },
    { key: 'arms',     label: 'Arms',     unit: 'cm',  icon: '💪',  placeholder: '35' },
    { key: 'body_fat', label: 'Body Fat', unit: '%',   icon: '📊',  placeholder: '20' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050508', color: '#f0f0f8', paddingBottom: 80 }}>
      <div style={{ padding: '1.5rem 1rem 0' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
          📊 MY <span style={{ color: '#c8f135' }}>PROGRESS</span>
        </h1>
      </div>

      {/* Stat grid */}
      <div className="fade-up" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '0.65rem', padding: '0 1rem',
      }}>
        {STAT_CARDS.map((s, i) => (
          <div key={i} style={{
            backgroundColor: '#12121c', border: '1px solid #1e1e2e',
            borderRadius: 14, padding: '1rem',
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
              color: '#c8f135', fontWeight: 800, fontSize: '1.7rem' }}>{s.value}</div>
            <div style={{ color: '#5a5a7a', fontSize: '0.72rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Weight chart */}
      <div className="fade-up-2" style={{ padding: '1rem 1rem 0' }}>
        <div style={{ backgroundColor: '#12121c', border: '1px solid #1e1e2e',
          borderRadius: 14, padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '0.75rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>⚖️ Weight Trend</p>
            {history.length > 0 && (
              <span style={{ color: '#c8f135', fontWeight: 700,
                fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem' }}>
                {history[history.length - 1]} kg
              </span>
            )}
          </div>
          <SparkLine data={history.length ? history : null} />
        </div>
      </div>

      {/* Log measurements */}
      <div className="fade-up-3" style={{ padding: '1rem 1rem 0' }}>
        <div style={{ backgroundColor: '#12121c', border: '1px solid #1e1e2e',
          borderRadius: 14, padding: '1.1rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>
            📝 Log Measurements
          </h2>

          {saved && (
            <div style={{
              backgroundColor: '#0d2d0d', border: '1px solid rgba(74,222,128,0.4)',
              color: '#4ade80', padding: '10px 14px', borderRadius: 10,
              textAlign: 'center', fontSize: '0.875rem', marginBottom: '1rem',
            }}>✅ Measurements saved!</div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {metricFields.map((field, i) => (
              <div key={i} style={i === metricFields.length - 1 && metricFields.length % 2 !== 0
                ? { gridColumn: '1 / -1' } : {}}>
                <label style={{ color: '#5a5a7a', fontSize: '0.78rem', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  display: 'block', marginBottom: 6 }}>
                  {field.icon} {field.label} ({field.unit})
                </label>
                <input
                  type="number" placeholder={field.placeholder}
                  value={metrics[field.key]}
                  onChange={e => setMetrics({ ...metrics, [field.key]: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 12px',
                    backgroundColor: '#0d0d14', border: '1.5px solid #1e1e2e',
                    borderRadius: 10, color: '#f0f0f8', fontSize: '1rem',
                  }}
                />
              </div>
            ))}
          </div>

          <button onClick={saveMetrics} disabled={loading} style={{
            width: '100%', padding: '13px',
            backgroundColor: '#c8f135', color: '#050508',
            border: 'none', borderRadius: 12,
            fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            marginTop: '1rem',
            boxShadow: '0 4px 16px rgba(200,241,53,0.25)',
          }}>
            {loading ? '⏳ Saving...' : '💾 Save Measurements'}
          </button>
        </div>
      </div>

      <Nav />
    </div>
  )
}
