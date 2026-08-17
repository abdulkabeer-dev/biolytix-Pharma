const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

// Therapeutic divisions definition with banners, colors, icons, and metadata
const divisions = [
  {
    id: 'multivitamins',
    name: 'Multivitamins & Nutraceuticals',
    shortLabel: 'Nutraceuticals',
    icon: 'Leaf',
    tagline: 'Sustaining holistic cellular nutrition and immune resilience.',
    description: 'Therapeutic multivitamins, essential mineral complexes, amino acids, antioxidants, collagen peptides, and pediatric supplements.',
    accentColor: '#22c55e',
    heroImage: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&q=80',
    stat: 'Complete Nutrient Profiles',
    banners: [
      {
        eyebrow: 'Cellular Vitality & Immunity',
        title: 'Antioxidants, Minerals & Therapeutic Multivitamins',
        body: 'Formulations with lycopene, zinc, vitamin complexes, and amino acids designed to reinforce immune defense and cellular vitality.',
        stat: 'High Cellular Bioavailability',
        art: 'leaf',
        tint: 'from-green-900 to-emerald-950',
      },
      {
        eyebrow: 'Bone & Cartilage Health',
        title: 'High-Bioavailability Cholecalciferol & Mineral Regimens',
        body: 'Nano-emulsion Vitamin D3 shots and pediatric drops formulated for rapid calcium absorption and immune fortification.',
        stat: 'Synergistic Mineralization',
        art: 'shield',
        tint: 'from-teal-900 to-emerald-950',
      },
    ],
  },
  {
    id: 'analgesics',
    name: 'Analgesics & Anti-Inflammatory',
    shortLabel: 'Analgesics',
    icon: 'Thermometer',
    tagline: 'Targeted pain relief and inflammation control for active lives.',
    description: 'NSAIDs, muscle relaxant combinations, proteolytic enzymes, and antipyretic formulations designed for fast onset and superior gastric tolerance.',
    accentColor: '#f97316',
    heroImage: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=1200&q=80',
    stat: 'Fast-Acting Formulations',
    banners: [
      {
        eyebrow: 'Advanced Pain Care',
        title: 'Fast-Acting Anti-Inflammatory Therapeutics',
        body: 'Dual and triple-action NSAID and enzyme formulations delivering rapid analgesia and anti-edematous resolution for musculoskeletal trauma.',
        stat: 'Rapid Tissue Penetration',
        art: 'thermo',
        tint: 'from-amber-900 to-orange-950',
      },
      {
        eyebrow: 'Spasm & Mobility Relief',
        title: 'Muscle Relaxants & Proteolytic Combinations',
        body: 'Synergistic muscle relaxant and systemic enzyme preparations promoting faster mobility restoration and tissue healing.',
        stat: 'Enhanced Patient Comfort',
        art: 'shield',
        tint: 'from-orange-900 to-red-950',
      },
    ],
  },
  {
    id: 'ortho',
    name: 'Ortho Specialities & Joint Care',
    shortLabel: 'Ortho Specialities',
    icon: 'Activity',
    tagline: 'Advanced osteogenic stimulation, cartilage repair, and joint flexibility.',
    description: 'Targeted Cissus quadrangularis complexes, undenatured Type-II collagen, glucosamine, chondroitin, muscle spasm relievers, and topical pain gels.',
    accentColor: '#0284c7',
    heroImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    stat: 'Osteogenic & Cartilage Support',
    banners: [
      {
        eyebrow: 'Fracture Healing & Bone Mineralization',
        title: 'Cissus Quadrangularis & Moringa Oleifera Regimens',
        body: 'Clinically proven herbal and mineral complexes accelerating osteoblastogenesis and bone fracture consolidation.',
        stat: 'Faster Bone Remodeling',
        art: 'shield',
        tint: 'from-sky-900 to-indigo-950',
      },
      {
        eyebrow: 'Joint Cartilage Regeneration',
        title: 'Glucosamine, Chondroitin & Type-II Collagen Complexes',
        body: 'Multi-target chondroprotective formulations to restore synovial fluid viscosity, reduce joint friction, and improve knee flexibility.',
        stat: 'Superior Joint Mobility',
        art: 'flask',
        tint: 'from-blue-900 to-cyan-950',
      },
    ],
  },
  {
    id: 'neuro',
    name: 'Neurology & CNS Care',
    shortLabel: 'Neuro Care',
    icon: 'Zap',
    tagline: 'Targeted neuro-restorative and central nervous system therapeutics.',
    description: 'Advanced gabapentinoids, neurotropic vitamin formulations, and peripheral neuropathy therapeutics for chronic nerve discomfort.',
    accentColor: '#8b5cf6',
    heroImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80',
    stat: 'Neuro-Targeted Efficacy',
    banners: [
      {
        eyebrow: 'Neuropathic Pain Relief',
        title: 'Synergistic Gabapentinoid & Tricyclic Therapy',
        body: 'Balanced modulation of voltage-gated calcium channels and monoamine reuptake for sustained relief from neuropathic sensations.',
        stat: 'High Neural Tolerance',
        art: 'shield',
        tint: 'from-purple-900 to-indigo-950',
      },
      {
        eyebrow: 'Neuro-Metabolic Support',
        title: 'High-Potency Neurotropic Vitamin Formulations',
        body: 'Essential thiamine coenzymes restoring neuronal energy metabolism and peripheral axon sheath integrity.',
        stat: 'Essential Axonal Health',
        art: 'leaf',
        tint: 'from-violet-900 to-purple-950',
      },
    ],
  },
  {
    id: 'gastro',
    name: 'Gastro-Intestinal & Hepatoprotective',
    shortLabel: 'Gastrointestinal',
    icon: 'FlaskConical',
    tagline: 'Restoring digestive harmony through advanced mucosal and acid control.',
    description: 'Proton pump inhibitors, prokinetics, mucosal protectants, antacids, digestive enzymes, and hepatoprotective formulations.',
    accentColor: '#10b981',
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    stat: 'High Bioavailability',
    banners: [
      {
        eyebrow: 'Acid & Mucosal Protection',
        title: 'Sustained Gastro-Protection & Ulcer Healing',
        body: 'Next-generation proton pump inhibitors, sucralfate combinations, and prokinetics ensuring rapid mucosal re-epithelialization.',
        stat: '24-Hour Acid Suppression',
        art: 'flask',
        tint: 'from-emerald-900 to-teal-950',
      },
      {
        eyebrow: 'Digestive Enzymes',
        title: 'Complete Gastrointestinal Comfort & Absorption',
        body: 'Enzyme syrups and digestive balancing therapeutics formulated for optimal nutritional bioavailability and dyspepsia relief.',
        stat: 'Multi-Enzyme Synergy',
        art: 'leaf',
        tint: 'from-teal-900 to-green-950',
      },
    ],
  },
  {
    id: 'anti-infectives',
    name: 'Anti-Infectives & Antibiotics',
    shortLabel: 'Anti-Infectives',
    icon: 'ShieldPlus',
    tagline: 'Defeating resistant pathogens with precision antimicrobial formulations.',
    description: 'High-efficacy cephalosporins, penicillins, macrolides, fluoroquinolones, and combination antimicrobials manufactured under sterile, WHO-GMP conditions.',
    accentColor: '#1a7fc1',
    heroImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80',
    stat: '99.8% Potency Rate',
    banners: [
      {
        eyebrow: 'Precision Antimicrobials',
        title: 'High-Purity Broad-Spectrum Antibiotics',
        body: 'Targeted formulations engineered for fast bactericidal action and minimal resistance emergence across critical clinical infections.',
        stat: 'WHO-GMP Compliant',
        art: 'shield',
        tint: 'from-sky-900 to-blue-950',
      },
      {
        eyebrow: 'Sterile Manufacturing',
        title: 'Microbial Barrier & Quality Assurance',
        body: 'Every batch subjected to multi-stage sterility validation, HPLC assay testing, and temperature-monitored distribution.',
        stat: 'Zero-Contamination Standard',
        art: 'flask',
        tint: 'from-blue-900 to-cyan-950',
      },
    ],
  },
  {
    id: 'gynecology',
    name: 'Gynecology & Infertility Specialities',
    shortLabel: 'Gynecology & Infertility',
    icon: 'HeartPulse',
    tagline: 'Comprehensive maternal health, luteal support, and reproductive vitality.',
    description: 'Dydrogesterone, Liposomal CoQ10 300mg, concentrated Omega-3 DHA/EPA, L-Arginine sachets, and specialized iron-folic acid hematinics.',
    accentColor: '#ec4899',
    heroImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1200&q=80',
    stat: 'Targeted Reproductive Care',
    banners: [
      {
        eyebrow: 'Maternal & Luteal Support',
        title: 'Precision Progestogen & Reproductive Formulations',
        body: 'Selective progesterone receptor agonism supporting luteal phase sufficiency, implantation, and healthy full-term pregnancies.',
        stat: 'Proven Clinical Safety',
        art: 'shield',
        tint: 'from-rose-900 to-pink-950',
      },
      {
        eyebrow: 'Cellular Energy & Fertility Care',
        title: 'Liposomal Co-Enzyme Q10 & Antioxidant Micronutrients',
        body: 'High-potency mitochondrial energy enhancers and amino acid sachets improving ovarian response and microvascular placental perfusion.',
        stat: 'Max Bioavailability',
        art: 'heart',
        tint: 'from-pink-900 to-rose-950',
      },
    ],
  },
  {
    id: 'cardiac',
    name: 'Cardiac Care & Diabetic Support',
    shortLabel: 'Cardiac & Diabetic',
    icon: 'HeartPulse',
    tagline: 'Guarding cardiovascular vitality and glycemic balance.',
    description: 'Antihypertensives, lipid-lowering statins, oral anti-diabetic agents, diuretics, and cardiovascular combination therapies.',
    accentColor: '#f43f5e',
    heroImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80',
    stat: 'Precision Dosing',
    banners: [
      {
        eyebrow: 'Cardiovascular Defense',
        title: 'Comprehensive Blood Pressure & Lipid Management',
        body: 'Clinically proven ARBs, CCBs, statins, and diuretic combinations formulated for 24-hour hemodynamic stability and vascular protection.',
        stat: '24-Hour Hemodynamic Control',
        art: 'heart',
        tint: 'from-rose-900 to-red-950',
      },
      {
        eyebrow: 'Glycemic Regulation',
        title: 'Targeted Type-2 Diabetes Care Formulations',
        body: 'DPP-4 inhibitors, SGLT-2 inhibitors, and biguanide combinations designed for smooth glycemic stabilization and reduced hypoglycemic risk.',
        stat: 'End-Organ Protection',
        art: 'shield',
        tint: 'from-red-900 to-pink-950',
      },
    ],
  },
  {
    id: 'derma',
    name: 'Dermatology & Cosmetology',
    shortLabel: 'Dermatology & Cosmetology',
    icon: 'Sparkles',
    tagline: 'Restoring dermal integrity with advanced topical therapeutics and cosmetology.',
    description: 'Topical emollients, antifungal oral & topical therapies, skin-brightening glutathione formulations, and soothing barrier lotions.',
    accentColor: '#a855f7',
    heroImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80',
    stat: 'Dermatologist Tested',
    banners: [
      {
        eyebrow: 'Barrier Restoration & Hydration',
        title: 'Advanced Emollient & Calamine Lotions',
        body: 'Physiological lipid replenishment, soothing calamine, and natural barrier protective formulations for irritated and sensitive skin.',
        stat: 'Rapid Absorption',
        art: 'tube',
        tint: 'from-purple-900 to-violet-950',
      },
      {
        eyebrow: 'Cosmetology & Skin Radiance',
        title: 'Glutathione, Arbutin & Antioxidant Formulations',
        body: 'Oral tablets and clinical cleansing soaps with botanical extracts to reduce hyperpigmentation and promote even skin tone.',
        stat: 'Clinically Proven Radiance',
        art: 'sparkles',
        tint: 'from-fuchsia-900 to-purple-950',
      },
    ],
  },
  {
    id: 'injectables',
    name: 'Critical Care & Injectables',
    shortLabel: 'Injectables',
    icon: 'Shield',
    tagline: 'Sterile, high-potency parenteral therapeutics for hospital and acute care.',
    description: 'Sterile lyophilized antibiotics, aminoglycosides, and corticosteroid injectables manufactured under Class 100 cleanroom standards.',
    accentColor: '#06b6d4',
    heroImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80',
    stat: 'Class 100 Sterile Production',
    banners: [
      {
        eyebrow: 'Critical Hospital Therapeutics',
        title: 'Sterile Parenteral Antibiotics & Corticosteroids',
        body: 'High-purity lyophilized vials and ampoules engineered for rapid systemic bioavailability in emergency and inpatient settings.',
        stat: 'Sterile Pyrogen-Free',
        art: 'flask',
        tint: 'from-cyan-900 to-blue-950',
      },
      {
        eyebrow: 'Sterile Quality Standards',
        title: 'Endotoxin-Tested Acute Care Formulations',
        body: 'Stringent multi-stage sterility validation, endotoxin assays, and tamper-proof packaging for maximum clinical reliability.',
        stat: 'Zero Contamination',
        art: 'shield',
        tint: 'from-teal-900 to-cyan-950',
      },
    ],
  },
  {
    id: 'wound-care',
    name: 'Advanced Wound Care & Enzymes',
    shortLabel: 'Wound Care',
    icon: 'ShieldPlus',
    tagline: 'Targeted enzymatic debridement and rapid tissue regeneration.',
    description: 'Papain and urea enzymatic debriding ointments and topical healing accelerators for chronic ulcers and trauma.',
    accentColor: '#e11d48',
    heroImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80',
    stat: 'Targeted Enzymatic Action',
    banners: [
      {
        eyebrow: 'Enzymatic Debridement',
        title: 'Papain & Urea Proteolytic Wound Healing',
        body: 'Selectively breaks down necrotic tissue without damaging viable healing granulation beds in chronic ulcers and surgical wounds.',
        stat: 'Accelerated Granulation',
        art: 'shield',
        tint: 'from-rose-900 to-red-950',
      },
    ],
  },
]

