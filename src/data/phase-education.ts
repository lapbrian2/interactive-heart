import { type Phase } from './cardiac-timing'

export interface PhaseEducation {
  title: string
  event: string
  detail: string
  structures: string[]
  ecgEvent: string
  clinicalNote: string
}

export const PHASE_EDUCATION: Record<Phase, PhaseEducation> = {
  P1: {
    title: 'Atrial Systole',
    event: 'The SA node fires. Both atria contract simultaneously, squeezing the last 20-30% of blood into the ventricles.',
    detail: 'The sinoatrial node — the heart\'s natural pacemaker — initiates an electrical impulse that spreads across both atria at ~1 m/s. This produces the P wave on the ECG.',
    structures: ['SA Node', 'Left Atrium', 'Right Atrium', 'Mitral Valve', 'Tricuspid Valve'],
    ecgEvent: 'P Wave — Atrial Depolarization',
    clinicalNote: 'The "atrial kick" contributes 20-30% of ventricular filling. In atrial fibrillation, this kick is lost — reducing cardiac output by up to 25%.',
  },
  P2: {
    title: 'Isovolumetric Contraction',
    event: 'All four valves slam shut. The ventricles squeeze against a closed system — pressure builds explosively but no blood moves yet.',
    detail: 'The AV valves (mitral and tricuspid) close first, producing the S1 heart sound — the "lub." Ventricular pressure rises from ~8 mmHg to ~80 mmHg in just 50ms.',
    structures: ['Left Ventricle', 'Right Ventricle', 'Mitral Valve', 'Tricuspid Valve'],
    ecgEvent: 'QRS Complex — Ventricular Depolarization',
    clinicalNote: 'S1 heart sound occurs here. A split S1 (mitral closing before tricuspid) can indicate a bundle branch block.',
  },
  P3: {
    title: 'Rapid Ejection',
    event: 'Ventricular pressure exceeds arterial pressure. The aortic and pulmonary valves burst open — 70% of the stroke volume rockets out in this phase alone.',
    detail: 'The left ventricle ejects blood at velocities up to 1.5 m/s through the aortic valve. Peak systolic pressure reaches ~120 mmHg. The aortic root expands to absorb the force.',
    structures: ['Aorta', 'Pulmonary Artery', 'Aortic Valve', 'Pulmonary Valve'],
    ecgEvent: 'ST Segment — Ventricular Plateau',
    clinicalNote: 'Ejection fraction (EF) — the percentage of blood pumped out per beat — is measured here. Normal EF is 55-70%. Below 40% indicates heart failure.',
  },
  P4: {
    title: 'Reduced Ejection',
    event: 'Ejection slows as the ventricles begin to relax. The remaining 30% of blood leaves at a decreasing rate. The ventricles start repolarizing.',
    detail: 'Ventricular pressure begins falling below aortic pressure. Blood continues forward briefly due to momentum (inertia). The T wave appears as ventricular muscle repolarizes.',
    structures: ['Left Ventricle', 'Right Ventricle', 'Aorta'],
    ecgEvent: 'T Wave — Ventricular Repolarization',
    clinicalNote: 'T wave abnormalities (inverted, peaked, or flattened) are critical diagnostic markers for ischemia, electrolyte imbalances, and myocardial infarction.',
  },
  P5: {
    title: 'Isovolumetric Relaxation',
    event: 'All valves shut again. The ventricles relax rapidly — pressure plummets but volume stays constant. The heart resets.',
    detail: 'The aortic and pulmonary valves close, producing the S2 heart sound — the "dub." Ventricular pressure drops from ~120 mmHg back toward 0 in just 70ms.',
    structures: ['Aortic Valve', 'Pulmonary Valve', 'Left Ventricle', 'Right Ventricle'],
    ecgEvent: 'End of T Wave — S2 Heart Sound',
    clinicalNote: 'S2 splitting (aortic closing before pulmonary) is normal during inspiration. Fixed splitting suggests an atrial septal defect.',
  },
  P6: {
    title: 'Rapid Filling',
    event: 'The AV valves open and blood rushes passively into the ventricles — no contraction needed. 75% of ventricular filling happens right now, driven by pressure alone.',
    detail: 'Ventricular pressure falls below atrial pressure, the mitral and tricuspid valves open, and blood flows downhill from atria to ventricles. This is entirely passive — the atria don\'t contract.',
    structures: ['Mitral Valve', 'Tricuspid Valve', 'Left Ventricle', 'Right Ventricle'],
    ecgEvent: 'Isoelectric Baseline — Electrical Silence',
    clinicalNote: 'An S3 heart sound during rapid filling is normal in young adults but in older patients suggests volume overload or heart failure.',
  },
  P7: {
    title: 'Diastasis',
    event: 'The quiet phase. Slow passive filling continues. The heart rests. The SA node prepares to fire again.',
    detail: 'Filling rate slows to a trickle as atrial and ventricular pressures equalize. At rest (72 BPM), this phase lasts ~260ms — the longest single phase. At high heart rates, it compresses first.',
    structures: ['SA Node'],
    ecgEvent: 'TP Segment — Awaiting Next Cycle',
    clinicalNote: 'At very high heart rates (>150 BPM), diastasis nearly disappears — the heart has less time to fill, which reduces stroke volume and cardiac output despite the faster rate.',
  },
}
