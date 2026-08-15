import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BrandLogo from './BrandLogo'
import { ShieldCheck, Sparkles } from 'lucide-react'

export default function PageLoader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Initializing Formulations...')

  useEffect(() => {
    // Smooth progress count-up
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const step = prev < 50 ? 12 : prev < 85 ? 8 : 5
        const next = Math.min(prev + step, 100)
        
        if (next > 30 && next <= 70) {
          setStatusText('Verifying WHO-GMP Standards...')
        } else if (next > 70) {
          setStatusText('Sustain Life Through Quality & Service')
        }
        
        return next
      })
    }, 45)

    const finishTimer = setTimeout(() => {
      setLoading(false)
    }, 950)

    return () => {
      clearInterval(interval)
      clearTimeout(finishTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.45, ease: 'easeInOut' } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'radial-gradient(ellipse at center, #0e2a47 0%, #061524 70%, #030a12 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Glowing Halo in Background */}
          <div
            style={{
              position: 'absolute',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 180, 216, 0.18) 0%, rgba(26, 127, 193, 0.05) 50%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          {/* Central Glassmorphic Loader Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative flex flex-col items-center max-w-sm w-full p-8 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(0, 180, 216, 0.2)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Top WHO-GMP Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-semibold tracking-wider uppercase">
              <ShieldCheck size={13} className="text-cyan-400" />
              <span>WHO-GMP Certified</span>
            </div>

            {/* Glowing Logo Container with Balanced Frame */}
            <div className="relative flex items-center justify-center w-full my-4 py-4 px-6 rounded-2xl bg-cyan-950/20 border border-cyan-400/20 shadow-inner">
              {/* Outer Subtle Pulse Glow */}
              <div
                className="absolute inset-0 rounded-2xl border border-cyan-400/30 pointer-events-none animate-pulse"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0, 180, 216, 0.25))' }}
              />
              
              <BrandLogo dark size="lg" align="center" className="mx-auto" />
            </div>

            {/* Progress Bar Container */}
            <div className="w-full mt-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                  <Sparkles size={11} className="text-cyan-400" />
                  {statusText}
                </span>
                <span className="font-mono text-cyan-400 font-bold text-xs">{progress}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden p-[1px] border border-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #1a7fc1 0%, #00b4d8 50%, #38bdf8 100%)',
                    boxShadow: '0 0 12px rgba(0, 180, 216, 0.8)',
                    transition: 'width 0.1s ease-out',
                  }}
                />
              </div>
            </div>

            {/* Bottom Motto */}
            <p className="mt-5 text-[11px] text-slate-500 text-center font-medium tracking-wide">
              Pharmaceutical Excellence & Pan-India Distribution
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
