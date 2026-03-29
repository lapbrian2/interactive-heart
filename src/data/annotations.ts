import { type Phase } from './cardiac-timing'

export interface Annotation {
  structureId: string
  name: string
  description: string
  failureMode: string
  relatedPhases: Phase[]
}

export const ANNOTATIONS: Record<string, Annotation> = {
  'left-ventricle': {
    structureId: 'left-ventricle',
    name: 'Left Ventricle',
    description:
      'The thickest chamber of the heart. Pumps oxygenated blood through the aortic valve into the aorta and out to the entire body. Generates the highest pressure of any chamber.',
    failureMode:
      'Left ventricular failure leads to pulmonary edema — fluid backs up into the lungs, causing shortness of breath. This is the most common form of heart failure.',
    relatedPhases: ['P2', 'P3', 'P4'],
  },
  'right-ventricle': {
    structureId: 'right-ventricle',
    name: 'Right Ventricle',
    description:
      'Pumps deoxygenated blood through the pulmonary valve to the lungs. Thinner walls than the left ventricle because the lungs require less pressure.',
    failureMode:
      'Right ventricular failure causes fluid buildup in the body — swollen ankles, distended abdomen, and jugular vein distension.',
    relatedPhases: ['P2', 'P3', 'P4'],
  },
  'mitral-valve': {
    structureId: 'mitral-valve',
    name: 'Mitral Valve',
    description:
      'Two-leaflet valve between the left atrium and left ventricle. Opens during filling to let blood in, closes during contraction to prevent backflow. Its closure produces the first heart sound (S1).',
    failureMode:
      'Mitral regurgitation: the valve leaks, allowing blood to flow backward into the left atrium. Causes fatigue, shortness of breath, and can lead to atrial fibrillation.',
    relatedPhases: ['P1', 'P2', 'P6'],
  },
  'tricuspid-valve': {
    structureId: 'tricuspid-valve',
    name: 'Tricuspid Valve',
    description:
      'Three-leaflet valve between the right atrium and right ventricle. Works in sync with the mitral valve — opens during filling, closes during contraction.',
    failureMode:
      'Tricuspid regurgitation: blood leaks back into the right atrium. Often caused by pulmonary hypertension stretching the valve ring.',
    relatedPhases: ['P1', 'P2', 'P6'],
  },
  aorta: {
    structureId: 'aorta',
    name: 'Aorta',
    description:
      'The largest artery in the body. Receives oxygenated blood from the left ventricle and distributes it to every organ through branching arteries.',
    failureMode:
      'Aortic aneurysm: weakened wall balloons outward and can rupture — a life-threatening emergency. Aortic dissection tears the wall layers apart.',
    relatedPhases: ['P3', 'P4'],
  },
}
