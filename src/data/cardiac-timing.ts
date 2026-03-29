export type Phase = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7'

export const PHASES: Phase[] = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7']

export const PHASE_NAMES: Record<Phase, string> = {
  P1: 'Atrial Systole',
  P2: 'Isovolumetric Contraction',
  P3: 'Rapid Ejection',
  P4: 'Reduced Ejection',
  P5: 'Isovolumetric Relaxation',
  P6: 'Rapid Filling',
  P7: 'Diastasis',
}

// Reference durations at 72 BPM (ms)
export const REFERENCE_DURATIONS = [100, 50, 110, 130, 70, 110, 263] as const

const P7_FLOOR = 50
const FIXED_PHASES_TOTAL = REFERENCE_DURATIONS.slice(0, 6).reduce((a, b) => a + b, 0) // 570ms

export function computePhaseDurations(bpm: number): number[] {
  const cycleDuration = 60000 / bpm
  const p7Available = cycleDuration - FIXED_PHASES_TOTAL

  if (p7Available >= P7_FLOOR) {
    return [...REFERENCE_DURATIONS.slice(0, 6), p7Available]
  }

  const remainingTime = cycleDuration - P7_FLOOR
  const scaleFactor = remainingTime / FIXED_PHASES_TOTAL
  const scaled = REFERENCE_DURATIONS.slice(0, 6).map((d) => d * scaleFactor)
  return [...scaled, P7_FLOOR]
}

export type ValveStates = Record<'mitral' | 'tricuspid' | 'aortic' | 'pulmonary', boolean>

export function getValveStates(phase: Phase): ValveStates {
  const avOpen = phase === 'P1' || phase === 'P6' || phase === 'P7'
  const slOpen = phase === 'P3' || phase === 'P4'

  return {
    mitral: avOpen,
    tricuspid: avOpen,
    aortic: slOpen,
    pulmonary: slOpen,
  }
}

export const CONDUCTION_TIMING = {
  saToAtrialEnd: 50,
  atrialEndToAvExit: 120,
  avToHisEnd: 20,
  hisToPurkinjeEnd: 60,
  totalDepolarization: 250,
} as const
