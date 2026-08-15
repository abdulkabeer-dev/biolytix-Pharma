// Dosage form SVG illustration component
// Picks the right illustration based on form string

interface FormArtProps {
  form: string
  color?: string
  size?: number
}

export default function FormArt({ form, color = '#1a7fc1', size = 60 }: FormArtProps) {
  const f = form.toLowerCase()

  if (f.includes('tablet') || f.includes('effervescent')) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <rect x="8" y="20" width="44" height="20" rx="10" fill={color} opacity=".15"/>
        <rect x="8" y="20" width="22" height="20" rx="10" fill={color} opacity=".35"/>
        <rect x="8" y="20" width="44" height="20" rx="10" stroke={color} strokeWidth="2"/>
        <line x1="30" y1="20" x2="30" y2="40" stroke={color} strokeWidth="1.5"/>
      </svg>
    )
  }

  if (f.includes('capsule')) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <ellipse cx="22" cy="30" rx="12" ry="7" fill={color} opacity=".5"/>
        <ellipse cx="38" cy="30" rx="12" ry="7" fill={color} opacity=".15"/>
        <rect x="22" y="23" width="16" height="14" fill={color} opacity=".2"/>
        <ellipse cx="22" cy="30" rx="12" ry="7" stroke={color} strokeWidth="2"/>
        <ellipse cx="38" cy="30" rx="12" ry="7" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }

  if (f.includes('syrup') || f.includes('dry syrup') || f.includes('bottle')) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <rect x="22" y="10" width="16" height="6" rx="3" fill={color} opacity=".3"/>
        <path d="M18 20 Q14 24 14 28V48a4 4 0 004 4h20a4 4 0 004-4V28q0-4-4-8H18z" fill={color} opacity=".12"/>
        <path d="M18 20 Q14 24 14 28V48a4 4 0 004 4h20a4 4 0 004-4V28q0-4-4-8H18z" stroke={color} strokeWidth="2"/>
        <rect x="14" y="32" width="32" height="10" rx="2" fill={color} opacity=".2"/>
        <rect x="22" y="10" width="16" height="6" rx="3" stroke={color} strokeWidth="1.5"/>
      </svg>
    )
  }

  if (f.includes('gel') || f.includes('cream') || f.includes('ointment')) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <rect x="10" y="24" width="40" height="20" rx="6" fill={color} opacity=".12"/>
        <rect x="10" y="24" width="40" height="20" rx="6" stroke={color} strokeWidth="2"/>
        <ellipse cx="30" cy="22" rx="8" ry="4" fill={color} opacity=".3"/>
        <path d="M22 18 Q26 10 30 14 Q34 10 38 18" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <rect x="26" y="28" width="8" height="3" rx="1.5" fill={color} opacity=".5"/>
      </svg>
    )
  }

  if (f.includes('eye') || f.includes('ear') || f.includes('drop')) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <path d="M30 12 Q20 12 14 22 L14 42 Q14 46 18 46H42Q46 46 46 42L46 22 Q40 12 30 12Z" fill={color} opacity=".1"/>
        <path d="M30 12 Q20 12 14 22 L14 42 Q14 46 18 46H42Q46 46 46 42L46 22 Q40 12 30 12Z" stroke={color} strokeWidth="2"/>
        <circle cx="30" cy="12" r="4" fill={color} opacity=".4"/>
        <circle cx="30" cy="12" r="4" stroke={color} strokeWidth="1.5"/>
        <path d="M30 18 L30 22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }

  if (f.includes('shampoo')) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <path d="M20 14 Q16 18 16 24V48a4 4 0 004 4h16a4 4 0 004-4V24q0-6-4-10H20z" fill={color} opacity=".1"/>
        <path d="M20 14 Q16 18 16 24V48a4 4 0 004 4h16a4 4 0 004-4V24q0-6-4-10H20z" stroke={color} strokeWidth="2"/>
        <path d="M24 14 L24 8 Q24 6 28 6 L32 6 Q36 6 36 8 L36 14" stroke={color} strokeWidth="1.5" fill="none"/>
        <rect x="16" y="30" width="28" height="8" rx="2" fill={color} opacity=".2"/>
      </svg>
    )
  }

  if (f.includes('inject') || f.includes('vial') || f.includes('ampoule')) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <rect x="22" y="26" width="16" height="24" rx="3" fill={color} opacity=".15"/>
        <rect x="22" y="26" width="16" height="24" rx="3" stroke={color} strokeWidth="2"/>
        <rect x="26" y="16" width="8" height="10" rx="1" fill={color} opacity=".3"/>
        <rect x="26" y="16" width="8" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
        <line x1="30" y1="8" x2="30" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="24" y1="36" x2="36" y2="36" stroke={color} strokeWidth="1.5"/>
        <line x1="24" y1="42" x2="32" y2="42" stroke={color} strokeWidth="1.5"/>
      </svg>
    )
  }

  if (f.includes('shot') || f.includes('solution') || f.includes('oral solution')) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <path d="M22 18 L22 46 Q22 50 30 50 Q38 50 38 46 L38 18 Z" fill={color} opacity=".15"/>
        <path d="M22 18 L22 46 Q22 50 30 50 Q38 50 38 46 L38 18 Z" stroke={color} strokeWidth="2"/>
        <rect x="25" y="10" width="10" height="8" rx="2" fill={color} opacity=".3"/>
        <rect x="25" y="10" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5"/>
        <line x1="24" y1="32" x2="36" y2="32" stroke={color} strokeWidth="1.5"/>
        <line x1="24" y1="40" x2="36" y2="40" stroke={color} strokeWidth="1.5"/>
      </svg>
    )
  }

  // Default — generic pill
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="18" fill={color} opacity=".12"/>
      <circle cx="30" cy="30" r="18" stroke={color} strokeWidth="2"/>
      <line x1="15" y1="30" x2="45" y2="30" stroke={color} strokeWidth="1.5"/>
    </svg>
  )
}
