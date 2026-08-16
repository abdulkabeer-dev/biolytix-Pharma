import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Megaphone, 
  ClipboardList, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { company } from '../../data/company'
import BrandLogo from './BrandLogo'

const ACRONYM_ITEMS = [
  { letter: 'B', word: 'Better', desc: 'Superior formulations & strict pharmacopoeial quality', color: '#1a7fc1' },
  { letter: 'I', word: 'Innovative', desc: 'Advanced drug delivery & therapeutic efficacy', color: '#0ea5e9' },
  { letter: 'O', word: 'Outstanding', desc: 'Proven clinical outcomes across 8 divisions', color: '#10b981' },
  { letter: 'L', word: 'Leading', desc: 'Ethical pharmaceutical marketing & distribution', color: '#6366f1' },
  { letter: 'Y', word: 'Your Health', desc: 'Patient well-being is our highest corporate duty', color: '#f43f5e' },
  { letter: 'T', word: 'Trusted', desc: 'Prescribed by 1,000+ physicians & institutions', color: '#f59e0b' },
  { letter: 'I', word: 'Integrity', desc: '100% transparent testing & audited API sourcing', color: '#14b8a6' },
  { letter: 'X', word: 'eXcellence', desc: 'Zero-defect manufacturing in WHO-GMP facilities', color: '#a855f7' },
]

const ACTIVITIES = [
  {
    icon: <Megaphone size={22} />,
    title: 'Marketing Team Activity',
    desc: 'Dedicated field force connecting healthcare practitioners nationwide',
  },
  {
    icon: <ClipboardList size={22} />,
    title: 'Promotional Material Management',
    desc: 'Comprehensive scientific literature, product dossiers & visual aids',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Admin & Quality Compliance',
    desc: 'Strict adherence to WHO-GMP, ISO & regulatory pharmacopoeia',
  },
  {
    icon: <Truck size={22} />,
    title: 'Stock & Dispatch Logistics',
    desc: 'Temperature-controlled rapid dispatch across all Indian states',
  },
]

export default function BiolytixAcronym() {
  const [activeIdx, setActiveIdx] = useState<number>(0)

  return (
    <section className="section bg-gradient-to-b from-white via-slate-50/60 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main 2-Column Responsive Unified About & Philosophy Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">

          {/* ── Left Column: Welcome & Operations (7 cols on desktop) ── */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20 mb-3.5">
                <Award size={14} /> About Biolytix
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-gray-900 leading-[1.15] tracking-tight">
                Welcome To <span className="text-brand">Biolytix</span> Pharmaceuticals Pvt. Ltd.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                Backed by extensive technical experience in pharmaceutical formulation and healthcare logistics, Biolytix proudly boasts one of the finest networks in <strong className="text-brand font-semibold">Pharmaceutical Marketing, Quality Compliance, and Supply Chain Distribution</strong> across India.
              </p>
            </div>

            {/* 4 Activity Grid Tiles (Matching reference design) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {ACTIVITIES.map((act, i) => (
                <motion.div
                  key={act.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -3, borderColor: 'var(--brand)' }}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all group cursor-default"
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, var(--brand-muted) 0%, #e0f2fe 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand)',
                      flexShrink: 0,
                    }}
                    className="group-hover:scale-105 group-hover:bg-brand group-hover:!text-white transition-all shadow-xs"
                  >
                    {act.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-brand transition-colors leading-snug">
                      {act.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-normal">
                      {act.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/about" className="btn btn-primary text-sm shadow-md shadow-brand/20">
                Read More About Us <ArrowRight size={15} />
              </Link>
              <Link to="/products" className="btn btn-outline text-sm">
                Explore Formulations
              </Link>
            </div>
          </div>

          {/* ── Right Column: Creative & 100% Responsive Brand Poster (5 cols on desktop) ── */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-700/40 relative flex flex-col justify-between"
              style={{
                background: 'linear-gradient(155deg, #071b2e 0%, #0a2f52 50%, #07192c 100%)',
                boxShadow: '0 24px 60px -12px rgba(10, 37, 64, 0.45)',
              }}
            >
              {/* Background ambient lighting */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-brand/25 blur-3xl pointer-events-none" />

              {/* Poster Header */}
              <div className="p-6 sm:p-7 pb-4 relative z-10">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <BrandLogo dark size="sm" />
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold text-cyan-300">
                    <Sparkles size={12} /> WHO-GMP
                  </div>
                </div>

                {/* Central Brand Motto with rotating halo */}
                <div className="mt-5 text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-cyan-300">
                    Sustain Life Through
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
                    Quality & Service
                  </h3>
                </div>
              </div>

              {/* ── BIOLYTIX Acronym: Clean 2-Column Responsive Layout (Zero Squeeze!) ── */}
              <div className="px-6 sm:px-7 py-2 relative z-10 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-200/60 mb-2.5">
                  Core Brand Values
                </p>

                {/* 2-Column Balanced Grid: B-I-O-L on left, Y-T-I-X on right */}
                <div className="grid grid-cols-2 gap-2">
                  {ACRONYM_ITEMS.map((item, idx) => {
                    const isHovered = activeIdx === idx
                    return (
                      <div
                        key={item.letter + idx}
                        onMouseEnter={() => setActiveIdx(idx)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                          isHovered 
                            ? 'bg-white/15 border-cyan-400/50 shadow-md shadow-cyan-500/10 scale-[1.02]' 
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                        }`}
                      >
                        {/* Letter Icon Badge */}
                        <div
                          style={{
                            background: `linear-gradient(135deg, ${item.color} 0%, #00b4d8 100%)`,
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-xs flex-shrink-0"
                        >
                          {item.letter}
                        </div>
                        {/* Word */}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-extrabold text-white truncate">
                            {item.word}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Active Dynamic Description Snippet */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/20 text-[11px] sm:text-xs text-cyan-100/90 leading-snug flex items-center gap-2">
                  <span className="font-bold text-cyan-300 flex-shrink-0">
                    {ACRONYM_ITEMS[activeIdx].letter} — {ACRONYM_ITEMS[activeIdx].word}:
                  </span>
                  <span className="truncate text-slate-300">
                    {ACRONYM_ITEMS[activeIdx].desc}
                  </span>
                </div>
              </div>

              {/* ── Poster Bottom: 18+ Years Experience Banner (Matching Reference Image) ── */}
              <div className="mt-4 p-5 sm:p-6 bg-gradient-to-r from-brand to-cyan-600 text-white flex items-center justify-between relative z-10 border-t border-cyan-400/30">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl sm:text-4xl font-black text-white leading-none">
                    {company.yearsOfExcellence}+
                  </span>
                  <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider leading-tight text-white/90">
                    Years of <br />Excellence
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 text-white text-[11px] sm:text-xs font-bold backdrop-blur-xs">
                  <CheckCircle2 size={14} className="text-cyan-300" />
                  <span>ISO 9001:2015</span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  )
}
