import { useEffect, useState } from 'react'

export default function Index() {
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      window.location.href = token ? '/dashboard' : '/auth'
    } catch (e) {
      window.location.href = '/auth'
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050508',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    }}>
      <div style={{
        width: 72, height: 72,
        background: 'linear-gradient(135deg, #c8f135, #7ab010)',
        borderRadius: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem',
        boxShadow: '0 8px 32px rgba(200,241,53,0.25)',
      }}>💪</div>
      <p style={{ color: '#5a5a7a', fontSize: '0.9rem' }}>Loading SmartWorkout AI...</p>
    </div>
  )
}
