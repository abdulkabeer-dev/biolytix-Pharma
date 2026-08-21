import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { useDataContext } from '../../context/DataContext'
import { MapPin, Mail, Clock, Send } from 'lucide-react'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Certificates & Compliance', to: '/certificates' },
  { label: 'Products', to: '/products' },
  { label: 'Quality Policy', to: '/quality-policy' },
  { label: 'Contact Us', to: '/contact' },
]

export default function SiteFooter() {
  const { company, divisions } = useDataContext()
  return (
    <footer style={{ background: 'var(--brand-ink)', color: 'rgba(255,255,255,0.75)' }}>
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="flex flex-col items-start text-left">
          <BrandLogo dark size="md" align="left" />
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {company.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(company.certifications || []).map((c: string) => (
              <span key={c} className="cert-chip">{c}</span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Divisions */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">Our Divisions</h3>
          <ul className="space-y-2">
            {divisions.map(d => (
              <li key={d.id}>
                <Link
                  to={`/products?division=${d.id}`}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">Reach Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin size={15} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-light)' }} />
              <span style={{ color: 'rgba(255,255,255,0.65)' }}>{company.registeredOffice}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} style={{ color: 'var(--brand-light)' }} />
              <a href={`mailto:${company.email}`} className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>{company.email}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={15} style={{ color: 'var(--brand-light)' }} />
              <span style={{ color: 'rgba(255,255,255,0.65)' }}>{company.workingHours}</span>
            </li>
            <li className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-cyan-300 hover:bg-white/15 hover:text-white transition-all"
              >
                <Send size={12} /> Contact / Inquiry Form
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Powered by</span>
            <a
              href="https://www.firststepdigitalagency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-white font-semibold transition-colors"
            >
              FirstStep Digital Marketing Agency
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
