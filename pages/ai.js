import { useState, useRef, useEffect } from 'react'
import Nav from '../components/Nav'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smartworkout-backend.vercel.app/api'
const SUGGESTIONS = [
  'How do I do a hip thrust?',
  'Best exercises for glutes?',
  'How many calories should I eat?',
  'Build me a weekly plan',
]

function MacroBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#8888aa', fontSize: '0.8rem' }}>{label}</span>
        <span style={{ color: '#f0f0f8', fontWeight: 700, fontSize: '0.8rem' }}>{value}g</span>
      </div>
      <div style={{ height: 6, backgroundColor: '#1e1e2e', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', backgroundColor: color, borderRadius: 3,
          transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

export default function AI() {
  const [tab, setTab] = useState('chat')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! 👋 I'm your AI personal trainer. Ask me anything about fitness, workouts, or nutrition!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mealPlan, setMealPlan] = useState(null)
  const [mealLoading, setMealLoading] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanLoading, setScanLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (msg) => {
    const text = msg || input
    if (!text.trim()) return
    setInput('')
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API + '/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ message: text, history: messages.slice(-6) }),
      })
      const data = await res.json()
      setMessages([...newMessages, {
        role: 'assistant',
        content: data.reply || data.message || "I'm here to help! Ask me anything."
      }])
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, connection failed. Please try again.' }])
    }
    setLoading(false)
  }

  const generateMealPlan = async () => {
    setMealLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API + '/ai/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      })
      const data = await res.json()
      setMealPlan(data)
    } catch (e) {
      alert('Could not generate meal plan. Try again.')
    }
    setMealLoading(false)
  }

  const runBodyScan = async () => {
    setScanLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API + '/ai/body-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      })
      const data = await res.json()
      setScanResult(data)
    } catch (e) {
      alert('Could not run scan. Try again.')
    }
    setScanLoading(false)
  }

  const TABS = [
    { id: 'chat',  label: '💬 Chat'      },
    { id: 'meals', label: '🍽️ Meals'     },
    { id: 'scan',  label: '📷 Body Scan' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050508', color: '#f0f0f8',
      display: 'flex', flexDirection: 'column', paddingBottom: 64 }}>

      {/* Header + Tabs */}
      <div style={{ backgroundColor: '#050508', borderBottom: '1px solid #1e1e2e',
        padding: '1.25rem 1rem 0', position: 'sticky', top: 0, zIndex: 10,
        backdropFilter: 'blur(12px)' }}>
        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem',
        }}>🤖 AI <span style={{ color: '#c8f135' }}>COACH</span></h1>
        <div style={{ display: 'flex', gap: 6, paddingBottom: '0.75rem', overflowX: 'auto',
          scrollbarWidth: 'none' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 14px', borderRadius: 9999, border: 'none',
              backgroundColor: tab === t.id ? '#c8f135' : '#12121c',
              color: tab === t.id ? '#050508' : '#5a5a7a',
              fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.85rem',
              border: tab === t.id ? 'none' : '1px solid #1e1e2e',
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* CHAT TAB */}
      {tab === 'chat' && (
        <>
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
            paddingBottom: '120px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? '#c8f135' : '#12121c',
                color: msg.role === 'user' ? '#050508' : '#f0f0f8',
                border: msg.role === 'user' ? 'none' : '1px solid #1e1e2e',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                maxWidth: '82%', fontSize: '0.92rem', lineHeight: 1.5,
                fontWeight: msg.role === 'user' ? 600 : 400,
              }}>
                {msg.role === 'assistant' && (
                  <span style={{ marginRight: 6, fontSize: '1rem' }}>🤖</span>
                )}
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start', backgroundColor: '#12121c', border: '1px solid #1e1e2e',
                padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
              }}>
                <span style={{ color: '#5a5a7a', fontSize: '0.85rem' }}>🤖 Thinking</span>
                <span style={{ animation: 'pulse 1.2s infinite', color: '#c8f135' }}> ●●●</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{
            position: 'fixed', bottom: 64, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: '430px',
            backgroundColor: 'rgba(13,13,20,0.97)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid #1e1e2e',
            padding: '10px 12px',
          }}>
            {/* Quick chips */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 8,
              scrollbarWidth: 'none', paddingBottom: 2 }}>
              {SUGGESTIONS.map((s, i) => (
                <span key={i} onClick={() => sendMessage(s)} style={{
                  padding: '5px 10px', backgroundColor: '#12121c',
                  border: '1px solid #1e1e2e', borderRadius: 9999,
                  color: '#8888aa', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.73rem',
                  transition: 'all 0.15s',
                }}>{s}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{
                  flex: 1, padding: '11px 14px',
                  backgroundColor: '#12121c', border: '1.5px solid #1e1e2e',
                  borderRadius: 12, color: '#f0f0f8', fontSize: '0.95rem',
                }}
                placeholder="Ask your AI trainer..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={() => sendMessage()} style={{
                padding: '11px 14px', backgroundColor: '#c8f135',
                border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: '1.1rem',
              }}>➤</button>
            </div>
          </div>
        </>
      )}

      {/* MEALS TAB */}
      {tab === 'meals' && (
        <div style={{ padding: '1rem', overflowY: 'auto' }}>
          <button onClick={generateMealPlan} disabled={mealLoading} style={{
            width: '100%', padding: '14px',
            backgroundColor: '#c8f135', color: '#050508',
            border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            marginBottom: '1.25rem',
            boxShadow: '0 4px 20px rgba(200,241,53,0.25)',
          }}>
            {mealLoading ? '⏳ Generating your plan...' : '🍽️ Generate My Meal Plan'}
          </button>

          {mealPlan && (
            <>
              {/* Daily totals */}
              <div style={{
                background: 'linear-gradient(135deg, #1a2200, #0d1a00)',
                border: '1px solid rgba(200,241,53,0.25)',
                borderRadius: 14, padding: '1.1rem', marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '1rem' }}>
                  <p style={{ color: '#c8f135', fontWeight: 700, fontSize: '0.9rem' }}>
                    Daily Targets
                  </p>
                  <span style={{ color: '#c8f135', fontWeight: 800, fontSize: '1.1rem',
                    fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {mealPlan.daily_calories} kcal
                  </span>
                </div>
                <MacroBar label="Protein" value={mealPlan.daily_protein_g || 0}
                  max={250} color="#c8f135" />
                <MacroBar label="Carbs" value={mealPlan.daily_carbs_g || 0}
                  max={400} color="#60a5fa" />
                <MacroBar label="Fat" value={mealPlan.daily_fat_g || 0}
                  max={150} color="#f97316" />
              </div>

              {mealPlan.meals?.map((meal, i) => (
                <div key={i} style={{
                  backgroundColor: '#12121c', border: '1px solid #1e1e2e',
                  borderRadius: 14, padding: '1.1rem', marginBottom: '0.75rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 8 }}>
                    <span style={{
                      backgroundColor: 'rgba(200,241,53,0.15)', color: '#c8f135',
                      padding: '3px 10px', borderRadius: 9999, fontSize: '0.72rem',
                      fontWeight: 700, textTransform: 'capitalize',
                    }}>{meal.meal_type}</span>
                    <span style={{ color: '#c8f135', fontWeight: 700, fontSize: '0.9rem' }}>
                      {meal.calories} kcal
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{meal.name}</h3>
                  <p style={{ color: '#8888aa', fontSize: '0.82rem', marginBottom: 8 }}>{meal.description}</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { l: 'P', v: meal.protein_g + 'g', c: '#c8f135' },
                      { l: 'C', v: meal.carbs_g + 'g',   c: '#60a5fa' },
                      { l: 'F', v: meal.fat_g + 'g',     c: '#f97316' },
                    ].map((m, j) => (
                      <div key={j} style={{ textAlign: 'center' }}>
                        <div style={{ color: m.c, fontWeight: 700, fontSize: '0.85rem' }}>{m.v}</div>
                        <div style={{ color: '#5a5a7a', fontSize: '0.7rem' }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* BODY SCAN TAB */}
      {tab === 'scan' && (
        <div style={{ padding: '1rem', overflowY: 'auto' }}>
          {!scanResult ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#12121c',
                border: '2px dashed #1e1e2e',
                borderRadius: 14, padding: '2.5rem 1rem',
                marginBottom: '1.25rem',
              }}>
                <div style={{ fontSize: '5rem', marginBottom: '0.75rem' }}>🧍</div>
                <p style={{ color: '#8888aa', fontSize: '0.9rem', marginBottom: 4 }}>
                  AI Body Composition Analysis
                </p>
                <p style={{ color: '#5a5a7a', fontSize: '0.8rem' }}>
                  Based on your profile & measurements
                </p>
              </div>
              <button onClick={runBodyScan} disabled={scanLoading} style={{
                width: '100%', padding: '14px',
                backgroundColor: '#c8f135', color: '#050508',
                border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(200,241,53,0.25)',
              }}>
                {scanLoading ? '⏳ Analyzing...' : '🔍 Analyze My Body'}
              </button>
            </div>
          ) : (
            <div className="fade-up">
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                📊 Scan <span style={{ color: '#c8f135' }}>Results</span>
              </h2>

              {/* Key metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1rem' }}>
                {[
                  { icon: '🎯', label: 'Body Fat', value: (scanResult.body_fat_estimate_pct || '—') + '%' },
                  { icon: '⚖️', label: 'Symmetry', value: (scanResult.symmetry_score || '—') + '/10' },
                ].map((m, i) => (
                  <div key={i} style={{
                    background: 'linear-gradient(135deg, #1a2200, #0d1a00)',
                    border: '1px solid rgba(200,241,53,0.2)',
                    borderRadius: 14, padding: '1rem', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: 4 }}>{m.icon}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
                      color: '#c8f135', fontWeight: 800, fontSize: '1.6rem' }}>{m.value}</div>
                    <div style={{ color: '#8888aa', fontSize: '0.75rem', marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Posture notes */}
              {scanResult.posture_notes && (
                <div style={{
                  backgroundColor: '#12121c', border: '1px solid #1e1e2e',
                  borderRadius: 14, padding: '1rem', marginBottom: '1rem',
                }}>
                  <p style={{ color: '#c8f135', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>
                    📝 Analysis Notes
                  </p>
                  <p style={{ color: '#8888aa', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {scanResult.posture_notes}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {scanResult.recommendations?.length > 0 && (
                <div style={{ backgroundColor: '#12121c', border: '1px solid #1e1e2e',
                  borderRadius: 14, padding: '1rem' }}>
                  <p style={{ color: '#c8f135', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>
                    💡 Recommendations
                  </p>
                  {scanResult.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <span style={{ color: '#c8f135', marginTop: 2 }}>→</span>
                      <p style={{ color: '#8888aa', fontSize: '0.875rem', lineHeight: 1.5 }}>{rec}</p>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setScanResult(null)} style={{
                width: '100%', padding: '12px', marginTop: '1rem',
                backgroundColor: 'transparent', border: '1.5px solid #1e1e2e',
                borderRadius: 12, color: '#5a5a7a', cursor: 'pointer', fontSize: '0.9rem',
              }}>
                🔄 Run New Scan
              </button>
            </div>
          )}
        </div>
      )}

      <Nav />
    </div>
  )
}
