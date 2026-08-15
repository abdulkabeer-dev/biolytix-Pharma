import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

const variants: Variants = {
  hidden: (d: string) => ({
    opacity: 0,
    y: d === 'up' ? 24 : 0,
    x: d === 'left' ? -24 : d === 'right' ? 24 : 0,
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Reveal({ children, delay = 0, direction = 'up', className }: RevealProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
