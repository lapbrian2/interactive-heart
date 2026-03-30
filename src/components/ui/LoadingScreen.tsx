import { useState, useEffect } from 'react'
import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { progress } = useProgress()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (progress >= 100) {
      // Fade out after a brief pause
      const timer = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(timer)
    }
  }, [progress])

  if (!visible) return null

  return (
    <div className={`loading-screen ${progress >= 100 ? 'fade-out' : ''}`} aria-label="Loading heart model">
      <div className="loading-heart">&#x2665;</div>
      <div className="loading-bar-track">
        <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="loading-text">
        {progress < 100 ? `Loading anatomy ${Math.round(progress)}%` : 'Initializing cardiac cycle...'}
      </p>
    </div>
  )
}
