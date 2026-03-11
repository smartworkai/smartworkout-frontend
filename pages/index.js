import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
    const token = localStorage.getItem('token')
    window.location.href = token ? '/dashboard' : '/auth'
  }, [])
  return null
}