// 1. Read SEGMENT WISE.xlsx
const excelPath = path.resolve(__dirname, '../products_data/SEGMENT WISE.xlsx')
const wb = XLSX.readFile(excelPath)
const sheet = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

// Mapping of segment title in Excel to division ID
const segmentToDivId = {
  'MULTIVITAMINS & NUTRACEUTICALS': 'multivitamins',
  'ANALGESICS & ANTI-INFLAMMATORY': 'analgesics',
  'ORTHO SPECIALITIES': 'ortho',
  'NEURO': 'neuro',
  'GASTRO-INTESTINAL & HEPATOPROTECTIVE': 'gastro',
  'ANTI-INFECTIVES & ANTIBIOTICS': 'anti-infectives',
  'GYNIC AND INFERTILITY SPECIALITY': 'gynecology',
  'CARDIAC CARE & DIABETIC SUPPORT': 'cardiac',
  'DERMATOLOGY & COSMETOLOGY': 'derma',
  'INJECTABLES': 'injectables',
  'WOUND CARE': 'wound-care',
}

function normalizeKey(str) {
  return str.toUpperCase().trim().replace(/\s+/g, ' ')
}

function detectForm(name, comp) {
  const text = (name + ' ' + comp).toUpperCase()
  if (text.includes('SOAP')) return 'Soap'
  if (text.includes('SACHET')) return 'Powder'
  if (text.includes('POWDER')) return 'Powder'
  if (text.includes('NANO SHOT') || text.includes('SHOT')) return 'Oral Solution'
  if (text.includes('SOLUTION') || text.includes('SOLN')) return 'Oral Solution'
  if (text.includes('INJ') || text.includes('INJECTION')) return 'Injection'
  if (text.includes('DROPS') || text.includes('DROP')) return 'Drops'
  if (text.includes('GEL')) return 'Gel'
  if (text.includes('ONT') || text.includes('OINTMENT')) return 'Ointment'
  if (text.includes('CREEM') || text.includes('CREAM') || text.includes('LOTION') || text.includes('MOISTURIZER')) return 'Cream'
  if (text.includes('SYR') || text.includes('SYRUP')) return 'Syrup'
  if (text.includes('SUSPENSION') || text.includes('SUSP')) return 'Suspension'
  if (text.includes('CAPSULE') || text.includes('CAP') || text.includes('ITRAX') || text.includes('ITRACONAZOLE')) return 'Capsule'
  if (text.includes('TAB') || text.includes('TABLET')) return 'Tablet'
  return 'Tablet'
}

