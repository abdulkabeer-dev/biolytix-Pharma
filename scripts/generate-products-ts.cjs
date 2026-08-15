const fs = require('fs')
const path = require('path')

const dumped = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dumped_products.json'), 'utf8'))

// Therapeutic divisions definition with banners and short labels
const divisions = [
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
        body: 'DPP-4 inhibitors and biguanide combinations designed for smooth glycemic stabilization and reduced hypoglycemic risk.',
        stat: 'End-Organ Protection',
        art: 'shield',
        tint: 'from-red-900 to-pink-950',
      },
    ],
  },
  {
    id: 'multivitamins',
    name: 'Multivitamins & Nutraceuticals',
    shortLabel: 'Nutraceuticals',
    icon: 'Leaf',
    tagline: 'Sustaining holistic cellular nutrition and immune resilience.',
    description: 'Therapeutic multivitamins, essential mineral complexes, amino acids, antioxidants, collagen peptides, bone-health CQ supplements, and hematinics.',
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
        title: 'Collagen Peptides, Cissus & Vitamin D3 Regimens',
        body: 'Specialized bone mineralization, osteogenic stimulation, and cartilage repair complexes for active joint longevity.',
        stat: 'Synergistic Mineralization',
        art: 'shield',
        tint: 'from-teal-900 to-emerald-950',
      },
    ],
  },
  {
    id: 'respiratory',
    name: 'Respiratory & Anti-Allergic',
    shortLabel: 'Respiratory',
    icon: 'Wind',
    tagline: 'Clear airways and rapid allergy defense for unobstructed breathing.',
    description: 'Bronchodilators, mucolytics, expectorants, corticosteroids, and anti-histaminic syrups, suspensions, and tablets.',
    accentColor: '#0ea5e9',
    heroImage: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=1200&q=80',
    stat: 'Clean Formulations',
    banners: [
      {
        eyebrow: 'Bronchial & Allergy Care',
        title: 'Rapid Airway Clearance & Anti-Histaminic Defense',
        body: 'Specialized anti-allergic, anti-inflammatory, and bronchodilating formulations providing immediate breathing comfort.',
        stat: 'Fast-Acting Relief',
        art: 'wind',
        tint: 'from-cyan-900 to-sky-950',
      },
      {
        eyebrow: 'Anti-Inflammatory Steroid Care',
        title: 'Precision Corticosteroid Therapy',
        body: 'Deflazocort and second-generation anti-allergics engineered with enhanced therapeutic safety profiles.',
        stat: 'High Safety Margin',
        art: 'shield',
        tint: 'from-sky-900 to-blue-950',
      },
    ],
  },
  {
    id: 'derma',
    name: 'Dermatology & Topical Care',
    shortLabel: 'Dermatology',
    icon: 'Sparkles',
    tagline: 'Restoring dermal integrity with advanced topical therapeutics.',
    description: 'Topical emollients, antifungal creams, anti-inflammatory ointments, soothing moisturizers, and barrier restoration preparations.',
    accentColor: '#a855f7',
    heroImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80',
    stat: 'Dermatologist Tested',
    banners: [
      {
        eyebrow: 'Barrier Restoration',
        title: 'Advanced Emollient & Dermal Care Formulations',
        body: 'Physiological lipid replenishment, soothing moisturizers, and barrier protective formulations for healthy dermal recovery.',
        stat: 'Non-Greasy Rapid Absorption',
        art: 'tube',
        tint: 'from-purple-900 to-violet-950',
      },
      {
        eyebrow: 'Targeted Topical Therapy',
        title: 'Antifungal & Anti-Inflammatory Dermatology',
        body: 'Precision topical creams and ointments delivering localized active penetration for stubborn dermatological conditions.',
        stat: 'Clinically Proven Efficacy',
        art: 'sparkles',
        tint: 'from-fuchsia-900 to-purple-950',
      },
    ],
  },
  {
    id: 'ophthalmic',
    name: 'Ophthalmic & ENT Preparations',
    shortLabel: 'Ophthalmic & ENT',
    icon: 'Eye',
    tagline: 'Sterile precision care for sensitive ocular and ENT pathways.',
    description: 'Sterile eye/ear drops, lubricating artificial tears, anti-infective and anti-inflammatory ophthalmic formulations.',
    accentColor: '#6366f1',
    heroImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80',
    stat: 'Sterile Unit Production',
    banners: [
      {
        eyebrow: 'Ophthalmic Precision',
        title: 'Sterile Ocular Lubricants & Anti-Infectives',
        body: 'Formulated in Class 100 cleanroom environments with physiological pH buffering for gentle and effective ocular comfort.',
        stat: 'Isotonic & Gentle',
        art: 'eye',
        tint: 'from-indigo-900 to-blue-950',
      },
      {
        eyebrow: 'ENT Formulations',
        title: 'Targeted Otic & Ophthalmic Solutions',
        body: 'Sterile single and multi-dose packaging ensuring patient compliance and microbiological purity throughout usage.',
        stat: 'Microbiologically Pure',
        art: 'shield',
        tint: 'from-blue-900 to-indigo-950',
      },
    ],
  },
]

