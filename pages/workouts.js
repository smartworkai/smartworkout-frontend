import { useState } from 'react'
import Nav from '../components/Nav'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smartworkout-backend.vercel.app/api'

const DIFF_STYLE = {
  easy:   { bg: '#0d2d0d', color: '#4ade80' },
  medium: { bg: '#2d1f00', color: '#fbbf24' },
  hard:   { bg: '#2d0000', color: '#f87171' },
}

function ExerciseCard({ ex, index }) {
  const [sets, setSets] = useState([])
  const [expanded, setExpanded] = useState(false)
  const diff = DIFF_STYLE[ex.difficulty] || DIFF_STYLE.medium

  const addSet = () => {
    setSets(prev => [...prev, { reps: ex.reps, weight: '' }])
  }

  return (
    <div style={{
      backgroundColor: '#12121c', border: '1px solid #1e1e2e',
      borderRadius: 14, marginBottom: '0.65rem', overflow: 'hidden',
    }}>
      <div onClick={() => setExpanded(!expanded)} style={{
        padding: '1rem 1.1rem', cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: '1.05rem',
            }}>{ex.name}</span>
            <span style={{
              backgroundColor: diff.bg, color: diff.color,
              padding: '2px 8px', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 700,
            }}>{ex.difficulty?.toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: '#c8f135', fontWeight: 700, fontSize: '0.85rem' }}>
              {ex.sets} sets
            </span>
            <span style={{ color: '#c8f135', fontWeight: 700, fontSize: '0.85rem' }}>
              {ex.reps} reps
            </span>
            <span style={{ color: '#5a5a7a', fontSize: '0.82rem' }}>{ex.muscle_group}</span>
          </div>
        </div>
        <span style={{ color: '#5a5a7a', fontSize: '0.85rem', marginTop: 2 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {expanded && (
        <div style={{ padding: '0 1.1rem 1rem', borderTop: '1px solid #1e1e2e' }}>
          {ex.coaching_tip && (
            <div style={{
              backgroundColor: '#0d0d14', borderRadius: 8, padding: '8px 12px',
              margin: '10px 0', fontSize: '0.82rem', color: '#8888aa',
            }}>
              💡 {ex.coaching_tip}
            </div>
          )}

          {/* Set logger */}
          <p style={{ color: '#5a5a7a', fontSize: '0.75rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em', margin: '10px 0 6px' }}>
            Log Your Sets
          </p>
          {sets.map((set, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <span style={{ color: '#5a5a7a', fontSize: '0.8rem', minWidth: 20 }}>
                {i + 1}
              </span>
              <input
                type="number" placeholder="Reps"
                value={set.reps} onChange={e => {
                  const s = [...sets]; s[i].reps = e.target.value; setSets(s)
                }}
                style={{
                  flex: 1, padding: '8px', backgroundColor: '#0d0d14',
                  border: '1px solid #1e1e2e', borderRadius: 8, color: '#f0f0f8', fontSize: '0.9rem',
                }}
              />
              <input
                type="number" placeholder="kg"
                value={set.weight} onChange={e => {
                  const s = [...sets]; s[i].weight = e.target.value; setSets(s)
                }}
                style={{
                  flex: 1, padding: '8px', backgroundColor: '#0d0d14',
                  border: '1px solid #1e1e2e', borderRadius: 8, color: '#f0f0f8', fontSize: '0.9rem',
                }}
              />
              <span style={{ fontSize: '1rem' }}>
                {set.reps && set.weight ? '✅' : '⬜'}
              </span>
            </div>
          ))}
          <button onClick={addSet} style={{
            width: '100%', padding: '8px',
            backgroundColor: 'transparent', border: '1.5px dashed #1e1e2e',
            borderRadius: 8, color: '#5a5a7a', cursor: 'pointer', fontSize: '0.85rem',
            marginTop: 4,
          }}>+ Add Set</button>
        </div>
      )}
    </div>
  )
}

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
      setActiveDay(0)
    } catch (e) {
      alert('Could not generate workout. Check your connection and try again.')
    }
    setLoading(false)
  }

  const activeWorkout = program?.workouts?.[activeDay]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050508', color: '#f0f0f8', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 1rem 0' }}>
        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          color: '#f0f0f8', fontSize: '2rem', fontWeight: 800,
        }}>💪 MY <span style={{ color: '#c8f135' }}>PROGRAM</span></h1>
      </div>

      <div style={{ padding: '1rem 1rem 0' }}>
        <button onClick={generateProgram} disabled={loading} style={{
          width: '100%', padding: '14px',
          backgroundColor: program ? '#12121c' : '#c8f135',
          color: program ? '#c8f135' : '#050508',
          border: program ? '1.5px solid #c8f135' : 'none',
          borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
          boxShadow: program ? 'none' : '0 4px 20px rgba(200,241,53,0.3)',
          marginBottom: '1.25rem',
        }}>
          {loading ? '⏳ Generating your program...' : program ? '🔄 Regenerate Program' : '⚡ Generate My AI Program'}
        </button>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#5a5a7a' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🤖</div>
            <p style={{ fontSize: '0.9rem' }}>AI is building your personalized program...</p>
          </div>
        )}

        {program && !loading && (
          <>
            {/* Program summary */}
            <div style={{
              background: 'linear-gradient(135deg, #1a2200, #0d1a00)',
              border: '1px solid rgba(200,241,53,0.25)',
              borderRadius: 14, padding: '1rem 1.1rem', marginBottom: '1.25rem',
            }}>
              <h2 style={{ color: '#c8f135', fontSize: '1rem', fontWeight: 700 }}>
                {program.name || 'My Workout Program'}
              </h2>
              <p style={{ color: '#8888aa', fontSize: '0.85rem', marginTop: 4 }}>
                {program.workouts?.length} training days/week
              </p>
            </div>

            {/* Day tabs */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: '1.25rem',
              paddingBottom: 4, scrollbarWidth: 'none' }}>
              {program.workouts?.map((w, i) => (
                <button key={i} onClick={() => setActiveDay(i)} style={{
                  padding: '8px 16px', borderRadius: 9999, border: 'none',
                  backgroundColor: activeDay === i ? '#c8f135' : '#12121c',
                  color: activeDay === i ? '#050508' : '#5a5a7a',
                  fontWeight: 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', fontSize: '0.85rem',
                  border: activeDay === i ? 'none' : '1px solid #1e1e2e',
                  transition: 'all 0.2s',
                }}>
                  {w.name || `Day ${i + 1}`}
                </button>
              ))}
            </div>

            {/* Exercises */}
            {activeWorkout && (
              <div className="fade-up">
                {activeWorkout.exercises?.map((ex, i) => (
                  <ExerciseCard key={i} ex={ex} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {!program && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#5a5a7a' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>🏋️</div>
            <p style={{ fontSize: '0.9rem' }}>Tap the button above to generate your personalized AI workout program!</p>
          </div>
        )}
      </div>

      <Nav />
    </div>
  )
}
