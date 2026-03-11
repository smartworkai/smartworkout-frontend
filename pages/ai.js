import { useState, useRef, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://smartworkout-backend.vercel.app/api'
const NAV = [
  { icon: '🏠', label: 'Home', href: '/dashboard' },
  { icon: '💪', label: 'Train', href: '/workouts' },
  { icon: '🤖', label: 'AI', href: '/ai' },
  { icon: '📊', label: 'Progress', href: '/progress' },
  { icon: '👤', label: 'Profile', href: '/profile' },
]
const SUGGESTIONS = ['How do I do a hip thrust?', 'Best exercises for glutes?', 'How many calories should I eat?', 'Create a weekly plan for me']

export default function AI() {
  const [tab, setTab] = useState('chat')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey! 👋 I am your AI personal trainer. Ask me anything about fitness, workouts, or nutrition!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mealPlan, setMealPlan] = useState(null)
  const [mealLoading, setMealLoading] = useState(false)
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
      setMessages([...newMessages, { role: 'assistant', content: data.reply || data.message || 'I am here to help! Ask me anything.' }])
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I could not connect. Please try again.' }])
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

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#050508', color: '#f0f0f8', display: 'flex', flexDirection: 'column' },
    header: { padding: '1.5rem 1rem 0', backgroundColor: '#050508' },
    tabs: { display: 'flex', gap: '0.5rem', padding: '1rem', overflowX: 'auto' },
    tab: (active) => ({ padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none', backgroundColor: active ? '#c8f135' : '#12121c', color: active ? '#050508' : '#6b6b8a', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.85rem' }),
    chatArea: { flex: 1, overflowY: 'auto', padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '10rem' },
    userMsg: { alignSelf: 'flex-end', backgroundColor: '#c8f135', color: '#050508', padding: '0.75rem 1rem', borderRadius: '1rem 1rem 0.25rem 1rem', maxWidth: '80%', fontWeight: '500' },
    aiMsg: { alignSelf: 'flex-start', backgroundColor: '#12121c', border: '1px solid #1e1e30', color: '#f0f0f8', padding: '0.75rem 1rem', borderRadius: '1rem 1rem 1rem 0.25rem', maxWidth: '80%' },
    inputArea: { position: 'fixed', bottom: '60px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', backgroundColor: '#0d0d14', borderTop: '1px solid #1e1e30', padding: '0.75rem' },
    inputRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' },
    input: { flex: 1, padding: '0.75rem', backgroundColor: '#12121c', border: '1px solid #1e1e30', borderRadius: '0.75rem', color: '#f0f0f8', fontSize: '0.95rem' },
    sendBtn: { padding: '0.75rem 1rem', backgroundColor: '#c8f135', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '1.2rem' },
    suggestions: { display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' },
    chip: { padding: '0.35rem 0.75rem', backgroundColor: '#12121c', border: '1px solid #1e1e30', borderRadius: '9999px', color: '#6b6b8a', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.75rem' },
    nav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', backgroundColor: '#12121c', borderTop: '1px solid #1e1e30', display: 'flex', justifyContent: 'space-around', padding: '0.6rem 0' },
    navItem: { textAlign: 'center', color: '#6b6b8a', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
    mealPage: { padding: '1rem 1rem 8rem' },
    mealCard: { backgroundColor: '#12121c', border: '1px solid #1e1e30', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1rem' },
    genBtn: { width: '100%', padding: '1rem', backgroundColor: '#c8f135', color: '#050508', border: 'none', borderRadius: '9999px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '1.5rem' },
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={{ color: '#c8f135', fontSize: '1.4rem' }}>🤖 AI Coach</h1>
      </div>

      <div style={s.tabs}>
        {['chat', 'meals', 'scan'].map(t => (
          <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>
            {t === 'chat' ? '💬 Chat' : t === 'meals' ? '🍽️ Meals' : '📷 Body Scan'}
          </button>
        ))}
      </div>

      {tab === 'chat' && (
        <>
          <div style={s.chatArea}>
            {messages.map((msg, i) => (
              <div key={i} style={msg.role === 'user' ? s.userMsg : s.aiMsg}>
                {msg.role === 'assistant' && <span style={{ marginRight: '0.5rem' }}>🤖</span>}
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={s.aiMsg}>🤖 Thinking...</div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={s.inputArea}>
            <div style={s.inputRow}>
              <input
                style={s.input}
                placeholder="Ask your AI trainer..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button style={s.sendBtn} onClick={() => sendMessage()}>➤</button>
            </div>
            <div style={s.suggestions}>
              {SUGGESTIONS.map((s2, i) => (
                <span key={i} style={s.chip} onClick={() => sendMessage(s2)}>{s2}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'meals' && (
        <div style={s.mealPage}>
          <button style={s.genBtn} onClick={generateMealPlan} disabled={mealLoading}>
            {mealLoading ? '⏳ Generating...' : '🍽️ Generate My Meal Plan'}
          </button>

          {mealPlan && (
            <>
              <div style={{ ...s.mealCard, backgroundColor: '#0d1a00', border: '1px solid #c8f135' }}>
                <p style={{ color: '#c8f135', fontWeight: 'bold' }}>Daily Totals</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Calories', val: mealPlan.daily_calories },
                    { label: 'Protein', val: mealPlan.daily_protein_g + 'g' },
                    { label: 'Carbs', val: mealPlan.daily_carbs_g + 'g' },
                    { label: 'Fat', val: mealPlan.daily_fat_g + 'g' },
                  ].map((m, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ color: '#c8f135', fontWeight: 'bold' }}>{m.val}</div>
                      <div style={{ color: '#6b6b8a', fontSize: '0.75rem' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {mealPlan.meals?.map((meal, i) => (
                <div key={i} style={s.mealCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ backgroundColor: '#c8f135', color: '#050508', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {meal.meal_type}
                    </span>
                    <span style={{ color: '#c8f135', fontWeight: 'bold' }}>{meal.calories} kcal</span>
                  </div>
                  <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1rem' }}>{meal.name}</h3>
                  <p style={{ color: '#6b6b8a', fontSize: '0.85rem' }}>{meal.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    {[
                      { label: 'P', val: meal.protein_g + 'g' },
                      { label: 'C', val: meal.carbs_g + 'g' },
                      { label: 'F', val: meal.fat_g + 'g' },
                    ].map((m, j) => (
                      <span key={j} style={{ color: '#6b6b8a', fontSize: '0.8rem' }}>
                        <span style={{ color: '#f0f0f8', fontWeight: 'bold' }}>{m.val}</span> {m.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {tab === 'scan' && (
        <div style={{ padding: '1rem 1rem 8rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#12121c', border: '2px dashed #1e1e30', borderRadius: '1rem', padding: '3rem 1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🧍</div>
            <p style={{ color: '#6b6b8a' }}>AI Body Scan Analysis</p>
            <p style={{ color: '#6b6b8a', fontSize: '0.8rem', marginTop: '0.5rem' }}>Based on your profile data</p>
          </div>
          <button
            style={{ width: '100%', padding: '1rem', backgroundColor: '#c8f135', color: '#050508', border: 'none', borderRadius: '9999px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
            onClick={async () => {
              try {
                const token = localStorage.getItem('token')
                const res = await fetch(API + '/ai/body-scan', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                })
                const data = await res.json()
                alert('Body Fat: ' + data.body_fat_estimate_pct + '%\nSymmetry Score: ' + data.symmetry_score + '/10\n' + data.posture_notes)
              } catch (e) {
                alert('Could not run scan. Try again.')
              }
            }}
          >
            🔍 Analyze My Body
          </button>
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