// Deduplicate dumped products
const seen = new Map()

dumped.forEach(item => {
  let name = item.name.replace(/\s+/g, ' ').trim()
  let comp = item.composition.replace(/\s+/g, ' ').trim()
  
  if (!name || name === 'Product Name' || name === 'NAME') return
  
  const key = name.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (!seen.has(key)) {
    seen.set(key, { name, composition: comp })
  } else {
    const existing = seen.get(key)
    if (!existing.composition && comp) {
      seen.set(key, { name, composition: comp })
    }
  }
})

const uniqueList = Array.from(seen.values())

// Helper functions for categorization
function detectForm(name, comp) {
  const text = (name + ' ' + comp).toUpperCase()
  if (text.includes('TAB') || text.includes('TABLET')) return 'Tablet'
  if (text.includes('CAPSULE') || text.includes('CAP')) return 'Capsule'
  if (text.includes('SYR') || text.includes('SYRUP')) return 'Syrup'
  if (text.includes('SUSPENSION') || text.includes('SUSP')) return 'Suspension'
  if (text.includes('INJ') || text.includes('INJECTION')) return 'Injection'
  if (text.includes('DROPS') || text.includes('DROP')) return 'Drops'
  if (text.includes('CREEM') || text.includes('CREAM') || text.includes('OINTMENT') || text.includes('GEL') || text.includes('LOTION')) return 'Cream'
  if (text.includes('NANO SHOT') || text.includes('SHOT')) return 'Oral Solution'
  if (text.includes('POWDER') || text.includes('SACHET')) return 'Powder'
  return 'Tablet'
}

