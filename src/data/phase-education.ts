import { type Phase } from './cardiac-timing'

export interface PhaseEducation {
  title: string
  event: string
  detail: string
  structures: string[]
  ecgEvent: string
  heartSound: string
  pressures: string
  clinicalNote: string
}

export const PHASE_EDUCATION: Record<Phase, PhaseEducation> = {
  P1: {
    title: 'Atrial Systole',
    event: 'The SA node fires. Both atria contract simultaneously, squeezing the final ~20% of blood into the ventricles.',
    detail: 'The sinoatrial node — the heart\'s natural pacemaker — initiates an electrical impulse that spreads across both atria at ~1 m/s via Bachmann\'s bundle (to LA) and the internodal pathways (to AV node). This produces the P wave on the ECG.',
    structures: ['SA Node', 'Left Atrium', 'Right Atrium', 'Mitral Valve', 'Tricuspid Valve'],
    ecgEvent: 'P Wave — Atrial Depolarization',
    heartSound: 'S4 may be audible (atrial gallop) — indicates stiff, non-compliant ventricle. Normal in elderly, pathological in young adults.',
    pressures: 'LA: 10-12 mmHg (a-wave). LV end-diastolic: 5-12 mmHg. Aortic: ~80 mmHg (diastolic). LV volume: 105→120 mL (atrial kick adds ~15 mL to reach EDV).',
    clinicalNote: 'The "atrial kick" contributes 15-25% of ventricular filling at rest. In atrial fibrillation, this kick is lost — reducing cardiac output by 15-25%. At high heart rates (where diastasis disappears), the atrial contribution becomes critical.',
  },
  P2: {
    title: 'Isovolumetric Contraction',
    event: 'All four valves slam shut. The ventricles squeeze against a closed system — pressure builds explosively but no blood moves yet.',
    detail: 'The AV valves (mitral and tricuspid) close first, producing the S1 heart sound — the "lub." Ventricular pressure rises from ~8 to ~80 mmHg in just 50ms. All cardiac valves are closed simultaneously. Volume is constant (isovolumetric).',
    structures: ['Left Ventricle', 'Right Ventricle', 'Mitral Valve', 'Tricuspid Valve'],
    ecgEvent: 'QRS Complex — Ventricular Depolarization',
    heartSound: 'S1 — "Lub." Mitral component (M1) precedes tricuspid (T1) by 10-30ms. Best heard at the apex (mitral area). Loud S1 = short PR interval or mitral stenosis.',
    pressures: 'LV: 12→80 mmHg (rapidly rising). Aortic: ~80 mmHg (unchanged). All valves closed — no flow. Volume: 120 mL (constant).',
    clinicalNote: 'S1 heart sound occurs here. A split S1 (audible M1-T1 separation) can indicate right bundle branch block. A quiet S1 occurs with a long PR interval, severe mitral regurgitation, or poor LV function.',
  },
  P3: {
    title: 'Rapid Ejection',
    event: 'Ventricular pressure exceeds arterial pressure. The aortic and pulmonary valves burst open — 70% of the stroke volume rockets out.',
    detail: 'The left ventricle ejects blood at velocities up to 1.5 m/s through the aortic valve. Peak systolic pressure reaches ~120 mmHg. The aortic root expands to absorb the force (Windkessel effect). The coronary arteries are compressed during this phase — most coronary perfusion occurs during diastole.',
    structures: ['Aorta', 'Pulmonary Artery', 'Aortic Valve', 'Pulmonary Valve'],
    ecgEvent: 'ST Segment — Ventricular Plateau',
    heartSound: 'Ejection click may be heard with bicuspid aortic valve or pulmonary stenosis. Systolic ejection murmur (crescendo-decrescendo) if aortic stenosis present.',
    pressures: 'LV: 120 mmHg (peak). Aortic: 120 mmHg (peak systolic). Volume: 120→70 mL. Stroke volume: ~70 mL (EF ~58%).',
    clinicalNote: 'Ejection fraction (EF) is measured here. Normal: 55-70%. HFrEF: <40%. HFpEF: >50% with diastolic dysfunction. The aortic valve opens silently in health — an opening click suggests stenosis.',
  },
  P4: {
    title: 'Reduced Ejection',
    event: 'Ejection slows as the ventricles begin to relax. The remaining 30% of blood leaves at a decreasing rate. The ventricles start repolarizing.',
    detail: 'Ventricular pressure begins falling below aortic pressure. Blood continues forward briefly due to momentum (kinetic energy stored in the blood column). The T wave appears as ventricular muscle repolarizes from epicardium to endocardium (opposite direction to depolarization).',
    structures: ['Left Ventricle', 'Right Ventricle', 'Aorta'],
    ecgEvent: 'T Wave — Ventricular Repolarization',
    heartSound: 'No normal sounds. Late systolic murmur if mitral valve prolapse (click-murmur syndrome). Pansystolic murmur if mitral regurgitation persists through this phase.',
    pressures: 'LV: 120→100 mmHg (falling). Aortic: ~100 mmHg. LA: v-wave building (10→15 mmHg) as pulmonary venous return fills the left atrium. Volume: 70→50 mL (ESV).',
    clinicalNote: 'T wave abnormalities are critical: peaked T = hyperkalemia. Inverted T = ischemia or strain. ST elevation + reciprocal depression = acute STEMI. The T wave repolarization direction (epi→endo) is opposite to depolarization — this is why the normal T wave is upright in most leads despite QRS being upright.',
  },
  P5: {
    title: 'Isovolumetric Relaxation',
    event: 'All valves shut again. The ventricles relax rapidly — pressure plummets but volume stays constant. The heart resets.',
    detail: 'The aortic and pulmonary valves close, producing the S2 heart sound — the "dub." The aortic valve closes first; the pulmonary valve closes slightly later. This split widens during inspiration (increased RV filling delays pulmonary valve closure). Ventricular pressure drops from ~100 to <8 mmHg in 70ms.',
    structures: ['Aortic Valve', 'Pulmonary Valve', 'Left Ventricle', 'Right Ventricle'],
    ecgEvent: 'End of T Wave — Diastole Begins',
    heartSound: 'S2 — "Dub." Aortic component (A2) precedes pulmonary (P2). Physiological splitting widens on inspiration. Fixed splitting = ASD. Paradoxical splitting (P2 before A2) = LBBB or aortic stenosis.',
    pressures: 'LV: 100→8 mmHg (rapidly falling). Aortic: ~80 mmHg (dicrotic notch from valve closure). All valves closed. Volume: 50 mL (constant, ESV).',
    clinicalNote: 'The dicrotic notch on the aortic pressure tracing marks the exact moment of aortic valve closure. This is a key landmark on arterial line tracings in the ICU. Wide splitting of S2 suggests RBBB; fixed splitting suggests ASD.',
  },
  P6: {
    title: 'Rapid Filling',
    event: 'The AV valves open and blood rushes passively into the ventricles. About 60% of total ventricular filling happens in this phase — driven purely by pressure gradient.',
    detail: 'Ventricular pressure falls below atrial pressure, the mitral and tricuspid valves open, and blood flows downhill from atria to ventricles. This is entirely passive — the atria don\'t contract. The rate of filling is fastest at the start and decelerates exponentially. Most coronary perfusion occurs now (low intramural pressure).',
    structures: ['Mitral Valve', 'Tricuspid Valve', 'Left Ventricle', 'Right Ventricle'],
    ecgEvent: 'Isoelectric Baseline — Electrical Silence',
    heartSound: 'S3 may be heard (ventricular gallop) — rapid deceleration of blood hitting the ventricular wall. Normal in children and young adults. In patients >40, S3 = volume overload or heart failure (the "Kentucky" gallop: S1-S2-S3).',
    pressures: 'LV: 2→5 mmHg (nadir then rising). LA: 12→5 mmHg (y descent). AV valve pressure gradient drives flow. Volume: 50→92 mL (~60% of total filling).',
    clinicalNote: 'An S3 heart sound during rapid filling is the most important physical exam finding in acute heart failure. It indicates elevated filling pressures and ventricular non-compliance. "If you hear an S3 in a patient with dyspnea, the diagnosis is heart failure until proven otherwise."',
  },
  P7: {
    title: 'Diastasis',
    event: 'The quiet phase. Slow passive filling continues. The heart rests. The SA node prepares to fire again.',
    detail: 'Filling rate slows to a trickle as atrial and ventricular pressures equalize. At rest (72 BPM), this phase lasts ~260ms — the longest single phase. At high heart rates (>150 BPM), this phase nearly disappears, which is why tachycardia reduces cardiac output despite the faster rate — the ventricles don\'t have time to fill.',
    structures: ['SA Node'],
    ecgEvent: 'TP Segment — Awaiting Next Cycle',
    heartSound: 'No normal sounds. The heart is electrically and mechanically quiet. Coronary perfusion peaks during early diastole (P6) when intramural pressure is lowest — diastasis continues this perfusion at a lower rate.',
    pressures: 'LV: 5→8 mmHg (slowly rising). Aortic: ~80 mmHg (diastolic). Pressures equalizing. Volume: 92→105 mL (~15% of filling). Remaining ~20% added by atrial kick in P1.',
    clinicalNote: 'At very high heart rates (>150 BPM), diastasis nearly disappears. This is the physiological basis for why tachycardia causes hemodynamic compromise — reduced filling time → reduced stroke volume → reduced cardiac output despite increased rate. This is also why beta-blockers improve coronary perfusion — by lengthening diastole.',
  },
}
