import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShieldCheck, Beaker, HeartPulse, Sparkles, ArrowRight } from 'lucide-react'

interface SlideData {
  id: number
  eyebrow: string
  headline: [string, string]
  highlight: number
  body: string
  cta1: { label: string; to: string }
  cta2: { label: string; to: string }
  chips: string[]
  icon: typeof ShieldCheck
  image: string
  artColor: string
  statNumber: string
  statLabel: string
  statDesc: string
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    eyebrow: 'WHO-GMP Certified Manufacturer',
    headline: ['Quality That', 'Physicians Trust'],
    highlight: 1,
    body: 'From anti-infectives to cardiac care — Biolytix delivers precision-formulated medicines across 8 therapeutic divisions with uncompromised clinical efficacy.',
    cta1: { label: 'Explore Products', to: '/products' },
    cta2: { label: 'About Us', to: '/about' },
    chips: ['WHO-GMP Certified', 'ISO 9001:2015', 'DCGI Approved'],
    icon: ShieldCheck,
    image: '/images/slides/slide1.jpg',
    artColor: '#38bdf8',
    statNumber: '5,000+',
    statLabel: 'Healthcare Providers',
    statDesc: 'Prescribing Biolytix formulations across India'
  },
  {
    id: 2,
    eyebrow: '8 Therapeutic Divisions',
    headline: ['73+ Formulations,', 'One Standard of Quality'],
    highlight: 0,
    body: 'Every tablet, capsule, injection, and syrup in our portfolio undergoes rigorous in-house QC & stability testing before release from our WHO-GMP units.',
    cta1: { label: 'View Catalogue', to: '/products' },
    cta2: { label: 'Quality Policy', to: '/quality-policy' },
    chips: ['In-House QC Lab', '8 Divisions', 'Batch Tested'],
    icon: Beaker,
    image: '/images/slides/slide2.jpg',
    artColor: '#00e5ff',
    statNumber: '100%',
    statLabel: 'Batch Verified',
    statDesc: 'Physicochemical & microbiological release testing'
  },
  {
    id: 3,
    eyebrow: 'Cardiac & Metabolic Care',
    headline: ['Precision Therapeutics', 'for Chronic Disease'],
    highlight: 0,
    body: 'Evidence-based formulations for hypertension, diabetes, dyslipidemia, and chronic pain management — manufactured to strict pharmacopoeial standards.',
    cta1: { label: 'Cardiac Division', to: '/products?division=cardiac' },
    cta2: { label: 'Partner With Us', to: '/contact' },
    chips: ['Cardiovascular', 'Anti-Diabetic', 'Chronic Care'],
    icon: HeartPulse,
    image: '/images/slides/slide3.jpg',
    artColor: '#60a5fa',
    statNumber: '120+',
    statLabel: 'Formulation Pipeline',
    statDesc: 'Expanding chronic care therapeutic solutions'
  },
  {
    id: 4,
    eyebrow: 'Nutrition & Preventive Health',
    headline: ['Science-Backed', 'Supplementation'],
    highlight: 1,
    body: 'Next-generation vitamins, liposomal minerals, and nutraceuticals designed with enhanced bioavailability (e.g. Nanolyte D3 Nano Shots & Bio-Q 300).',
    cta1: { label: 'Nutrition Division', to: '/products?division=multivitamins' },
    cta2: { label: 'Contact Commercial Team', to: '/contact' },
    chips: ['Liposomal CoQ10', 'Vitamin D3 Nano Shots', 'Collagen Peptides'],
    icon: Sparkles,
    image: '/images/slides/slide4.jpg',
    artColor: '#34d399',
    statNumber: 'Max',
    statLabel: 'Bioavailability',
    statDesc: 'Engineered nano-emulsion & liposomal delivery'
  },
]

import { useDataContext } from '../../context/DataContext'

const INTERVAL = 6000