function detectDivision(name, comp, form) {
  const text = (name + ' ' + comp).toUpperCase()
  
  // Ophthalmic
  if (text.includes('EYE') || text.includes('EAR') || text.includes('OPHTHALMIC') || text.includes('CARBOXYMETHYLCELLULOSE') || text.includes('MOXIFLOXACIN EYE')) return 'ophthalmic'
  
  // Derma
  if (form === 'Cream' || text.includes('MOISTURIZER') || text.includes('CREEM') || text.includes('CLOBETASOL') || text.includes('KETOCONAZOLE') || text.includes('ITRACONAZOLE') || text.includes('LULICONAZOLE') || text.includes('CALAMINE') || text.includes('FUSIDIC') || text.includes('PERMETHRIN')) return 'derma'
  
  // Cardiac / Diabetic
  if (text.includes('TELMISARTAN') || text.includes('TELMONEX') || text.includes('ROSUVASTATIN') || text.includes('ROSUGAURD') || text.includes('ATORVASTATIN') || text.includes('AMLODIPINE') || text.includes('SITAGLIPTIN') || text.includes('PRESITA') || text.includes('METFORMIN') || text.includes('VILDAGLIPTIN') || text.includes('GLIMEPIRIDE') || text.includes('TENELIGLIPTIN') || text.includes('CILNIDIPINE') || text.includes('NEBIVOLOL') || text.includes('CLOPIDOGREL') || text.includes('FUROSEMIDE') || text.includes('FURLYTE') || text.includes('SPIRONOLACTONE') || text.includes('BISOPROLOL')) return 'cardiac'
  
  // Gastro
  if (text.includes('SUCRALFATE') || text.includes('SUCLAR') || text.includes('PANTOPRAZOLE') || text.includes('RABEPRAZOLE') || text.includes('RABEFAST') || text.includes('OMEPRAZOLE') || text.includes('ESOMEPRAZOLE') || text.includes('DOMPERIDONE') || text.includes('LEVOSULPIRIDE') || text.includes('DIGESTIVE') || text.includes('ZYMIVIS') || text.includes('ENZYME') || text.includes('L-ORNITHINE') || text.includes('SILODYTIX') || text.includes('LACTULOSE') || text.includes('MAGALDRATE') || text.includes('SIMETHICONE') || text.includes('ONDANSETRON') || text.includes('PANTASPAN')) return 'gastro'
  
  // Respiratory
  if (text.includes('LEVOCETIRIZINE') || text.includes('MONTELUKAST') || text.includes('ACEBROPHYLLINE') || text.includes('AMBROXOL') || text.includes('GUAIPHENESIN') || text.includes('TERBUTALINE') || text.includes('DEXTROMETHORPHAN') || text.includes('PHENYLEPHRINE') || text.includes('CHLORPHENIRAMINE') || text.includes('DEFLAZOCORT') || text.includes('DEFZIX') || text.includes('BILASTINE') || text.includes('FEXOFENADINE')) return 'respiratory'
  
  // Anti-Infectives
  if (text.includes('AMOXYCILLIN') || text.includes('CLAVULANIC') || text.includes('CEFIXIME') || text.includes('CEFPODOXIME') || text.includes('AZITHROMYCIN') || text.includes('OFLOXACIN') || text.includes('LEVOFLOXACIN') || text.includes('CIPROFLOXACIN') || text.includes('LINEZOLID') || text.includes('FAROPENEM') || text.includes('CEFTRIAXONE') || text.includes('CEFUROXIME') || text.includes('MEROPENEM') || text.includes('PIPERACILLIN') || text.includes('TAZOBACTAM') || text.includes('DOXYCYCLINE')) return 'anti-infectives'
  
  // Analgesics / Muscle Relaxants / Joint Enzymes
  if (text.includes('ACECLOFENAC') || text.includes('BIONAC') || text.includes('BIOFENAC') || text.includes('PARACETAMOL') || text.includes('THIOCOLCHICOSIDE') || text.includes('SERRATIOPEPTIDASE') || text.includes('TRYPSIN') || text.includes('BROMELAIN') || text.includes('BROMOTRIX') || text.includes('RUTOSIDE') || text.includes('ETODOLAC') || text.includes('SETOTIX') || text.includes('EPERISONE') || text.includes('MYOSPER') || text.includes('FLUPIRTINE') || text.includes('FLUPIRAC') || text.includes('NAPROXEN') || text.includes('NAPRO') || text.includes('TRAMADOL') || text.includes('MEFENAMIC') || text.includes('CHYMOLYTE') || text.includes('DICLOFENAC') || text.includes('GABAPENTIN') || text.includes('PREGABALIN') || text.includes('GABATRIX')) return 'analgesics'
  
  // Multivitamins / Nutraceuticals / Bone health
  return 'multivitamins'
}