function detectPack(form, name) {
  const text = name.toUpperCase()
  if (text.includes('SOAP')) return '75g Bar'
  if (text.includes('SACHET')) return '10 x 10g Sachets'
  if (text.includes('POWDER')) return '200g Jar with Spoon'
  if (text.includes('NANO SHOT')) return '4 x 5ml Oral Shots'
  if (form === 'Oral Solution' && text.includes('200 ML')) return '200ml Pet Bottle'
  if (form === 'Injection') return 'Vial with Sterile WFI / Ampoule'
  if (form === 'Drops') return '15ml Dropper Bottle with Calibrated Dropper'
  if (form === 'Gel' || form === 'Ointment' || form === 'Cream') return '30g / 50g Lamitube'
  if (form === 'Syrup' || form === 'Suspension') return '100ml / 200ml Pet Bottle with Measuring Cap'
  if (form === 'Capsule') return '10x10 Alu-Alu / Blister'
  if (form === 'Tablet') return '10x10 Alu-Alu / Blister'
  return 'Standard Unit Pack'
}

function parseIngredients(comp) {
  if (!comp) return [{ name: 'Therapeutic Formulation', strength: 'As Prescribed' }]
  const clean = comp.replace(/Tablet.*|Capsule.*|Syrup.*|Injection.*|\(per.*?\)/gi, '').trim()
  const parts = clean.split(/\+|\band\b|,\s*(?=[A-Za-z])/i)
  const ingredients = []
  parts.forEach(p => {
    let raw = p.trim().replace(/^[\s,;]+|[\s,;]+$/g, '')
    if (!raw) return
    const match = raw.match(/(\d+(?:\.\d+)?\s*(?:mg|gm|mcg|iu|au|%|g|ml|w\/v|w\/w|units|million spores))/i)
    if (match) {
      const strength = match[1].trim()
      let name = raw.replace(match[0], '').replace(/[()]/g, '').trim()
      ingredients.push({ name: name || raw, strength })
    } else {
      ingredients.push({ name: raw, strength: '' })
    }
  })
  return ingredients.length > 0 ? ingredients : [{ name: comp, strength: '' }]
}