export default function HeroSlider() {
  const { slides: liveSlides } = useDataContext()
  const slides = liveSlides && liveSlides.length > 0 ? liveSlides : SLIDES

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  // Ensure current index is within bounds if slides length changes
  const safeCurrent = current >= slides.length ? 0 : current

  const goTo = useCallback((idx: number) => {
    setCurrent(idx)
    setProgressKey(k => k + 1)
  }, [])

  const next = useCallback(() => goTo((safeCurrent + 1) % slides.length), [safeCurrent, slides.length, goTo])
  const prev = useCallback(() => goTo((safeCurrent - 1 + slides.length) % slides.length), [safeCurrent, slides.length, goTo])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [paused, next])

  const slide = slides[safeCurrent] || slides[0]
  const SlideIcon = ShieldCheck

  return (
    <section
      className="relative overflow-hidden bg-slate-950 select-none"
      style={{ minHeight: '90vh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background Slide Image with Animated Zoom ──────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={slide.image}
            alt={slide.headline.join(' ')}
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Multi-Layer Cinematic Contrast Gradient Overlays ──────────────── */}
      {/* Primary Left Gradient for text readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(6, 20, 36, 0.96) 0%, rgba(6, 20, 36, 0.88) 45%, rgba(6, 20, 36, 0.55) 75%, rgba(6, 20, 36, 0.35) 100%)',
        }}
      />
      {/* Vertical Vignette & Bottom Shadow */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(6, 20, 36, 0.5) 0%, transparent 35%, rgba(6, 20, 36, 0.75) 100%)',
        }}
      />

      {/* Radial ambient glow corresponding to slide color */}
      <motion.div
        key={`glow-${current}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none z-[1] blur-[120px]"
        style={{ background: slide.artColor }}
      />

      {/* ── Main Content Container ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center" style={{ minHeight: '90vh' }}>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-20 lg:py-24">

          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Eyebrow Chip */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5 bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-sm">
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ background: slide.artColor }}
                  />
                  <span className="tracking-wide uppercase text-[11px] font-bold text-cyan-300">
                    {slide.eyebrow}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] text-white tracking-tight drop-shadow-md">
                  {slide.headline.map((line, i) => (
                    <span key={i} className="block">
                      {i === slide.highlight ? (
                        <span
                          className="bg-clip-text text-transparent"
                          style={{
                            backgroundImage: `linear-gradient(135deg, #ffffff 0%, ${slide.artColor} 70%)`,
                            filter: `drop-shadow(0 0 25px ${slide.artColor}66)`,
                          }}
                        >
                          {line}
                        </span>
                      ) : (
                        line
                      )}
                    </span>
                  ))}
                </h1>

                {/* Body Text */}
                <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl text-slate-200/90 font-normal">
                  {slide.body}
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    to={slide.cta1.to}
                    className="btn px-6 py-3.5 rounded-xl font-bold text-slate-950 text-sm inline-flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5"
                    style={{
                      background: `linear-gradient(135deg, #ffffff 0%, ${slide.artColor} 100%)`,
                      boxShadow: `0 8px 25px ${slide.artColor}40`,
                    }}
                  >
                    <span>{slide.cta1.label}</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to={slide.cta2.to}
                    className="btn px-6 py-3.5 rounded-xl font-semibold text-white text-sm bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all"
                  >
                    {slide.cta2.label}
                  </Link>
                </div>

                {/* Badges / Chips */}
                <div className="mt-7 flex flex-wrap gap-2">
                  {slide.chips.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-white/90 bg-white/5 border border-white/15 backdrop-blur-sm"
                    >
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Glassmorphic Feature Showcase Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.92, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative p-7 rounded-3xl"
                style={{
                  background: 'rgba(6, 21, 36, 0.65)',
                  border: `1px solid ${slide.artColor}40`,
                  boxShadow: `0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px ${slide.artColor}20`,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Header Icon + Division Label */}
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                      style={{
                        background: `${slide.artColor}25`,
                        border: `1px solid ${slide.artColor}60`,
                        color: slide.artColor,
                      }}
                    >
                      <SlideIcon size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">Formulation Standard</p>
                      <h4 className="text-base font-bold text-white">Biolytix Quality Assurance</h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Verified
                  </span>
                </div>

                {/* Key Stat Block */}
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 mb-5">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-4xl font-extrabold tracking-tight"
                      style={{ color: slide.artColor }}
                    >
                      {slide.statNumber}
                    </span>
                    <span className="text-sm font-bold text-white">{slide.statLabel}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {slide.statDesc}
                  </p>
                </div>

                {/* Micro Guarantee List */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: slide.artColor }} />
                    <span>WHO-GMP & Schedule M Compliant Facility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: slide.artColor }} />
                    <span>Validated In-House Physicochemical Testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: slide.artColor }} />
                    <span>Cold-chain and tamper-evident packaging</span>
                  </div>
                </div>

                {/* Bottom Quick Link */}
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Therapeutic Division</span>
                  <Link
                    to={slide.cta1.to}
                    className="font-bold inline-flex items-center gap-1 hover:underline"
                    style={{ color: slide.artColor }}
                  >
                    Explore Division Details <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Slider Navigation Controls Bar ───────────────────────────────── */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-5 py-2.5 rounded-full bg-slate-900/80 border border-white/15 backdrop-blur-xl shadow-2xl"
        >
          {/* Previous Button */}
          <button
            onClick={prev}
            aria-label="Previous Slide"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-300 rounded-full cursor-pointer"
                style={{
                  width: i === current ? 28 : 8,
                  height: 8,
                  background: i === current ? slide.artColor : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: i === current ? `0 0 10px ${slide.artColor}` : 'none',
                }}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={next}
            aria-label="Next Slide"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>

          {/* Slide Number Counter */}
          <span className="font-mono text-xs font-bold text-slate-300 pl-2 border-l border-white/15">
            0{current + 1} <span className="text-slate-500">/ 0{SLIDES.length}</span>
          </span>
        </div>

        {/* ── Active Progress Bar ────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          {!paused && (
            <motion.div
              key={progressKey}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
              className="h-full"
              style={{
                background: `linear-gradient(90deg, #1a7fc1, ${slide.artColor})`,
                boxShadow: `0 0 8px ${slide.artColor}`,
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
