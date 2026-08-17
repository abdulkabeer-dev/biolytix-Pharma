import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  ShieldPlus, Thermometer, FlaskConical, Wind, Leaf, HeartPulse, Sparkles, Eye, 
  Plus, Search, X, Activity, Zap, Pill, Syringe, Bandage, Shield, Baby, Brain
} from 'lucide-react'
import PageHero from '../components/site/PageHero'
import DivisionBanner from '../components/site/DivisionBanner'
import FormArt from '../components/site/FormArt'
import Reveal from '../components/site/Reveal'
import { useDataContext } from '../context/DataContext'
import type { Division, Medicine } from '../data/products'

const DIVISION_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>> = {
  ShieldPlus, Thermometer, FlaskConical, Wind, Leaf, HeartPulse, Sparkles, Eye,
  Activity, Zap, Pill, Syringe, Bandage, Shield, Baby, Brain
}

// Accent colors per division order
const DIV_COLORS = [
  '#22c55e', '#f97316', '#0284c7', '#8b5cf6', '#10b981', '#1a7fc1',
  '#ec4899', '#f43f5e', '#a855f7', '#06b6d4', '#e11d48',
]

export default function Products() {
  const { divisions, medicines } = useDataContext()
  const [params, setParams] = useSearchParams()
  const [activeDivId, setActiveDivId] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedForm, setSelectedForm] = useState<string>('All')

  function getDivisionColor(divisionId: string) {
    const div = divisions.find(d => d.id === divisionId)
    if (div?.accentColor) return div.accentColor
    const idx = divisions.findIndex(d => d.id === divisionId)
    return DIV_COLORS[idx % DIV_COLORS.length] ?? 'var(--brand)'
  }

  const medicinesByDivision = (divId: string) => medicines.filter(m => m.divisionId === divId)

  useEffect(() => {
    const d = params.get('division')
    if (d && (d === 'all' || divisions.find(div => div.id === d))) {
      setActiveDivId(d)
    }
  }, [params, divisions])

  const activeDivision: Division = divisions.find(d => d.id === activeDivId) ?? divisions[0] ?? {
    id: 'all',
    name: 'All Formulations',
    shortLabel: 'All',
    icon: 'ShieldPlus',
  }
  const divColor = activeDivId === 'all' ? 'var(--brand)' : getDivisionColor(activeDivId)

  // Filtered medicines
  const filteredMeds = useMemo(() => {
    let list: Medicine[] = activeDivId === 'all' ? medicines : medicinesByDivision(activeDivId)
    
    if (selectedForm !== 'All') {
      list = list.filter(m => m.form.toLowerCase() === selectedForm.toLowerCase())
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.composition.toLowerCase().includes(q) ||
        m.indication.toLowerCase().includes(q) ||
        (m.ingredients && m.ingredients.some(ing => ing.name.toLowerCase().includes(q)))
      )
    }
    return list
  }, [activeDivId, selectedForm, searchQuery, medicines])

  // Available dosage forms in the current list
  const availableForms = useMemo(() => {
    const base = activeDivId === 'all' ? medicines : medicinesByDivision(activeDivId)
    const set = new Set<string>()
    base.forEach(m => set.add(m.form))
    return ['All', ...Array.from(set)]
  }, [activeDivId, medicines])

  const selectDivision = (id: string) => {
    setActiveDivId(id)
    setSelectedForm('All')
    setParams({ division: id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <PageHero
        eyebrow="Product Portfolio"
        title="Dependable Medicines Across Every Therapy Area."
        description={`${divisions.length} therapeutic divisions · ${medicines.length}+ formulations · WHO-GMP certified manufacturing`}
        breadcrumbs={[{ label: 'Products' }]}
        bgImage="/images/heroes/products.jpg"
      />

      <section style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Sidebar ────────────────────────────────────────────────── */}
            <aside className="lg:w-72 flex-shrink-0">
              {/* Mobile: Horizontal Swipeable Pills Filter */}
              <div className="lg:hidden mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
                  Therapeutic Categories
                </p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-4 sm:mx-0 px-4 sm:px-0">
                  <button
                    onClick={() => selectDivision('all')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex-shrink-0 shadow-sm ${
                      activeDivId === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-cyan-600/20'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldPlus size={15} />
                    <span>All ({medicines.length})</span>
                  </button>

                  {divisions.map((div, i) => {
                    const Icon = DIVISION_ICONS[div.icon] || ShieldPlus
                    const isActive = div.id === activeDivId
                    const count = medicinesByDivision(div.id).length
                    const color = DIV_COLORS[i % DIV_COLORS.length]
                    return (
                      <button
                        key={div.id}
                        onClick={() => selectDivision(div.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex-shrink-0 shadow-sm ${
                          isActive
                            ? 'bg-slate-900 text-white font-bold border border-slate-700 shadow-md'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon size={15} style={{ color: isActive ? color : undefined }} />
                        <span>{div.shortLabel}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Desktop: Sticky Scrollable Sidebar */}
              <div
                className="hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar bg-white border border-slate-200 rounded-2xl shadow-sm"
              >
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', background: 'var(--brand-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--brand)' }}>Therapeutic Divisions</p>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)' }}>{medicines.length} Products</span>
                </div>

                {/* All products button */}
                <button
                  onClick={() => selectDivision('all')}
                  className="division-item w-full text-left"
                  style={{
                    background: activeDivId === 'all' ? 'var(--brand-muted)' : 'transparent',
                    borderColor: activeDivId === 'all' ? 'var(--brand)' : 'transparent',
                    margin: '6px 8px 2px 8px',
                    width: 'calc(100% - 16px)',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: activeDivId === 'all' ? 'var(--brand)' : 'rgba(26,127,193,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeDivId === 'all' ? '#fff' : 'var(--brand)', flexShrink: 0 }}>
                    <ShieldPlus size={16} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 600, color: activeDivId === 'all' ? 'var(--brand)' : 'var(--text)', lineHeight: 1.3 }}>All Formulations</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: activeDivId === 'all' ? 'var(--brand)' : 'var(--text-muted)', background: activeDivId === 'all' ? 'rgba(26,127,193,.12)' : '#f1f5f9', borderRadius: 6, padding: '2px 6px' }}>{medicines.length}</span>
                </button>

                <div style={{ margin: '4px 12px', borderTop: '1px solid #f1f5f9' }} />

                {divisions.map((div, i) => {
                  const Icon = DIVISION_ICONS[div.icon] || ShieldPlus
                  const color = DIV_COLORS[i % DIV_COLORS.length]
                  const isActive = div.id === activeDivId
                  const itemCount = medicinesByDivision(div.id).length
                  return (
                    <button
                      key={div.id}
                      onClick={() => selectDivision(div.id)}
                      className="division-item w-full text-left"
                      style={{
                        background: isActive ? 'var(--brand-muted)' : 'transparent',
                        borderColor: isActive ? 'var(--brand)' : 'transparent',
                        margin: '3px 8px',
                        width: 'calc(100% - 16px)',
                      }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: isActive ? 'var(--brand)' : `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#fff' : color, flexShrink: 0 }}>
                        <Icon size={16} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 13, fontWeight: 600, color: isActive ? 'var(--brand)' : 'var(--text)', lineHeight: 1.3 }}>{div.name}</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? 'var(--brand)' : 'var(--text-muted)', background: isActive ? 'rgba(26,127,193,.12)' : '#f1f5f9', borderRadius: 6, padding: '2px 6px' }}>{itemCount}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            {/* ── Main content ───────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Division header strip */}
              {activeDivId !== 'all' ? (
                <>
                  <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl" style={{ background: 'var(--brand-muted)', border: '1px solid rgba(26,127,193,.15)' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: divColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                      {(() => { const Icon = DIVISION_ICONS[activeDivision.icon] || ShieldPlus; return <Icon size={24} strokeWidth={1.8} /> })()}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold" style={{ color: 'var(--brand-ink)' }}>{activeDivision.name}</h2>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{filteredMeds.length} active formulations · {activeDivision.shortLabel}</p>
                    </div>
                    <span className="cert-chip" style={{ background: 'rgba(26,127,193,.1)', border: '1px solid rgba(26,127,193,.2)', color: 'var(--brand)' }}>WHO-GMP</span>
                  </div>
                  {/* Banner carousel */}
                  <DivisionBanner division={activeDivision} />
                </>
              ) : (
                <div className="flex items-center gap-4 mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-cyan-900 text-white shadow-md">
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <ShieldPlus size={26} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">Full Product Catalogue</h2>
                    <p className="text-xs text-blue-100/80">Showing {filteredMeds.length} approved pharmaceutical formulations across all divisions</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/15 border border-white/20">All Categories</span>
                </div>
              )}

              {/* Search & Filter Bar */}
              <div className="mb-6 space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by brand name, ingredient (e.g. Aceclofenac, D3, Telmisartan), or indication..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand transition-all shadow-sm"
                    style={{ background: '#f8fafc' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Dosage form pills */}
                {availableForms.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
                    <span className="font-semibold text-slate-400 whitespace-nowrap pl-1">Dosage Form:</span>
                    {availableForms.map((form) => {
                      const isSelected = selectedForm === form
                      return (
                        <button
                          key={form}
                          onClick={() => setSelectedForm(form)}
                          className="px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap"
                          style={{
                            background: isSelected ? 'var(--brand)' : '#f1f5f9',
                            color: isSelected ? '#fff' : '#475569',
                            border: `1px solid ${isSelected ? 'var(--brand)' : '#e2e8f0'}`,
                          }}
                        >
                          {form}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Medicine list */}
              {filteredMeds.length > 0 ? (
                <div className="space-y-3">
                  {filteredMeds.map((med, i) => {
                    const itemDiv = divisions.find(d => d.id === med.divisionId)
                    const itemColor = itemDiv ? getDivisionColor(itemDiv.id) : 'var(--brand)'
                    return (
                      <Reveal key={med.id} delay={Math.min(i * 0.03, 0.3)}>
                        <div
                          className="card flex flex-col sm:flex-row gap-4 sm:gap-5 p-5 group hover:shadow-md transition-all border border-slate-100"
                          style={{ transition: 'all .2s' }}
                        >
                          {/* Form art tile */}
                          <div
                            style={{
                              width: 64, height: 64, borderRadius: 14, flexShrink: 0,
                              background: `${itemColor}12`,
                              border: `1px solid ${itemColor}25`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <FormArt form={med.form} color={itemColor} size={40} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-2 mb-1.5">
                              <h3 className="text-base font-bold" style={{ color: 'var(--brand-ink)' }}>{med.name}</h3>
                              <span className="badge-rx">Rx</span>
                              {med.isNew && <span className="badge-new">New</span>}
                              {activeDivId === 'all' && itemDiv && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${itemColor}15`, color: itemColor }}>
                                  {itemDiv.shortLabel}
                                </span>
                              )}
                            </div>

                            {/* Full Composition / Generic */}
                            <p className="text-xs font-semibold text-slate-700 mb-2 leading-relaxed">
                              {med.composition}
                            </p>

                            {/* Indication */}
                            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                              <span style={{ fontWeight: 600, color: 'var(--brand)' }}>Indication:</span> {med.indication}
                            </p>

                            {/* Spec row */}
                            <div className="flex flex-wrap items-center gap-3 text-xs pt-2 border-t border-slate-100" style={{ color: 'var(--text-muted)' }}>
                              <span><span className="font-semibold" style={{ color: 'var(--text)' }}>Form:</span> {med.form}</span>
                              <span>·</span>
                              <span><span className="font-semibold" style={{ color: 'var(--text)' }}>Pack:</span> {med.pack}</span>
                              <span>·</span>
                              <span className="text-emerald-600 font-semibold">✓ WHO-GMP Quality</span>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Search size={36} className="mx-auto text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-slate-700 mb-1">No formulations found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    We couldn't find any products matching "{searchQuery}". Try searching with a different chemical name, formulation, or switch category.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedForm('All'); setActiveDivId('all'); }}
                    className="btn btn-primary text-xs"
                  >
                    View All 73 Formulations
                  </button>
                </div>
              )}

              {/* CTA card */}
              <div className="mt-8 p-6 rounded-2xl text-center" style={{ background: 'var(--brand-muted)', border: '1px solid rgba(26,127,193,.15)' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--brand-ink)' }}>Looking for a specific formulation or distribution inquiry?</p>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Contact our commercial team for product dossiers, rate contracts, or franchise opportunities.</p>
                <Link to="/contact" className="btn btn-primary text-sm inline-flex items-center gap-2">
                  <Plus size={14} /> Request Product Details & Dossier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
