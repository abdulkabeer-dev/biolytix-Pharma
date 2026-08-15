import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Pill, 
  Layers, 
  Sliders, 
  Building2, 
  Mail, 
  ExternalLink, 
  LogOut, 
  Radio, 
  ShieldCheck,
  Menu,
  X,
  Plus
} from 'lucide-react'
import BrandLogo from '../../components/site/BrandLogo'
import { useDataContext } from '../../context/DataContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products Catalogue', icon: Pill },
  { to: '/admin/divisions', label: 'Therapeutic Divisions', icon: Layers },
  { to: '/admin/slides', label: 'Hero Section Slider', icon: Sliders },
  { to: '/admin/company', label: 'Company Profile', icon: Building2 },
  { to: '/admin/inquiries', label: 'Inquiries & Leads', icon: Mail },
]

export default function AdminLayout() {
  const { isConnected, medicines, inquiries, lastUpdated } = useDataContext()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    sessionStorage.removeItem('biolytix_admin_auth')
    navigate('/admin/login')
  }

  const unreadInquiries = inquiries.filter(i => !i.read).length

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased font-sans">
      {/* ── Mobile Header ────────────────────────────────────────────────── */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <BrandLogo dark size="sm" />
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'
          }`}>
            <Radio size={10} className={isConnected ? 'animate-pulse text-emerald-400' : ''} />
            {isConnected ? 'Live' : 'Offline'}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Backdrop Overlay ───────────────────────────────────────── */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* ── Sidebar (Sticky & Scrollable on desktop & mobile) ─────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between
        overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 flex-shrink-0
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex flex-col">
              <BrandLogo dark size="md" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mt-2 flex items-center gap-1.5">
                <ShieldCheck size={12} /> Management Portal
              </span>
            </div>
            {mobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Sync Status Banner */}
          <div className="mx-4 my-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-200">
                  {isConnected ? 'Real-Time Sync Active' : 'Disconnected'}
                </span>
                <span className="text-[9px] text-slate-400">Multi-browser live stream</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
              SSE
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5 mt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30 font-bold' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className="group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </div>
                  {item.to === '/admin/products' && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                      {medicines.length}
                    </span>
                  )}
                  {item.to === '/admin/inquiries' && unreadInquiries > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500 text-slate-950 animate-pulse">
                      {unreadInquiries}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800/80 space-y-2 mt-auto">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/40 transition-colors"
          >
            <ExternalLink size={14} />
            <span>Open Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Top Navbar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-slate-900/50 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-white tracking-wide">
              Biolytix Administration Control Center
            </h1>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-400">
              Last saved: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Up to date'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/products"
              className="btn text-xs px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold inline-flex items-center gap-1.5 shadow-md shadow-cyan-900/20"
            >
              <Plus size={14} /> Add Product
            </Link>
          </div>
        </div>

        {/* Dynamic Route Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
