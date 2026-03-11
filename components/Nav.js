import { useRouter } from 'next/router'

const ITEMS = [
  { icon: '🏠', label: 'Home',     href: '/dashboard' },
  { icon: '💪', label: 'Train',    href: '/workouts'  },
  { icon: '🤖', label: 'AI',       href: '/ai'        },
  { icon: '📊', label: 'Progress', href: '/progress'  },
  { icon: '👤', label: 'Profile',  href: '/profile'   },
]

export default function Nav() {
  const router = useRouter()
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '430px',
      backgroundColor: 'rgba(13,13,20,0.96)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid #1e1e2e',
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0 12px', zIndex: 100,
    }}>
      {ITEMS.map((item) => {
        const active = router.pathname === item.href
        return (
          <a key={item.href} href={item.href} style={{
            textAlign: 'center', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '3px', padding: '4px 12px',
            borderRadius: '12px', textDecoration: 'none',
          }}>
            <span style={{
              fontSize: '1.35rem', display: 'flex', alignItems: 'center',
              justifyContent: 'center', width: 36, height: 36, borderRadius: '10px',
              backgroundColor: active ? 'rgba(200,241,53,0.15)' : 'transparent',
            }}>{item.icon}</span>
            <span style={{
              fontSize: '0.6rem', fontWeight: active ? '700' : '500',
              color: active ? '#c8f135' : '#5a5a7a',
            }}>{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
