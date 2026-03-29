import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { type Phase } from '../data/cardiac-timing'

export type Layer = 'muscle' | 'valves' | 'conduction'
export type ArrhythmiaType = 'sinus'

interface SimState {
  bpm: number
  arrhythmia: ArrhythmiaType
  activeLayers: Set<Layer>
  selectedStructure: string | null
  currentPhase: Phase
  phaseProgress: number
  cycleElapsed: number

  setBPM: (bpm: number) => void
  setArrhythmia: (type: ArrhythmiaType) => void
  toggleLayer: (layer: Layer) => void
  selectStructure: (id: string | null) => void
}

export const useSimStore = create<SimState>()(
  subscribeWithSelector((set) => ({
    bpm: 72,
    arrhythmia: 'sinus' as ArrhythmiaType,
    activeLayers: new Set<Layer>(['muscle', 'valves', 'conduction']),
    selectedStructure: null,
    currentPhase: 'P1' as Phase,
    phaseProgress: 0,
    cycleElapsed: 0,

    setBPM: (bpm) => set({ bpm: Math.max(40, Math.min(180, bpm)) }),
    setArrhythmia: (arrhythmia) => set({ arrhythmia }),
    toggleLayer: (layer) =>
      set((state) => {
        const next = new Set(state.activeLayers)
        if (next.has(layer)) next.delete(layer)
        else next.add(layer)
        return { activeLayers: next }
      }),
    selectStructure: (id) => set({ selectedStructure: id }),
  }))
)
