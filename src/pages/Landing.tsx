import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ShieldPlus, Thermometer, FlaskConical, Wind, Leaf, HeartPulse, Sparkles, Eye, 
  ArrowRight, CheckCircle2, Award, Layers, Calendar, Activity, Zap, Pill, Syringe, Bandage, Shield, Baby, Brain
} from 'lucide-react'
import HeroSlider from '../components/site/HeroSlider'
import SectionHeading from '../components/site/SectionHeading'
import StatCounter from '../components/site/StatCounter'
import Reveal from '../components/site/Reveal'
import FormArt from '../components/site/FormArt'
import BiolytixAcronym from '../components/site/BiolytixAcronym'
import { useDataContext } from '../context/DataContext'

const DIVISION_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>> = {
  ShieldPlus, Thermometer, FlaskConical, Wind, Leaf, HeartPulse, Sparkles, Eye,
  Activity, Zap, Pill, Syringe, Bandage, Shield, Baby, Brain
}

const QUALITY_CARDS = [
  { icon: <ShieldPlus size={28} />, title: 'WHO-GMP Manufacturing', desc: 'Certified manufacturing units meeting global Good Manufacturing Practice standards for every batch we produce.' },
  { icon: <Award size={28} />, title: 'In-House QC Laboratory', desc: 'Fully equipped microbiology and chemical testing labs ensure quality at every step of production.' },
  { icon: <CheckCircle2 size={28} />, title: 'ISO 9001 & 14001', desc: 'Quality and environmental management systems certified to international standards across all operations.' },
  { icon: <HeartPulse size={28} />, title: 'Pharmacovigilance', desc: 'Post-market safety monitoring to ensure patient well-being at every stage of the product lifecycle.' },
]

const DIV_COLORS = [
  '#22c55e', '#f97316', '#0284c7', '#8b5cf6', '#10b981', '#1a7fc1',
  '#ec4899', '#f43f5e', '#a855f7', '#06b6d4', '#e11d48',
]

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

export default function Landing() {
  const { divisions, medicines, company } = useDataContext()
  const featured = medicines.filter(m => m.isFeatured || (m as any).featured)
  const displayMedicines = featured.length > 0 ? featured : medicines.slice(0, 8)

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── Top Key Metric Stats Strip ────────────────────────────────────── */}
      <section style={{ background: 'var(--surface-alt)', borderBottom: '1px solid #e2e8f0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <StatCounter end={company.foundingYear || 2024} label="Established Year" icon={<Calendar size={22} />} />
          <StatCounter end={divisions.length} label="Therapeutic Divisions" icon={<Layers size={22} />} />
          <StatCounter end={medicines.length} suffix="+" label="Approved Formulations" icon={<FlaskConical size={22} />} />
        </div>
      </section>

      {/* ── Welcome To Biolytix & Brand Philosophy Acronym (Unified 2-Col Section) ── */}
      <BiolytixAcronym />

      {/* ── Divisions Grid ───────────────────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Our Divisions"
            title={`${divisions.length} Therapeutic Areas, One Standard`}
            description="From general medicine to specialty therapeutics — our portfolio covers the most critical segments of patient care."
          />
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {divisions.map((div, i) => {
              const Icon = DIVISION_ICONS[div.icon] || ShieldPlus
              const color = div.accentColor || DIV_COLORS[i % DIV_COLORS.length]
              return (
                <motion.div key={div.id} variants={fadeUp}>
                  <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Link
                      to={`/products?division=${div.id}`}
                      className="card block p-5 group h-full"
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        style={{
                          width: 48, height: 48, borderRadius: 12,
                          background: `${color}18`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: 12, color,
                          transition: 'all .2s',
                        }}
                      >
                        <Icon size={22} strokeWidth={1.8} />
                      </div>
                      <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--brand-ink)' }}>{div.name}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{(div.description || 'Specialized pharmaceutical formulations and treatments.').slice(0, 80)}…</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                        Explore <ArrowRight size={12} />
                      </span>
                    </Link>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-alt)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Featured Formulations"
            title="Trusted Products from Our Portfolio"
            description="A selection of our most prescribed formulations, manufactured to exacting pharmacopoeial standards."
          />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {displayMedicines.map((med) => {
              const divData = divisions.find(d => d.id === med.divisionId)
              const color = divData ? DIV_COLORS[divisions.indexOf(divData) % DIV_COLORS.length] : 'var(--brand)'
              return (
                <motion.div key={med.id} variants={fadeUp}>
                  <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
                    <Link
                      to={`/products?division=${med.divisionId}`}
                      className="card block overflow-hidden group h-full"
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        style={{
                          height: 90,
                          background: `linear-gradient(135deg, ${color}22 0%, ${color}08 100%)`,
                          borderBottom: `1px solid ${color}22`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                          position: 'relative',
                        }}
                      >
                        <FormArt form={med.form} color={color} size={52} />
                        {med.isNew && <span className="badge-new" style={{ position: 'absolute', top: 10, right: 10 }}>New</span>}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start gap-2 mb-1">
                          <span className="text-sm font-bold" style={{ color: 'var(--brand-ink)' }}>{med.name}</span>
                          <span className="badge-rx flex-shrink-0">Rx</span>
                        </div>
                        <p className="text-xs mb-2" style={{ color }}>
                          {med.ingredients.map(ing => `${ing.name} ${ing.strength}`).join(' + ')}
                        </p>
                        <p className="text-xs text-gray-500 leading-snug">{med.indication}</p>
                        <div className="mt-2 flex gap-1 flex-wrap">
                          <span className="ingredient-chip">{med.form}</span>
                          <span className="ingredient-chip">{med.pack}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
          <div className="mt-10 text-center">
            <Link to="/products" className="btn btn-primary">
              View Full Product Catalogue <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quality Band (dark) ── equal-height cards + hover scale ───────── */}
      <section className="section brand-gradient-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            dark
            eyebrow="Our Commitment"
            title="Quality is a Discipline, Not a Department."
            description="Every decision at Biolytix — from raw material procurement to final batch release — is governed by an uncompromising quality framework."
          />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2 items-stretch"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {QUALITY_CARDS.map((c) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ duration: 0.22 }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  padding: '1.75rem 1.5rem',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--brand-accent)',
                  marginBottom: 16,
                  flexShrink: 0,
                }}>
                  {c.icon}
                </div>
                <h3 className="text-white text-base font-bold mb-3">{c.title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-10 text-center">
            <Link to="/quality-policy" className="btn btn-outline-white">
              Read Our Quality Policy <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Partner CTA ───────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, var(--brand-muted) 0%, #e0f2fe 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <Reveal>
            <p className="eyebrow mb-3">Start a Partnership</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5" style={{ color: 'var(--brand-ink)' }}>
              Ready to Work with Biolytix?
            </h2>
            <p className="text-base max-w-xl mx-auto mb-8" style={{ color: 'var(--text-muted)' }}>
              Whether you are a distributor, hospital buyer, or institutional partner — we have the quality, range, and supply chain to serve you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn btn-primary text-base px-7 py-3">Contact Us Today</Link>
              <Link to="/products" className="btn btn-outline text-base px-7 py-3">Browse Products</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
