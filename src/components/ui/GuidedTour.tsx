import { useState, useCallback } from 'react'
import { useSimStore } from '../../store/useSimStore'

/**
 * Guided narrative tour — walks the user through cardiac anatomy
 * step by step. Each step:
 * - Narrates what you're looking at
 * - Activates the relevant overlay
 * - Sets BPM/phase if needed
 */

const TOUR_STEPS = [
  {
    title: 'The Exterior',
    text: 'This is the human heart — a muscular pump the size of your fist. It beats approximately 100,000 times per day, pumping about 7,500 liters of blood. The surface you see is the epicardium, covered in coronary vessels that supply blood to the heart muscle itself.',
    overlays: ['muscle'] as string[],
    bpm: 72,
  },
  {
    title: 'The Coronary Arteries',
    text: 'Three major arteries supply the heart: the LAD (left anterior descending) feeds the front wall, the LCx (left circumflex) wraps around the back, and the RCA (right coronary) supplies the right side and bottom. When these block, heart attacks happen.',
    overlays: ['muscle', 'coronary'] as string[],
    bpm: 72,
  },
  {
    title: 'The Cardiac Veins',
    text: 'The heart drains its own blood through cardiac veins into the coronary sinus, which empties into the right atrium. The great cardiac vein runs alongside the LAD. These veins are important for placing pacemaker leads.',
    overlays: ['muscle', 'veins'] as string[],
    bpm: 72,
  },
  {
    title: 'The Conduction System',
    text: 'Watch the electrical wave: the SA node fires at the top of the right atrium, the signal spreads across both atria, pauses at the AV node (120ms delay), then shoots down the Bundle of His and fans out through the Purkinje fibers. This entire sequence takes about 225ms.',
    overlays: ['muscle', 'conduction'] as string[],
    bpm: 60,
  },
  {
    title: 'Inside the Heart',
    text: 'The heart has four chambers separated by the interventricular septum. The thick left ventricle generates systemic pressure (~120 mmHg). The thin right ventricle pushes blood to the lungs at much lower pressure (~25 mmHg). Note the papillary muscles anchoring the valve leaflets via chordae tendineae.',
    overlays: ['interior'] as string[],
    bpm: 72,
  },
  {
    title: 'The Pericardium',
    text: 'Surrounding the heart is the pericardium — a tough fibrous sac that anchors the heart to the diaphragm and great vessels. Between the pericardium and the heart surface lies ~20mL of lubricating fluid. Rapid accumulation causes cardiac tamponade — a surgical emergency.',
    overlays: ['muscle', 'pericardium'] as string[],
    bpm: 72,
  },
  {
    title: 'Auscultation',
    text: 'These five points mark where a stethoscope detects each valve. The mitral area (apex) is where S1 is loudest. The aortic area (2nd right intercostal) is where S2 is loudest. Knowing these locations is a fundamental clinical skill.',
    overlays: ['muscle', 'auscultation'] as string[],
    bpm: 72,
  },
  {
    title: 'Surgical Landmarks',
    text: 'The yellow line marks the median sternotomy — the standard surgical approach. Cross-hair markers show where the surgeon cannulates for bypass (ascending aorta for arterial, SVC+IVC for venous). The red triangle is the Triangle of Koch — a DANGER ZONE where sutures can damage the AV node and cause complete heart block.',
    overlays: ['muscle', 'surgical'] as string[],
    bpm: 72,
  },
  {
    title: 'The Cardiac Cycle',
    text: 'Now watch it all come together. The heart beats through 7 phases: atrial systole, isovolumetric contraction, rapid ejection, reduced ejection, isovolumetric relaxation, rapid filling, and diastasis. The ECG, Wiggers diagram, and PV loop below all track the same cycle in real time. Adjust the heart rate with the slider to see how the timing changes.',
    overlays: ['muscle', 'conduction'] as string[],
    bpm: 72,
  },
]

export function GuidedTour() {
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const toggleLayer = useSimStore((s) => s.toggleLayer)
  const setBPM = useSimStore((s) => s.setBPM)
  const setViewMode = useSimStore((s) => s.setViewMode)
  const setPaused = useSimStore((s) => s.setPaused)
  const setScrubPosition = useSimStore((s) => s.setScrubPosition)

  const applyStep = useCallback((stepIdx: number) => {
    const s = TOUR_STEPS[stepIdx]
    // Reset to observatory
    setViewMode('observatory')
    setPaused(false)
    setScrubPosition(null)
    setBPM(s.bpm)

    // Set overlays — clear all then enable step's overlays
    const store = useSimStore.getState()
    const allLayers = ['muscle', 'valves', 'conduction', 'coronary', 'crossSection', 'auscultation', 'pericardium', 'veins', 'surgical', 'interior'] as const
    allLayers.forEach((layer) => {
      const isActive = store.activeLayers.has(layer)
      const shouldBeActive = s.overlays.includes(layer)
      if (isActive !== shouldBeActive) toggleLayer(layer)
    })
  }, [toggleLayer, setBPM, setViewMode, setPaused, setScrubPosition])

  const start = () => {
    setActive(true)
    setStep(0)
    applyStep(0)
  }

  const next = () => {
    if (step < TOUR_STEPS.length - 1) {
      const nextStep = step + 1
      setStep(nextStep)
      applyStep(nextStep)
    } else {
      end()
    }
  }

  const prev = () => {
    if (step > 0) {
      const prevStep = step - 1
      setStep(prevStep)
      applyStep(prevStep)
    }
  }

  const end = () => {
    setActive(false)
    setStep(0)
  }

  if (!active) {
    return (
      <button className="tour-start-btn" onClick={start} type="button">
        Guided Tour
      </button>
    )
  }

  const current = TOUR_STEPS[step]

  return (
    <div className="tour-overlay">
      <div className="tour-card">
        <div className="tour-progress">
          <span className="tour-step-num">{step + 1} / {TOUR_STEPS.length}</span>
          <div className="tour-progress-bar">
            <div className="tour-progress-fill" style={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }} />
          </div>
        </div>
        <h3 className="tour-title">{current.title}</h3>
        <p className="tour-text">{current.text}</p>
        <div className="tour-actions">
          <button type="button" className="tour-btn tour-btn-secondary" onClick={end}>Exit</button>
          <div className="tour-nav">
            {step > 0 && (
              <button type="button" className="tour-btn tour-btn-secondary" onClick={prev}>Back</button>
            )}
            <button type="button" className="tour-btn tour-btn-primary" onClick={next}>
              {step < TOUR_STEPS.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
