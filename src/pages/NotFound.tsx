import { Link } from 'react-router-dom'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="text-8xl font-extrabold mb-4" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
      <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--brand-ink)' }}>Page Not Found</h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3">
        <Link to="/" className="btn btn-primary"><Home size={14} /> Back to Home</Link>
        <Link to="/products" className="btn btn-outline">Browse Products <ArrowRight size={14} /></Link>
      </div>
    </div>
  )
}