function getIndication(name, comp, divId) {
  const text = (name + ' ' + comp).toUpperCase()
  if (text.includes('CHOLECALCIFEROL')) return 'Vitamin D3 deficiency, bone mineralization & immune health'
  if (text.includes('CISSUS') || text.includes('FIXBONE') || text.includes('CARTIFLEX') || text.includes('COLLAGEN') || text.includes('GLUCOSAMINE')) return 'Fracture healing, joint flexibility, cartilage repair & osteoarthritis'
  if (text.includes('DYDROGESTERONE') || text.includes('DYDROLYTE')) return 'Progesterone deficiency, luteal phase support & threatened miscarriage'
  if (text.includes('SUCRALFATE') || text.includes('SUCLAR')) return 'Peptic ulcer disease, mucosal protection & hyperacidity relief'
  if (text.includes('LYCOPENE') || text.includes('BIOMMUNE')) return 'Immune system reinforcement, oxidative stress reduction & cellular vitality'
  if (text.includes('ACECLOFENAC') && text.includes('THIOCOLCHICOSIDE')) return 'Acute musculoskeletal spasm, lower back pain & muscular stiffness'
  if (text.includes('ACECLOFENAC') && text.includes('SERRATIOPEPTIDASE')) return 'Post-operative pain, edema, traumatic injury & inflammatory swelling'
  if (text.includes('ACECLOFENAC') || text.includes('BIONAC') || text.includes('BIOFENAC')) return 'Pain, fever, osteoarthritis & acute rheumatoid inflammation'
  if (text.includes('TELMISARTAN') || text.includes('TELMONEX')) return 'Essential hypertension & cardiovascular risk management'
  if (text.includes('ROSUVASTATIN') || text.includes('ROSUGAURD') || text.includes('ATORVASTATIN')) return 'Hypercholesterolemia, dyslipidemia & cardiovascular protection'
  if (text.includes('SITAGLIPTIN') || text.includes('PRESITA') || text.includes('GLIMEPIRIDE') || text.includes('BIOMET') || text.includes('DAPAGLIFLOZIN') || text.includes('DAPALYTE')) return 'Type 2 Diabetes Mellitus glycemic control & metabolic balance'
  if (text.includes('RABEPRAZOLE') || text.includes('RABEFAST') || text.includes('ESOMEPRAZOLE') || text.includes('ESOFAST') || text.includes('PANTOPRAZOLE') || text.includes('PANTORAC')) return 'Acid peptic disorder, GERD, heartburn & gastric mucosal healing'
  if (text.includes('TRYPSIN') || text.includes('BROMOTRIX') || text.includes('CHYMOLYTE') || text.includes('CHYMORE')) return 'Resolution of post-traumatic hematoma, soft tissue swelling & surgical edema'
  if (text.includes('GABAPENTIN') || text.includes('GABATRIX')) return 'Neuropathic pain, diabetic peripheral neuropathy & nerve discomfort'
  if (text.includes('FLUPIRTINE') || text.includes('FLUPIRAC')) return 'Centrally acting analgesic for muscle tension, post-injury & chronic pain'
  if (text.includes('FERROUS') || text.includes('IRON') || text.includes('FEROCAN') || text.includes('IROTEX')) return 'Iron deficiency anemia, pregnancy support & convalescence'
  if (text.includes('DEFZIX') || text.includes('DEFLAZOCORT')) return 'Severe inflammatory conditions, rheumatologic disorders & dermatoses'
  if (text.includes('MOISTURIZER') || text.includes('EFARAC') || text.includes('CALAMINE')) return 'Intense skin hydration, barrier replenishment, soothing irritated skin & pruritus'
  if (text.includes('ITRACONAZOLE') || text.includes('ITRAX')) return 'Broad-spectrum systemic and cutaneous fungal infections'
  if (text.includes('GLOW LYTE') || text.includes('GLUTATHIONE')) return 'Skin brightening, hyperpigmentation correction & powerful antioxidant protection'
  if (text.includes('THIAMINE') || text.includes('THIALYTE')) return 'Vitamin B1 deficiency, metabolic neuropathy & cardiovascular support'
  if (text.includes('FUROSEMIDE') || text.includes('FURLYTE') || text.includes('TORSEMIDE') || text.includes('TORSPIRO') || text.includes('EPLERENONE')) return 'Edema associated with heart failure, hypertension & fluid overload'
  if (text.includes('DIGESTIVE') || text.includes('ZYMIVIS')) return 'Functional dyspepsia, indigestion, bloating & digestive enzyme support'
  if (text.includes('LACTULOSE') || text.includes('LACTUL')) return 'Chronic constipation & hepatic encephalopathy management'
  if (text.includes('EPERISONE') || text.includes('MYOSPER')) return 'Musculoskeletal pain, muscle hypertonia, spasticity & cervical spondylosis'
  if (text.includes('NAPROXEN') || text.includes('NAPRO')) return 'Migraine headache, acute arthritis, dysmenorrhea & musculoskeletal pain'
  if (text.includes('DOXYCYCLINE') || text.includes('DOXSURE')) return 'Bacterial infections of the respiratory, urinary & skin systems with probiotic support'
  if (text.includes('LINEZOLID') || text.includes('LIZO')) return 'Resistant Gram-positive bacterial infections, pneumonia & complicated skin infections'
  if (text.includes('CEFUROXIME') || text.includes('CEFUBAX') || text.includes('CEFURO')) return 'Broad-spectrum cephalosporin antimicrobial for lower respiratory, ENT & urinary tract infections'
  if (text.includes('AMIKACIN') || text.includes('AMILYTE')) return 'Severe hospital-acquired Gram-negative bacterial infections & sepsis'
  if (text.includes('CEFOPERAZONE') || text.includes('T BACTUM')) return 'Complicated intra-abdominal, respiratory & surgical site bacterial infections'
  if (text.includes('HYDROCORTISONE') || text.includes('HYDRORAC')) return 'Acute adrenal crisis, severe allergic reactions & shock states'
  if (text.includes('PAPAIN') || text.includes('DEBRIRAC')) return 'Enzymatic debridement of necrotic tissue in acute/chronic wounds & burn ulcers'
  if (text.includes('CO-ENZYME Q-10') || text.includes('BIO-Q') || text.includes('BIO Q MAX') || text.includes('COVITIX')) return 'Female & male reproductive vitality, cellular energy & antioxidant protection'
  if (text.includes('ARGILYTE') || text.includes('ARGININE')) return 'Placental circulation improvement, fetal growth restriction support & vascular tone'
  if (text.includes('PROLYTIX') || text.includes('DHA POWDER')) return 'Maternal protein nourishment & fetal cognitive brain development'
  if (text.includes('PROLYTE D')) return 'Specialized high-protein diabetic nutritional formula for glycemic stability'
  if (text.includes('OMEGA-3') || text.includes('B3 MAX')) return 'Cardiovascular lipid balance, maternal DHA enrichment & vascular elasticity'
  
  if (divId === 'anti-infectives') return 'Bacterial infections across clinical therapy areas'
  if (divId === 'cardiac') return 'Cardiovascular therapy & glycemic management'
  if (divId === 'gastro') return 'Gastrointestinal comfort, acid reduction & digestive health'
  if (divId === 'analgesics') return 'Relief of acute pain, fever, inflammation & muscular spasm'
  if (divId === 'ortho') return 'Osteogenic stimulation, cartilage restoration & joint flexibility'
  if (divId === 'neuro') return 'Neuropathic pain relief & neuro-restorative health'
  if (divId === 'gynecology') return 'Maternal health, luteal support & reproductive vitality'
  if (divId === 'derma') return 'Therapeutic dermatology, skin barrier restoration & cosmetology'
  if (divId === 'injectables') return 'Parenteral critical care & sterile hospital therapeutics'
  if (divId === 'wound-care') return 'Topical wound healing acceleration & enzymatic debridement'
  return 'Therapeutic nutritional supplementation & metabolic health'
}