function parseIngredients(comp) {
  if (!comp) return [{ name: 'Therapeutic Formulation', strength: 'As Prescribed' }]
  
  const clean = comp.replace(/Tablet.*|Capsule.*|Syrup.*|Injection.*|\(per.*?\)/gi, '').trim()
  const parts = clean.split(/\+|\band\b|,\s*(?=[A-Za-z])/i)
  
  const ingredients = []
  parts.forEach(p => {
    let raw = p.trim().replace(/^[\s,;]+|[\s,;]+$/g, '')
    if (!raw) return
    
    const match = raw.match(/(\d+(?:\.\d+)?\s*(?:mg|gm|mcg|iu|au|%|g|ml|w\/v|w\/w))/i)
    if (match) {
      const strength = match[1].trim()
      const name = raw.replace(match[0], '').replace(/[()]/g, '').trim()
      ingredients.push({ name: name || raw, strength })
    } else {
      ingredients.push({ name: raw, strength: '' })
    }
  })
  
  return ingredients.length > 0 ? ingredients : [{ name: comp, strength: '' }]
}

function detectPack(form) {
  if (form === 'Tablet') return '10x10 Alu-Alu'
  if (form === 'Capsule') return '10x10 Blister'
  if (form === 'Syrup' || form === 'Suspension') return '100ml / 200ml Bottle'
  if (form === 'Injection') return 'Vial with WFI'
  if (form === 'Drops') return '15ml Dropper Bottle'
  if (form === 'Cream') return '30g / 50g Lamitube'
  if (form === 'Oral Solution') return '4 x 5ml Shots'
  return 'Standard Unit Pack'
}

function detectIndication(name, comp, div) {
  const text = (name + ' ' + comp).toUpperCase()
  if (text.includes('CHOLECALCIFEROL') || text.includes('D3')) return 'Vitamin D3 deficiency, bone mineralization & immune health'
  if (text.includes('CISSUS') || text.includes('FIXBONE') || text.includes('CARTIFLEX') || text.includes('COLLAGEN')) return 'Fracture healing, joint flexibility, cartilage repair & osteoporosis'
  if (text.includes('DYDROGESTERONE') || text.includes('DYDROLYTE')) return 'Progesterone deficiency, luteal support & threatened miscarriage'
  if (text.includes('SUCRALFATE') || text.includes('SUCLAR')) return 'Peptic ulcers, mucosal protection & GERD relief'
  if (text.includes('LYCOPENE') || text.includes('BIOMMUNE') || text.includes('ANTIOXIDAN')) return 'General immunity booster, oxidative stress & vitality'
  if (text.includes('ACECLOFENAC') && text.includes('THIOCOLCHICOSIDE')) return 'Acute musculoskeletal spasm, lower back pain & joint inflammation'
  if (text.includes('ACECLOFENAC') && text.includes('SERRATIOPEPTIDASE')) return 'Post-operative pain, edema & inflammatory swelling'
  if (text.includes('ACECLOFENAC') || text.includes('BIONAC')) return 'Pain, fever, osteoarthritis & rheumatoid inflammation'
  if (text.includes('TELMISARTAN') || text.includes('TELMONEX')) return 'Essential hypertension & cardiovascular risk reduction'
  if (text.includes('ROSUVASTATIN') || text.includes('ROSUGAURD')) return 'Hypercholesterolemia & atherosclerotic cardiovascular disease'
  if (text.includes('SITAGLIPTIN') || text.includes('PRESITA')) return 'Type 2 Diabetes Mellitus glycemic management'
  if (text.includes('RABEPRAZOLE') || text.includes('RABEFAST')) return 'Acid peptic disease, hyperacidity, GERD & dyspepsia'
  if (text.includes('TRYPSIN') || text.includes('BROMOTRIX') || text.includes('CHYMOLYTE')) return 'Resolution of post-traumatic hematoma, wound healing & edema'
  if (text.includes('GABAPENTIN') || text.includes('GABATRIX')) return 'Neuropathic pain, post-herpetic neuralgia & nerve discomfort'
  if (text.includes('FLUPIRTINE') || text.includes('FLUPIRAC')) return 'Centrally acting analgesic for muscle tension & chronic pain'
  if (text.includes('FERROUS') || text.includes('IRON') || text.includes('FEROCAN') || text.includes('IROTEX')) return 'Iron deficiency anemia, pregnancy & convalescence support'
  if (text.includes('DEFZIX') || text.includes('DEFLAZOCORT')) return 'Severe allergy, inflammatory conditions & immunosuppressive therapy'
  if (text.includes('MOISTURIZER') || text.includes('EFARAC')) return 'Dry skin hydration, barrier replenishment & xerosis'
  if (text.includes('THIAMINE') || text.includes('THIALYTE')) return 'Vitamin B1 deficiency & metabolic nerve health'
  if (text.includes('FUROSEMIDE') || text.includes('FURLYTE')) return 'Edema associated with heart failure & fluid overload'
  if (text.includes('DIGESTIVE') || text.includes('ZYMIVIS')) return 'Indigestion, dyspepsia, bloating & digestive enzyme support'
  if (text.includes('EPERISONE') || text.includes('MYOSPER')) return 'Musculoskeletal pain, muscle hypertonia & cervical syndrome'
  if (text.includes('NAPROXEN') || text.includes('NAPRO')) return 'Migraine headache, acute arthritis & dysmenorrhea'
  
  if (div === 'anti-infectives') return 'Bacterial infections of the respiratory, urinary & skin tracts'
  if (div === 'cardiac') return 'Cardiovascular therapy & metabolic management'
  if (div === 'gastro') return 'Gastrointestinal comfort, acid reduction & digestive health'
  if (div === 'analgesics') return 'Relief of pain, inflammation, swelling and muscular tension'
  if (div === 'respiratory') return 'Allergic rhinitis, bronchitis, cough and airway clearance'
  if (div === 'derma') return 'Topical treatment of dermatological skin conditions'
  if (div === 'ophthalmic') return 'Ophthalmic and ENT comfort and infection management'
  return 'Therapeutic nutritional supplementation & metabolic health'
}

