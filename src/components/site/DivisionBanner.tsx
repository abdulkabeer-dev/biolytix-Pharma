import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shield, Thermometer, FlaskConical, Wind, Leaf, HeartPulse, Sparkles, Eye } from 'lucide-react'
import type { Division } from '../../data/products'

// Art components per type
const ArtMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  shield: Shield,
  thermo: Thermometer,
  flask: FlaskConical,
  wind: Wind,
  leaf: Leaf,
  heart: HeartPulse,
  tube: Sparkles,
  sparkles: Sparkles,
  eye: Eye,
}

interface DivisionBannerProps {
  division: Division
}

const INTERVAL = 6000

export default function DivisionBanner({ division }: DivisionBannerProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  const goTo = useCallback((idx: number) => {
    setCurrent(idx)
    setProgressKey(k => k + 1)
  }, [])

  const banners = division.banners && division.banners.length > 0 ? division.banners : [
    {
      eyebrow: division.name,
      title: division.tagline || division.name,
      body: division.description || 'Specialized pharmaceutical formulations and treatments.',
      stat: division.stat || '100% Quality Tested',
      art: 'shield' as const,
      tint: division.accentColor || 'var(--brand)',
    }
  ]

  const totalSlides = banners.length
  const next = useCallback(() => goTo((current + 1) % totalSlides), [current, goTo, totalSlides])
  const prev = useCallback(() => goTo((current - 1 + totalSlides) % totalSlides), [current, goTo, totalSlides])

  useEffect(() => {
    setCurrent(0)
    setProgressKey(k => k + 1)
  }, [division.id])

  useEffect(() => {
    if (paused || totalSlides <= 1) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [paused, next, totalSlides])

  const slide = banners[current % totalSlides] || banners[0]
  const ArtIcon = ArtMap[slide.art] || Shield

  return (
    <div
      className="relative overflow-hidden rounded-2xl mb-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ minHeight: 220 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${division.id}-${current}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`p-7 sm:p-8`}
          style={{ 
            background: slide.tint && slide.tint.startsWith('#')
              ? `linear-gradient(135deg, ${slide.tint} 0%, #031024 100%)`
              : `linear-gradient(135deg, var(--brand-ink) 0%, var(--brand-deep) 100%)` 
          }}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <p className="eyebrow-dark mb-2">{slide.eyebrow}</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{slide.title}</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{slide.body}</p>
              <div
                className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}
              >
                ✓ {slide.stat}
              </div>
            </div>
            <div
              className="hidden sm:flex items-center justify-center flex-shrink-0"
              style={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <ArtIcon size={36} strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls (shown if more than 1 slide) */}
      {totalSlides > 1 && (
        <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={prev} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={14} />
          </button>
          <div style={{ display: 'flex', gap: 5 }}>
            {banners.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, background: i === current ? '#fff' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
            ))}
          </div>
          <button onClick={next} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.1)' }}>
        {!paused && (
          <motion.div
            key={progressKey}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
            style={{ height: '100%', background: 'var(--brand-accent)' }}
          />
        )}
      </div>
    </div>
  )
}