let curSeg = ''
let curDivId = ''
const medicines = []

rows.forEach((r, idx) => {
  let col0 = (r[0] || '').toString().trim()
  let col1 = (r[1] || '').toString().trim()
  
  if (!col0 && !col1) return
  
  const normCol0 = normalizeKey(col0)
  if (segmentToDivId[normCol0]) {
    curSeg = col0
    curDivId = segmentToDivId[normCol0]
    return
  }
  
  // If col0 is empty but col1 is calamine lotion
  if (!col0 && col1.includes('Aloe Vera Extract')) {
    col0 = 'EFARAC CALAMINE LOTION'
  }
  
  // Clean up product name
  let name = col0
    .replace(/\s+/g, ' ')
    .trim()
  
  // Fix minor typos in raw Excel
  if (name.toUpperCase() === 'SETOTIX PT 300 MG TAB') name = 'SETOTIX PT 300 TAB'
  if (name.toUpperCase() === 'RABEFAST-LSR 40 TAB') name = 'RABEFAST-LSR 40 TAB'
  if (name.toUpperCase() === 'EFARAC MOISTURIZER CREEM') name = 'EFARAC MOISTURIZER CREAM'
  if (name.toUpperCase() === 'ARGILYTE PLUS') name = 'ARGILYTE PLUS SACHET'
  if (name.toUpperCase() === 'DEBRIRAC ONT') name = 'DEBRIRAC OINTMENT'
  if (name.toUpperCase() === 'CALZON ADVANCE SACHET') name = 'CALZON ADVANCE SACHET'
  
  let comp = col1.replace(/\s+/g, ' ').trim()
  if (comp.startsWith('acecloAceclofenac')) {
    comp = comp.replace('acecloAceclofenac', 'Aceclofenac')
  }
  if (comp.startsWith('s etodolac')) {
    comp = comp.replace('s etodolac', 'Etodolac')
  }
  
  const form = detectForm(name, comp)
  const pack = detectPack(form, name)
  const ingredients = parseIngredients(comp)
  const indication = getIndication(name, comp, curDivId)
  
  // Create unique clean ID
  const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${curDivId}`
  
  const isFeatured = [
    'NANOLYTE D-3 NANO SHOT', 'BIONAC SP', 'TELMONEX 40', 'BIO-CQ TAB', 'FIXBONE CQ TAB',
    'RABEFAST-DSR CAPSULE', 'PRESITA-100 TAB', 'BIOFLEX C2+', 'EFARAC MOISTURIZER CREAM',
    'DYDROLYTE TAB', 'GABATRIX NT', 'CEFUBAX CV 625', 'GLOW LYTE TAB'
  ].some(k => name.toUpperCase().includes(k))

  medicines.push({
    id,
    name,
    genericName: comp ? comp.slice(0, 100) : name,
    divisionId: curDivId,
    form,
    pack,
    composition: comp,
    indication,
    ingredients,
    isFeatured,
    isNew: false
  })
})

console.log(`Generated ${medicines.length} medicines across ${divisions.length} divisions.`)

// TypeScript file content
const tsContent = `// Real Biolytix Pharmaceuticals Product Catalogue
// Generated from SEGMENT WISE.xlsx

export interface Ingredient {
  name: string
  strength: string
}

export type DosageForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Suspension' | 'Injection' | 'Drops' | 'Cream' | 'Oral Solution' | 'Powder' | 'Gel' | 'Ointment' | 'Soap'

export interface DivisionBannerSlide {
  eyebrow: string
  title: string
  body: string
  stat: string
  art: 'shield' | 'thermo' | 'flask' | 'wind' | 'leaf' | 'heart' | 'tube' | 'eye' | 'sparkles'
  tint: string
}

export interface Division {
  id: string
  name: string
  shortLabel: string
  icon: string
  tagline?: string
  description?: string
  accentColor?: string
  heroImage?: string
  stat?: string
  banners?: DivisionBannerSlide[]
}

export interface Medicine {
  id: string
  name: string
  genericName?: string
  divisionId: string
  form: DosageForm
  pack: string
  composition: string
  indication: string
  ingredients: Ingredient[]
  isFeatured?: boolean
  featured?: boolean
  isNew?: boolean
  storage?: string
  schedule?: 'Rx' | 'OTC'
}

export const divisions: Division[] = ${JSON.stringify(divisions, null, 2)}

export const medicines: Medicine[] = ${JSON.stringify(medicines, null, 2)}

export const featuredMedicines = medicines.filter(m => m.isFeatured)

export const getDivisionById = (id: string): Division | undefined =>
  divisions.find(d => d.id === id)

export const medicinesByDivision = (divisionId: string): Medicine[] =>
  medicines.filter(m => m.divisionId === divisionId)

export const getMedicinesByDivision = medicinesByDivision

export const searchMedicines = (query: string): Medicine[] => {
  const q = query.toLowerCase().trim()
  if (!q) return medicines
  return medicines.filter(
    m =>
      m.name.toLowerCase().includes(q) ||
      (m.genericName && m.genericName.toLowerCase().includes(q)) ||
      m.composition.toLowerCase().includes(q) ||
      m.indication.toLowerCase().includes(q) ||
      (m.ingredients && m.ingredients.some(ing => ing.name.toLowerCase().includes(q)))
  )
}
`

fs.writeFileSync(path.resolve(__dirname, '../src/data/products.ts'), tsContent)
console.log('Successfully written real products to src/data/products.ts')

// Update data/live_db.json
const liveDbPath = path.resolve(__dirname, '../data/live_db.json')
const currentLiveDb = JSON.parse(fs.readFileSync(liveDbPath, 'utf8'))
currentLiveDb.divisions = divisions
currentLiveDb.medicines = medicines
currentLiveDb.lastUpdated = new Date().toISOString()
fs.writeFileSync(liveDbPath, JSON.stringify(currentLiveDb, null, 2))
console.log('Successfully updated data/live_db.json with 11 divisions and 82 medicines.')
