import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Phone, ChevronDown, Award, Building2 } from 'lucide-react'
import BrandLogo from './BrandLogo'
import { useDataContext } from '../../context/DataContext'

export default function SiteHeader() {
  const { company } = useDataContext()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { 
    setOpen(false)
    setAboutDropdownOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAboutDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const isAboutActive = location.pathname === '/about' || location.pathname === '/certificates' || location.pathname === '/about/certificates'

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top info bar */}
      <div
        className="hidden lg:block text-xs"
        style={{ background: 'var(--brand-ink)', color: 'rgba(255,255,255,.7)', padding: '6px 0' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span>📍 {company.registeredOffice.split(',')[0]}, Telangana, India</span>
            <span>✉ {company.email}</span>
            <span>🕐 {company.workingHours}</span>
          </div>
          <a href={`tel:${company.phone}`} className="flex items-center gap-1.5 font-semibold hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,.9)' }}>
            <Phone size={12} /> {company.phone}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav
        style={{
          background: scrolled ? 'rgba(255,255,255,0.96)' : '#fff',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,.08)' : '0 1px 0 #e2e8f0',
          transition: 'all .25s',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" aria-label="Biolytix home">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand bg-brand-muted font-bold'
                      : 'text-gray-600 hover:text-brand hover:bg-gray-50'
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            {/* About Us with Submenu Dropdown */}
            <li 
              ref={dropdownRef} 
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1 cursor-pointer ${
                  isAboutActive
                    ? 'text-brand bg-brand-muted font-bold'
                    : 'text-gray-600 hover:text-brand hover:bg-gray-50'
                }`}
              >
                <span>About Us</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Panel */}
              <AnimatePresence>
                {aboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 overflow-hidden"
                  >
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        `flex items-start gap-3 p-3 rounded-xl transition-colors ${
                          isActive && location.pathname === '/about'
                            ? 'bg-blue-50 text-brand'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-brand'
                        }`
                      }
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">About Biolytix</p>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">Our mission, journey & therapy portfolio</p>
                      </div>
                    </NavLink>

                    <NavLink
                      to="/certificates"
                      className={({ isActive }) =>
                        `flex items-start gap-3 p-3 rounded-xl transition-colors mt-1 ${
                          isActive
                            ? 'bg-blue-50 text-brand'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-brand'
                        }`
                      }
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                          <span>Certificates</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500 text-white">ISO & GDP</span>
                        </p>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">Verified regulatory accreditation documents</p>
                      </div>
                    </NavLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand bg-brand-muted font-bold'
                      : 'text-gray-600 hover:text-brand hover:bg-gray-50'
                  }`
                }
              >
                Products
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/quality-policy"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand bg-brand-muted font-bold'
                      : 'text-gray-600 hover:text-brand hover:bg-gray-50'
                  }`
                }
              >
                Quality Policy
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand bg-brand-muted font-bold'
                      : 'text-gray-600 hover:text-brand hover:bg-gray-50'
                  }`
                }
              >
                Contact Us
              </NavLink>
            </li>
          </ul>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link to="/contact" className="btn btn-primary hidden sm:inline-flex text-xs py-2 px-4">
              Partner With Us
            </Link>
            <button
              className="md:hidden p-2 rounded-lg cursor-pointer"
              style={{ color: 'var(--brand)' }}
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="custom-scrollbar"
            style={{
              position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0,
              background: '#fff', zIndex: 99, overflowY: 'auto',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive ? 'text-brand bg-brand-muted font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                Home
              </NavLink>

              {/* About Us Submenu Group on Mobile */}
              <div className="rounded-2xl bg-slate-50 p-2 space-y-1 border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-1 block">
                  About Biolytix
                </span>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive && location.pathname === '/about' ? 'text-brand bg-white font-bold shadow-sm' : 'text-gray-700 hover:bg-white/60'
                    }`
                  }
                >
                  <Building2 size={16} className="text-brand" />
                  <span>About Us Overview</span>
                </NavLink>

                <NavLink
                  to="/certificates"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'text-brand bg-white font-bold shadow-sm' : 'text-gray-700 hover:bg-white/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Award size={16} className="text-emerald-600" />
                    <span>Certificates & Compliance</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ISO & GDP
                  </span>
                </NavLink>
              </div>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive ? 'text-brand bg-brand-muted font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                Products Catalogue
              </NavLink>

              <NavLink
                to="/quality-policy"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive ? 'text-brand bg-brand-muted font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                Quality Policy
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive ? 'text-brand bg-brand-muted font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                Contact Us
              </NavLink>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e2e8f0' }}>
                <Link to="/contact" className="btn btn-primary w-full justify-center">
                  Partner With Us
                </Link>
                <a
                  href={`tel:${company.phone}`}
                  className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600"
                >
                  <Phone size={14} /> {company.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