// Generate the medicines array
const medicines = uniqueList.map((item, index) => {
  const form = detectForm(item.name, item.composition)
  const divisionId = detectDivision(item.name, item.composition, form)
  const id = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `prod-${index + 1}`
  const pack = detectPack(form)
  const indication = detectIndication(item.name, item.composition, divisionId)
  const ingredients = parseIngredients(item.composition)
  const isFeatured = index < 12 || ['NANOLYTE D-3 NANO SHOT', 'BIONAC SP', 'TELMONEX 40', 'BIO-CQ TAB', 'CARTIFLEX TAB', 'RABEFAST-DSR CAPSULE', 'PRESITA-100 TAB', 'FIXBONE CQ TAB'].some(k => item.name.toUpperCase().includes(k))
  const isNew = index % 5 === 0

  return {
    id,
    name: item.name.replace(/\s+/g, ' ').trim(),
    genericName: item.composition ? item.composition.slice(0, 100) : item.name,
    divisionId,
    form,
    pack,
    composition: item.composition || 'Therapeutic Formulation',
    indication,
    ingredients,
    isFeatured,
    isNew,
  }
})

// Write out TypeScript code for src/data/products.ts
const tsContent = `// Real Biolytix Pharmaceuticals Product Catalogue
// Generated from BIOLYTIX.xlsx

export interface Ingredient {
  name: string
  strength: string
}

export type DosageForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Suspension' | 'Injection' | 'Drops' | 'Cream' | 'Oral Solution' | 'Powder'

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
  tagline: string
  description: string
  accentColor: string
  heroImage: string
  stat: string
  banners: DivisionBannerSlide[]
}

export interface Medicine {
  id: string
  name: string
  genericName: string
  divisionId: string
  form: DosageForm
  pack: string
  composition: string
  indication: string
  ingredients: Ingredient[]
  isFeatured?: boolean
  isNew?: boolean
  storage?: string
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
      m.genericName.toLowerCase().includes(q) ||
      m.composition.toLowerCase().includes(q) ||
      m.indication.toLowerCase().includes(q) ||
      m.ingredients.some(ing => ing.name.toLowerCase().includes(q))
  )
}
`

fs.writeFileSync(path.resolve(__dirname, '../src/data/products.ts'), tsContent)
console.log('Successfully written real products to src/data/products.ts')
