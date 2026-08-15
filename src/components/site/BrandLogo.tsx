interface BrandLogoProps {
  dark?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'center'
}

// Height sizes for the logo image
const heights = { sm: 32, md: 42, lg: 54 }

export default function BrandLogo({ dark = false, className = '', size = 'md', align = 'left' }: BrandLogoProps) {
  const h = heights[size]
  const isCenter = align === 'center'

  const justifyClass = isCenter ? 'justify-center' : 'justify-start'

  if (dark) {
    // Dark variant: white-filtered logo on dark backgrounds
    return (
      <div className={`flex items-center ${justifyClass} ${className}`}>
        {isCenter ? (
          <svg height={h} viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
            {/* Swoosh waves */}
            <path d="M25 58 Q65 48 110 53 Q155 58 195 50" stroke="rgba(0, 180, 216, 0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M20 63 Q60 54 105 59 Q150 64 190 56" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* Centered Wordmark */}
            <text x="110" y="46" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="48" fontWeight="bold" fontStyle="italic" fill="white" opacity="0.95">Biolytix</text>
            {/* Centered Subtitle */}
            <text x="110" y="74" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="600" letterSpacing="3.5" fill="rgba(255,255,255,0.75)">PHARMACEUTICALS</text>
          </svg>
        ) : (
          <svg height={h} viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
            {/* Swoosh waves */}
            <path d="M4 58 Q42 48 88 53 Q132 58 175 50" stroke="rgba(0, 180, 216, 0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M2 63 Q40 54 86 59 Q130 64 170 56" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* Left Wordmark */}
            <text x="2" y="46" textAnchor="start" fontFamily="Georgia, 'Times New Roman', serif" fontSize="48" fontWeight="bold" fontStyle="italic" fill="white" opacity="0.95">Biolytix</text>
            {/* Left Subtitle */}
            <text x="4" y="74" textAnchor="start" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="600" letterSpacing="3.2" fill="rgba(255,255,255,0.75)">PHARMACEUTICALS</text>
          </svg>
        )}
      </div>
    )
  }

  // Light variant: brand blue logo
  return (
    <div className={`flex items-center ${justifyClass} ${className}`}>
      {isCenter ? (
        <svg height={h} viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
          {/* Swoosh waves */}
          <path d="M25 58 Q65 48 110 53 Q155 58 195 50" stroke="#3daee9" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M20 63 Q60 54 105 59 Q150 64 190 56" stroke="#00b4d8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Centered Wordmark */}
          <text x="110" y="46" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="48" fontWeight="bold" fontStyle="italic" fill="#1a7fc1">Biolytix</text>
          {/* Centered Subtitle */}
          <text x="110" y="74" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="600" letterSpacing="3.5" fill="#0a4f82">PHARMACEUTICALS</text>
        </svg>
      ) : (
        <svg height={h} viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
          {/* Swoosh waves */}
          <path d="M4 58 Q42 48 88 53 Q132 58 175 50" stroke="#3daee9" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M2 63 Q40 54 86 59 Q130 64 170 56" stroke="#00b4d8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Left Wordmark */}
          <text x="2" y="46" textAnchor="start" fontFamily="Georgia, 'Times New Roman', serif" fontSize="48" fontWeight="bold" fontStyle="italic" fill="#1a7fc1">Biolytix</text>
          {/* Left Subtitle */}
          <text x="4" y="74" textAnchor="start" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="600" letterSpacing="3.2" fill="#0a4f82">PHARMACEUTICALS</text>
        </svg>
      )}
    </div>
  )
}
