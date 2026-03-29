import { useState, useEffect } from 'react'

const INTRO_STEPS = [
  {
    title: 'The Human Heart',
    text: 'An interactive cardiac anatomy visualization. Watch a real-time simulation of the cardiac cycle with medically accurate timing.',
  },
  {
    title: 'Explore',
    text: 'Drag to rotate. Scroll to zoom. Click any structure label for detailed anatomy, pathology, and surgical relevance.',
  },
  {
    title: 'Observe & Study',
    text: 'Switch between Observe mode (watch it beat), Study mode (pause and scrub through each phase), and Quiz mode (test your knowledge).',
  },
  {
    title: 'Toggle Overlays',
    text: 'Activate overlays to see the conduction system, coronary arteries, auscultation points, and cross-section views.',
  },
]

export function IntroOverlay() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  // Check if user has seen the intro before
  useEffect(() => {
    try {
      if (localStorage.getItem('heart-intro-seen') === 'true') {
        setVisible(false)
      }
    } catch { /* private browsing */ }
  }, [])

  const handleNext = () => {
    if (step < INTRO_STEPS.length - 1) {
      setStep(step + 1)
    } else {
      dismiss()
    }
  }

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem('heart-intro-seen', 'true')
    } catch { /* private browsing */ }
  }

  if (!visible) return null

  const current = INTRO_STEPS[step]

  return (
    <div className="intro-overlay">
      <div className="intro-card">
        <div className="intro-step-indicator">
          {INTRO_STEPS.map((_, i) => (
            <span key={i} className={`intro-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
          ))}
        </div>
        <h2 className="intro-title">{current.title}</h2>
        <p className="intro-text">{current.text}</p>
        <div className="intro-actions">
          <button className="intro-skip" onClick={dismiss}>Skip</button>
          <button className="intro-next" onClick={handleNext}>
            {step < INTRO_STEPS.length - 1 ? 'Next' : 'Begin'}
          </button>
        </div>
      </div>
    </div>
  )
}
