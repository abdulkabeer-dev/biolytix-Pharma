import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

interface StatCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  label: string
  sublabel?: string
  icon?: ReactNode
}

export default function StatCounter({ end, suffix = '', prefix = '', duration = 2, label, sublabel, icon }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 })

  useEffect(() => {
    if (inView) motionVal.set(end)
  }, [inView, end, motionVal])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = prefix + Math.round(v).toLocaleString() + suffix
    })
  }, [spring, prefix, suffix])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="text-center group cursor-default flex flex-col items-center"
    >
      {/* Icon badge above counter */}
      {icon && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, var(--brand-muted) 0%, #e0f2fe 100%)',
            border: '1px solid rgba(26,127,193,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand)',
            marginBottom: 12,
            transition: 'all 0.25s ease',
          }}
          className="group-hover:scale-110 group-hover:border-[var(--brand)] shadow-sm"
        >
          {icon}
        </div>
      )}

      <div className="flex items-end justify-center gap-1">
        <span ref={ref} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand tracking-tight">
          {prefix}0{suffix}
        </span>
      </div>
      <p className="mt-1.5 text-xs sm:text-sm font-bold text-gray-800 tracking-wide">{label}</p>
      {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
    </motion.div>
  )
}
