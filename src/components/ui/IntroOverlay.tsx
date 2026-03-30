import { useState, useEffect } from 'react'

const INTRO_STEPS = [
  {
    title: 'The Human Heart',
    text: 'An interactive 3D cardiac anatomy visualization with real-time simulation of the cardiac cycle.',
  },
  {
    title: 'Explore the Anatomy',
    text: 'Drag to rotate the heart. Scroll to zoom in and out. Click any structure label to see detailed anatomy, pathology, and surgical relevance.',
  },
  {
    title: 'View Modes',
    text: 'Use Observe mode to watch the heart beat. Switch to Study mode to pause and scrub through each phase. Try Quiz mode to test your knowledge.',
  },
  {
    title: 'Overlays',
    text: 'Toggle overlays on the right panel to view the conduction system, coronary arteries, cardiac veins, auscultation points, surgical landmarks, and more.',
  },
]

export function IntroOverlay() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      if (localStorage.getItem('heart-intro-seen') === 'true') {
        setVisible(false)
      }
    } catch { /* private browsing */ }
  }, [])

  if (!visible) return null

  const current = INTRO_STEPS[step]
  const isLast = step >= INTRO_STEPS.length - 1

  return (
    <div
      className="intro-overlay"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="intro-card" onClick={(e) => e.stopPropagation()}>
        <div className="intro-step-indicator">
          {INTRO_STEPS.map((_, i) => (
            <span
              key={i}
              className={`intro-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            />
          ))}
        </div>
        <h2 className="intro-title">{current.title}</h2>
        <p className="intro-text">{current.text}</p>
        <div className="intro-actions">
          <button
            type="button"
            className="intro-skip"
            onClick={() => {
              setVisible(false)
              try { localStorage.setItem('heart-intro-seen', 'true') } catch {}
            }}
          >
            Skip
          </button>
          <button
            type="button"
            className="intro-next"
            onClick={() => {
              if (isLast) {
                setVisible(false)
                try { localStorage.setItem('heart-intro-seen', 'true') } catch {}
              } else {
                setStep(step + 1)
              }
            }}
          >
            {isLast ? 'Begin' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
