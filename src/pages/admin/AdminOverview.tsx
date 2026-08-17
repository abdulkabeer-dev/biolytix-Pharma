import { Link } from 'react-router-dom'
import { 
  Pill, 
  Layers, 
  Sliders, 
  Mail, 
  Plus, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { useDataContext } from '../../context/DataContext'

export default function AdminOverview() {
  const { medicines, divisions, slides, inquiries, auditLog } = useDataContext()

  const unreadInquiries = inquiries.filter(i => !i.read).length

  // Stats calculation
  const stats = [
    {
      label: 'Total Formulations',
      value: medicines.length,
      sub: 'Across all dosage forms',
      icon: Pill,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.25)',
      to: '/admin/products',
    },
    {
      label: 'Therapeutic Divisions',
      value: divisions.length,
      sub: 'Active medical categories',
      icon: Layers,
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.12)',
      border: 'rgba(168, 85, 247, 0.25)',
      to: '/admin/divisions',
    },
    {
      label: 'Hero Carousel Slides',
      value: slides.length,
      sub: 'Live rotating showcases',
      icon: Sliders,
      color: '#00e5ff',
      bg: 'rgba(0, 229, 255, 0.12)',
      border: 'rgba(0, 229, 255, 0.25)',
      to: '/admin/slides',
    },
    {
      label: 'Commercial Inquiries',
      value: inquiries.length,
      sub: `${unreadInquiries} unread leads`,
      icon: Mail,
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.12)',
      border: 'rgba(52, 211, 153, 0.25)',
      to: '/admin/inquiries',
    },
  ]

  // Count formulations per division
  const divisionCounts = divisions.map(d => ({
    name: d.name,
    shortLabel: d.shortLabel,
    count: medicines.filter(m => m.divisionId === d.id).length,
    id: d.id,
  })).sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Real-Time Pharma Management Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Dynamic Catalogue & Content Administration
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage all {medicines.length} pharmaceutical formulations across {divisions.length} therapeutic divisions, homepage hero banners, and customer inquiries with instantaneous multi-browser synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/products"
              className="btn px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Plus size={15} /> Add Formulation
            </Link>
            <Link
              to="/admin/products"
              className="btn px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 inline-flex items-center gap-2"
            >
              <ArrowRight size={15} /> Reorder Between Divisions
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Link
              key={i}
              to={stat.to}
              className="p-6 rounded-2xl bg-slate-900/60 border hover:border-slate-700 transition-all group flex flex-col justify-between"
              style={{ borderColor: stat.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: stat.bg, color: stat.color }}
                >
                  <Icon size={22} />
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
              </div>

              <div>
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </span>
                <h4 className="text-xs font-bold text-slate-300 mt-1">{stat.label}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Two-Column Breakdown: Division Distribution + Live Activity Log ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Division Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-purple-400" />
                <h3 className="text-sm font-bold text-white">Formulations by Therapeutic Division</h3>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin/products" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
                  Reorder Formulations <ArrowRight size={12} />
                </Link>
                <Link to="/admin/divisions" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold">
                  Divisions <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div className="space-y-3.5">
              {divisionCounts.map((d) => {
                const percentage = Math.round((d.count / (medicines.length || 1)) * 100)
                return (
                  <div key={d.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{d.name}</span>
                      <span className="text-cyan-400 font-mono font-bold">{d.count} products ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>WHO-GMP Quality Compliance</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={13} /> 100% Formulation Tested
            </span>
          </div>
        </div>

        {/* Right: Live Audit & Activity Stream */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live Activity & Audit Stream</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Real-Time
              </span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {auditLog && auditLog.length > 0 ? (
                auditLog.slice(0, 7).map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        log.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        log.action === 'UPDATE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        log.action === 'DELETE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {log.action} {log.entity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed font-medium">
                      {log.summary}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No recent activities recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              All modifications are persisted to <code className="text-cyan-400">data/live_db.json</code>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
