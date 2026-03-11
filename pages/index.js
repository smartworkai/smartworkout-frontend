export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050508',
      color: '#f0f0f8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>💪</div>
      <h1 style={{ fontSize: '2.5rem', color: '#c8f135', textAlign: 'center', marginBottom: '0.5rem' }}>
        SmartWorkout AI
      </h1>
      <p style={{ color: '#6b6b8a', fontSize: '1.1rem', textAlign: 'center', marginBottom: '2.5rem' }}>
        Your FREE AI Personal Trainer
      </p>
      <a href="/auth" style={{
        backgroundColor: '#c8f135',
        color: '#050508',
        padding: '1rem 3rem',
        borderRadius: '9999px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
      }}>
        Get Started 🚀
      </a>
    </div>
  )
}
