import { Link } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'

interface Crumb { label: string; to?: string }

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  bgImage?: string
}

export default function PageHero({ eyebrow, title, description, breadcrumbs, bgImage }: PageHeroProps) {
  const hasBg = Boolean(bgImage)

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24"
      style={{
        background: hasBg
          ? '#081a2e'
          : 'linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 40%, #e0f2fe 100%)',
      }}
    >
      {/* Background Image & Multi-layer Overlay */}
      {hasBg && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bgImage}
            alt="Hero Background"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90"
            style={{
              transition: 'transform 8s ease-out',
            }}
          />
          {/* Deep Navy/Cyan High-Contrast Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(6, 21, 36, 0.96) 0%, rgba(6, 21, 36, 0.88) 45%, rgba(6, 21, 36, 0.65) 100%)',
            }}
          />
          {/* Bottom subtle fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(6, 21, 36, 0.5), transparent)',
            }}
          />
        </div>
      )}

      {/* Decorative ambient radial lighting */}
      {!hasBg && (
        <>
          <div
            style={{
              position: 'absolute', right: '-80px', top: '-80px',
              width: '360px', height: '360px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(26,127,193,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute', left: '-60px', bottom: '-60px',
              width: '280px', height: '280px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,180,216,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        {breadcrumbs && (
          <nav
            className="flex items-center gap-1.5 mb-4 text-xs font-medium"
            style={{ color: hasBg ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-muted)' }}
          >
            <Link
              to="/"
              className={`flex items-center gap-1 transition-colors ${
                hasBg ? 'hover:text-cyan-300 text-white/80' : 'hover:text-brand'
              }`}
            >
              <Home size={12} /> Home
            </Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight size={12} className={hasBg ? 'text-white/40' : 'text-slate-400'} />
                {b.to ? (
                  <Link
                    to={b.to}
                    className={`transition-colors ${
                      hasBg ? 'hover:text-cyan-300 text-white/80' : 'hover:text-brand'
                    }`}
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span style={{ color: hasBg ? '#38bdf8' : 'var(--brand)', fontWeight: 600 }}>{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Eyebrow badge */}
        {eyebrow && (
          <div className="mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
              style={{
                background: hasBg ? 'rgba(0, 180, 216, 0.18)' : 'var(--brand-muted)',
                color: hasBg ? '#38bdf8' : 'var(--brand)',
                border: hasBg ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(26,127,193,0.2)',
                backdropFilter: hasBg ? 'blur(8px)' : 'none',
              }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight max-w-3xl"
          style={{
            color: hasBg ? '#ffffff' : 'var(--brand-ink)',
            textShadow: hasBg ? '0 2px 20px rgba(0,0,0,0.4)' : 'none',
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            className="mt-4 text-base sm:text-lg max-w-2xl leading-relaxed"
            style={{
              color: hasBg ? 'rgba(255, 255, 255, 0.85)' : 'var(--text-muted)',
            }}
          >
            {description}
          </p>
        )}

        {/* Decorative line */}
        <div
          className="mt-6 h-1 w-20 rounded-full"
          style={{
            background: hasBg
              ? 'linear-gradient(90deg, #38bdf8, #00b4d8)'
              : 'linear-gradient(90deg, var(--brand), var(--brand-accent))',
            boxShadow: hasBg ? '0 0 12px rgba(56, 189, 248, 0.6)' : 'none',
          }}
        />
      </div>
    </section>
  )
}
