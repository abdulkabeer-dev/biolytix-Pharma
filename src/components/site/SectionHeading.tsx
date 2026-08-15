import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  dark?: boolean
  center?: boolean
  children?: ReactNode
}

export default function SectionHeading({ eyebrow, title, description, dark, center = true, children }: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className={dark ? 'eyebrow-dark mb-2' : 'eyebrow mb-2'}>{eyebrow}</p>
      )}
      <h2
        className="text-3xl sm:text-4xl font-bold leading-tight"
        style={{ color: dark ? '#fff' : 'var(--brand-ink)' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="mt-4 text-base max-w-2xl leading-relaxed"
          style={{
            color: dark ? 'rgba(255,255,255,.7)' : 'var(--text-muted)',
            margin: center ? '1rem auto 0' : '1rem 0 0',
          }}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
