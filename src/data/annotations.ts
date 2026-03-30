import { type Phase } from './cardiac-timing'

export interface Annotation {
  structureId: string
  name: string
  latinName: string
  description: string
  dimensions: string
  bloodSupply: string
  ecgTerritory?: string
  innervation: string
  failureMode: string
  surgicalRelevance: string
  relatedPhases: Phase[]
}

export const ANNOTATIONS: Record<string, Annotation> = {
  'left-ventricle': {
    structureId: 'left-ventricle',
    name: 'Left Ventricle',
    latinName: 'Ventriculus sinister',
    description:
      'The thickest-walled chamber (8-15mm), forming the apex and the majority of the diaphragmatic surface. Conical shape with two papillary muscles (anterolateral and posteromedial) anchoring the mitral valve via chordae tendineae. The trabeculae carneae line the inner walls. Responsible for generating systemic arterial pressure (~120/80 mmHg).',
    dimensions: 'Wall thickness: 6-12mm (>12mm = LVH). 2-3x thicker than RV. End-diastolic volume: ~120mL. End-systolic volume: ~50mL. Stroke volume: ~70mL.',
    bloodSupply: 'LAD (anterior wall, anterior 2/3 of septum), LCx (lateral wall). Posterior/inferior wall: PDA from RCA in 85% (right-dominant) or from LCx in 15% (left-dominant). The LAD is the most commonly occluded vessel in MI — "the widow maker."',
    ecgTerritory: 'LAD occlusion → ST elevation in V1-V4 (anterior MI). LCx occlusion → ST elevation in I, aVL, V5-V6 (lateral MI). Both → extensive anterior-lateral MI.',
    innervation: 'Sympathetic (T1-T4 via cardiac plexus — increases contractility). Parasympathetic (vagus — minimal effect on ventricular contractility, primarily affects rate via SA/AV nodes).',
    failureMode:
      'Left heart failure → pulmonary edema (fluid backs into lungs). Ejection fraction <40% = heart failure with reduced EF (HFrEF). Most common cause: ischemic cardiomyopathy from coronary artery disease.',
    surgicalRelevance: 'Site of LVAD placement. Apical approach for TAVR. Myomectomy for HOCM. Ventricular aneurysm repair post-MI. LV assist device cannula inserted at apex.',
    relatedPhases: ['P2', 'P3', 'P4'],
  },
  'right-ventricle': {
    structureId: 'right-ventricle',
    name: 'Right Ventricle',
    latinName: 'Ventriculus dexter',
    description:
      'Crescent-shaped chamber wrapping around the LV. Thinner walls (3-5mm) because it pumps against lower pulmonary resistance (~25/5 mmHg). Contains the moderator band (septomarginal trabecula) carrying the right bundle branch to the anterior papillary muscle. Three papillary muscles: anterior, posterior, and septal.',
    dimensions: 'Wall thickness: 3-5mm (>5mm = RVH). End-diastolic volume: ~120mL (similar to LV). Generates ~1/5th the systolic pressure of the LV.',
    bloodSupply: 'RCA (right coronary artery) — supplies the RV free wall and inferior wall. Acute marginal branches.',
    ecgTerritory: 'RCA occlusion → ST elevation in II, III, aVF (inferior MI). May extend to RV (right-sided leads V3R-V4R). RV infarct: hypotension + clear lungs + elevated JVP.',
    innervation: 'Same cardiac plexus as LV. Sympathetic fibers increase contractility; parasympathetic fibers have minimal direct ventricular effect.',
    failureMode:
      'Right heart failure → systemic venous congestion (jugular venous distension, peripheral edema, hepatomegaly, ascites). Most common cause: left heart failure. Also: pulmonary hypertension, RV infarction, PE.',
    surgicalRelevance: 'RV outflow tract reconstruction (Tetralogy of Fallot repair). Pulmonary valve replacement approached through RV. RV failure is the leading cause of death after LVAD implantation.',
    relatedPhases: ['P2', 'P3', 'P4'],
  },
  'left-atrium': {
    structureId: 'left-atrium',
    name: 'Left Atrium',
    latinName: 'Atrium sinistrum',
    description:
      'Smooth-walled posterior chamber receiving oxygenated blood from four pulmonary veins (two from each lung). The left atrial appendage (auricle) is a remnant of the embryonic atrium and a common site of thrombus formation in atrial fibrillation. Posterior wall is in direct contact with the esophagus.',
    dimensions: 'Normal diameter: <4.0cm (anteroposterior). Volume: 18-58mL. Wall thickness: ~3mm.',
    bloodSupply: 'LCx (left circumflex artery) — left atrial branches. Also receives branches from the left coronary artery.',
    innervation: 'Dense autonomic innervation. Pulmonary vein ostia contain the triggers for most atrial fibrillation — the target of AF ablation.',
    failureMode:
      'Dilation → atrial fibrillation → stasis → thrombus in LAA → embolic stroke. LA pressure elevation → pulmonary edema. Mitral stenosis causes chronic LA dilation.',
    surgicalRelevance: 'Left atrial appendage occlusion (WATCHMAN device) for stroke prevention in AF. Pulmonary vein isolation ablation. Mitral valve surgery accessed through LA. Cox-Maze procedure for AF.',
    relatedPhases: ['P1', 'P6', 'P7'],
  },
  'right-atrium': {
    structureId: 'right-atrium',
    name: 'Right Atrium',
    latinName: 'Atrium dextrum',
    description:
      'Receives deoxygenated blood from SVC (upper body), IVC (lower body), and the coronary sinus (heart\'s own venous drainage). Contains the SA node in its posterolateral wall near the SVC junction, and the AV node in the Triangle of Koch (bounded by the tendon of Todaro, the coronary sinus ostium, and the tricuspid annulus). The crista terminalis separates the smooth posterior wall from the trabeculated anterior wall.',
    dimensions: 'Normal diameter: <4.4cm. Mean pressure: 2-6 mmHg (central venous pressure). Wall thickness: ~2mm.',
    bloodSupply: 'RCA — SA nodal artery (55% of population). Right atrial branches.',
    innervation: 'SA node: richly innervated by both sympathetic and parasympathetic fibers — the primary site of autonomic heart rate control.',
    failureMode:
      'RA dilation from RV failure, tricuspid regurgitation, or pulmonary hypertension. Elevated CVP → JVD, hepatic congestion, peripheral edema. Atrial septal defect causes volume overload.',
    surgicalRelevance: 'Surgical access point for most open-heart procedures (right atriotomy). Cannulation site for cardiopulmonary bypass. Pacemaker lead placement through RA into RV. ICD lead routing.',
    relatedPhases: ['P1', 'P6', 'P7'],
  },
  'aorta': {
    structureId: 'aorta',
    name: 'Aorta',
    latinName: 'Aorta',
    description:
      'The largest artery in the body. Ascending aorta gives off the coronary arteries (first branches). The aortic arch gives off the brachiocephalic trunk, left common carotid, and left subclavian. The aortic root contains the sinuses of Valsalva, which create eddy currents that help close the aortic valve and perfuse the coronary ostia during diastole.',
    dimensions: 'Ascending aorta diameter: 2.1-3.5cm. Wall thickness: ~2mm (3 layers: intima, media, adventitia). Descending thoracic aorta: ~2.5cm.',
    bloodSupply: 'Vasa vasorum — small vessels in the adventitia that supply the outer 2/3 of the aortic wall. The inner 1/3 is nourished by luminal diffusion.',
    innervation: 'Baroreceptors in the aortic arch (aortic body) — detect blood pressure changes. Aortic chemoreceptors detect O2/CO2 levels. Vagus nerve (CN X) carries afferent signals.',
    failureMode:
      'Aortic aneurysm: >5.5cm ascending (>5.0cm for Marfan/bicuspid) or >5.5-6.0cm descending = surgical threshold. Aortic dissection: intimal tear with blood tracking between media layers — a surgical emergency. Stanford Type A (ascending) = emergent surgery. Type B (descending) = medical management.',
    surgicalRelevance: 'Aortic root replacement (Bentall procedure). TAVR deployment site. Aortic cross-clamping during bypass. Coarctation repair. Endovascular stent grafting (TEVAR) for descending aneurysms.',
    relatedPhases: ['P3', 'P4'],
  },
  'pulmonary-artery': {
    structureId: 'pulmonary-artery',
    name: 'Pulmonary Artery',
    latinName: 'Truncus pulmonalis',
    description:
      'The only artery carrying deoxygenated blood. Bifurcates into left and right pulmonary arteries below the aortic arch (at the carina level). The ligamentum arteriosum (remnant of the fetal ductus arteriosus) connects it to the aortic arch. Shorter and wider than the aorta. Thinner-walled due to lower pressure.',
    dimensions: 'Main PA diameter: <2.9cm. Normal PA pressure: 15-25/8-15 mmHg (mean ~15 mmHg). ~1/5 systemic pressure.',
    bloodSupply: 'Bronchial arteries (from thoracic aorta) supply the vasa vasorum of the proximal PA.',
    innervation: 'Sympathetic and parasympathetic fibers from the cardiac plexus. Baroreceptors present but less clinically significant than aortic.',
    failureMode:
      'Pulmonary hypertension (mean PA pressure >20 mmHg at rest). Pulmonary embolism — clot from DVT lodges at bifurcation ("saddle embolus") or in lobar branches. Massive PE → acute RV failure → hemodynamic collapse.',
    surgicalRelevance: 'Pulmonary endarterectomy for chronic thromboembolic PH (CTEPH). Ross procedure (autograft PA to aortic position). PA banding in congenital heart disease. Swan-Ganz catheter insertion site.',
    relatedPhases: ['P3', 'P4'],
  },
  'superior-vena-cava': {
    structureId: 'superior-vena-cava',
    name: 'Superior Vena Cava',
    latinName: 'Vena cava superior',
    description:
      'Formed by the junction of left and right brachiocephalic veins behind the first costal cartilage. Drains the head, neck, upper limbs, and thorax into the right atrium. Has no valves. The azygos vein enters posteriorly just before the RA junction. The SA node lies at the SVC-RA junction.',
    dimensions: 'Length: ~7cm. Diameter: ~2cm. Carries approximately 1/3 of venous return.',
    bloodSupply: 'Vasa vasorum from bronchial and internal thoracic arteries.',
    innervation: 'Phrenic nerve runs along the right lateral surface — at risk during surgery.',
    failureMode:
      'SVC syndrome: obstruction (usually by malignancy — lung cancer, lymphoma) causes facial/upper extremity edema, venous distension, and cyanosis. Medical emergency if airway compromised.',
    surgicalRelevance: 'Cannulation site for cardiopulmonary bypass (along with IVC). Pacemaker/ICD lead pathway. Central line tip positioning target (SVC-RA junction). Glenn shunt (SVC→PA) in single ventricle palliation.',
    relatedPhases: ['P6', 'P7'],
  },
  'mitral-valve': {
    structureId: 'mitral-valve',
    name: 'Mitral Valve',
    latinName: 'Valva mitralis (valva atrioventricularis sinistra)',
    description:
      'Bicuspid valve with anterior and posterior leaflets connected to two papillary muscles (anterolateral and posteromedial) via chordae tendineae. The anterior leaflet is larger but covers less of the annulus circumference. The mitral annulus is D-shaped and fibrous, continuous with the aortic valve (aortomitral curtain). The most common valve to require surgery.',
    dimensions: 'Annulus area: 4-6 cm². Orifice area: >4 cm² normal. <1.0 cm² = severe stenosis. 1.0-1.5 cm² = moderate. Leaflet thickness: ~1mm.',
    bloodSupply: 'Anterior leaflet: LAD and LCx branches. Posteromedial papillary muscle: single blood supply (usually PDA from RCA) — making it vulnerable to ischemic rupture.',
    innervation: 'Leaflets themselves are largely avascular and aneural in the adult. Annulus has proprioceptive fibers.',
    failureMode:
      'Mitral regurgitation: leaflet prolapse (MVP — most common), papillary muscle rupture (acute MI), annular dilation (cardiomyopathy), rheumatic disease (stenosis). The posteromedial papillary muscle has a single blood supply — ruptures more often than the anterolateral (dual supply).',
    surgicalRelevance: 'Mitral valve repair preferred over replacement (better long-term outcomes). Ring annuloplasty. Chordal replacement. MitraClip (transcatheter edge-to-edge repair). Access via left atriotomy or transseptal approach.',
    relatedPhases: ['P1', 'P2', 'P6', 'P7'],
  },
  'tricuspid-valve': {
    structureId: 'tricuspid-valve',
    name: 'Tricuspid Valve',
    latinName: 'Valva tricuspidalis (valva atrioventricularis dextra)',
    description:
      'Three-leaflet valve (anterior, posterior, septal) between right atrium and right ventricle. Largest cardiac valve by annulus area. The septal leaflet is attached to the membranous interventricular septum. The AV node and Bundle of His lie in close proximity — at risk during surgery. The annulus is not a complete fibrous ring (unlike the mitral).',
    dimensions: 'Annulus area: 7-9 cm². Normal orifice: >7 cm². The annulus is more distensible than the mitral annulus.',
    bloodSupply: 'RCA branches. Less susceptible to ischemic damage than the mitral valve.',
    innervation: 'Minimal. The proximity to the AV node/Bundle of His is the key anatomical concern.',
    failureMode:
      'Tricuspid regurgitation (most common): usually functional (RV dilation stretching the annulus, secondary to left heart disease or pulmonary hypertension). Primary: endocarditis (IV drug use — right-sided), carcinoid syndrome, Ebstein\'s anomaly. Tricuspid stenosis is rare (rheumatic disease).',
    surgicalRelevance: 'Annuloplasty (ring or suture) for functional TR. Replacement rarely needed. The Triangle of Koch must be avoided — sutures placed too deep near the septal leaflet can damage the AV node and cause complete heart block. TriClip (transcatheter repair) emerging.',
    relatedPhases: ['P1', 'P2', 'P6', 'P7'],
  },
}
