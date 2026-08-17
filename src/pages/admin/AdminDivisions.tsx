import { useState } from 'react'
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Sliders
} from 'lucide-react'
import { useDataContext } from '../../context/DataContext'
import { type Division, type DivisionBannerSlide } from '../../data/products'
import AdminModal from '../../components/admin/AdminModal'
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog'

const ICON_OPTIONS = [
  'ShieldPlus',
  'HeartPulse',
  'Activity',
  'Pill',
  'FlaskConical',
  'Sparkles',
  'Eye',
  'Zap',
  'Shield',
  'Thermometer',
  'Leaf',
  'Wind',
  'Baby',
  'Brain',
  'Syringe',
  'Bandage',
]

const ART_OPTIONS: DivisionBannerSlide['art'][] = [
  'shield', 'thermo', 'flask', 'wind', 'leaf', 'heart', 'tube', 'eye', 'sparkles'
]

export default function AdminDivisions() {
  const { divisions, medicines, addDivision, updateDivision, deleteDivision } = useDataContext()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingDiv, setEditingDiv] = useState<Division | null>(null)
  const [divToDelete, setDivToDelete] = useState<Division | null>(null)

  const [formData, setFormData] = useState<{
    id: string
    name: string
    shortLabel: string
    icon: string
    description: string
    tagline: string
    accentColor: string
    stat: string
    theme: string
    banners: DivisionBannerSlide[]
  }>({
    id: '',
    name: '',
    shortLabel: '',
    icon: 'Pill',
    description: '',
    tagline: '',
    accentColor: '#00b4d8',
    stat: '10+ Products',
    theme: 'from-blue-950 to-slate-900',
    banners: [
      {
        eyebrow: 'Precision Formulations',
        title: 'Clinical Excellence & Purity',
        body: 'Specialized pharmaceuticals crafted to the highest global standards.',
        stat: '100% Quality Assured',
        art: 'shield',
        tint: 'rgba(0, 180, 216, 0.12)'
      }
    ]
  })

  const handleOpenAdd = () => {
    setEditingDiv(null)
    setFormData({
      id: '',
      name: '',
      shortLabel: '',
      icon: 'Pill',
      description: '',
      tagline: '',
      accentColor: '#00b4d8',
      stat: '10+ Products',
      theme: 'from-blue-950 to-slate-900',
      banners: [
        {
          eyebrow: 'Precision Formulations',
          title: 'Clinical Excellence & Purity',
          body: 'Specialized pharmaceuticals crafted to the highest global standards.',
          stat: '100% Quality Assured',
          art: 'shield',
          tint: 'rgba(0, 180, 216, 0.12)'
        }
      ]
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (div: Division) => {
    setEditingDiv(div)
    setFormData({
      id: div.id,
      name: div.name,
      shortLabel: div.shortLabel,
      icon: div.icon,
      description: div.description || '',
      tagline: div.tagline || '',
      accentColor: div.accentColor || '#00b4d8',
      stat: div.stat || `${medicines.filter(m => m.divisionId === div.id).length}+ Formulations`,
      theme: 'from-blue-950 to-slate-900',
      banners: div.banners && div.banners.length > 0 ? div.banners : [
        {
          eyebrow: `${div.name.toUpperCase()} PORTFOLIO`,
          title: 'Specialized Formulations',
          body: div.description || 'Specialized pharmaceutical formulations crafted to global standards.',
          stat: `${medicines.filter(m => m.divisionId === div.id).length}+ Formulations`,
          art: 'shield',
          tint: 'rgba(0, 180, 216, 0.12)'
        }
      ]
    })
    setModalOpen(true)
  }

  const addBannerSlide = () => {
    setFormData({
      ...formData,
      banners: [
        ...formData.banners,
        {
          eyebrow: 'THERAPEUTIC ADVANCEMENT',
          title: 'Next-Gen Clinical Delivery',
          body: 'Formulations engineered with high bioavailability and reliable patient compliance.',
          stat: 'GMP & WHO Compliant',
          art: 'flask',
          tint: 'rgba(56, 189, 248, 0.12)'
        }
      ]
    })
  }

  const removeBannerSlide = (index: number) => {
    if (formData.banners.length <= 1) return
    setFormData({
      ...formData,
      banners: formData.banners.filter((_, i) => i !== index)
    })
  }

  const updateBannerSlide = (index: number, field: keyof DivisionBannerSlide, value: string) => {
    const updated = [...formData.banners]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    setFormData({
      ...formData,
      banners: updated
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const generatedId = formData.id || formData.shortLabel.toLowerCase().replace(/[^a-z0-9]/g, '-')

    const divPayload: Division = {
      id: generatedId,
      name: formData.name,
      shortLabel: formData.shortLabel,
      icon: formData.icon,
      description: formData.description,
      tagline: formData.tagline,
      accentColor: formData.accentColor,
      stat: formData.stat,
      banners: formData.banners
    }

    if (editingDiv) {
      updateDivision(editingDiv.id, divPayload)
    } else {
      addDivision(divPayload)
    }
    setModalOpen(false)
  }

  const confirmDelete = () => {
    if (divToDelete) {
      deleteDivision(divToDelete.id)
      setDeleteModalOpen(false)
      setDivToDelete(null)
    }
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers size={13} />
            Division & Category Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Therapeutic Divisions
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Organize medicines into therapeutic sectors and customize the dynamic sliding banners displayed at the top of each category.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add New Division</span>
        </button>
      </div>

      {/* Division Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {divisions.map((div) => {
          const productCount = medicines.filter(m => m.divisionId === div.id).length
          const bannerCount = div.banners?.length || 0

          return (
            <div
              key={div.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative flex flex-col justify-between hover:border-slate-700 transition-all group shadow-xl hover:shadow-2xl hover:shadow-purple-950/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner"
                    style={{ 
                      backgroundColor: `${div.accentColor || '#a855f7'}20`, 
                      borderColor: `${div.accentColor || '#a855f7'}40`,
                      color: div.accentColor || '#a855f7'
                    }}
                  >
                    <Layers size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                      {productCount} Products
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-[11px] font-semibold flex items-center gap-1">
                      <Sliders size={11} /> {bannerCount} Slides
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{div.name}</h3>
                <p className="text-xs text-purple-300 font-semibold mb-2">Label: {div.shortLabel}</p>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {div.description || 'Specialized pharmaceutical formulations and treatments.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">ID: {div.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(div)}
                    className="p-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800/40 cursor-pointer inline-flex items-center gap-1 text-xs font-semibold px-2.5 transition-colors"
                    title="Edit Division & Banners"
                  >
                    <Edit3 size={13} /> Edit & Banners
                  </button>
                  <button
                    onClick={() => { setDivToDelete(div); setDeleteModalOpen(true); }}
                    className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/40 cursor-pointer transition-colors"
                    title="Delete Division"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Add / Edit Division & Banner Sliders Modal (Viewport Portal) ── */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDiv ? `Edit Division & Banners: ${editingDiv.name}` : 'Add Therapeutic Division & Banner Slides'}
        subtitle="Customize category metadata & rotating banner slides"
        icon={Layers}
        iconColor="text-purple-400 bg-purple-500/15 border-purple-500/30"
        maxWidth="max-w-3xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="divisionForm"
              className="px-6 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold shadow-lg shadow-purple-500/20 cursor-pointer transition-colors"
            >
              {editingDiv ? 'Save Division & Banners' : 'Create Division'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} id="divisionForm" className="space-y-6 text-xs">
          {/* Division Core Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Layers size={14} /> Division Core Settings
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Full Division Name * (e.g. Analgesics & Anti-Inflammatory)
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Cardiology & Vascular"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Short Display Label * (e.g. Analgesics)
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortLabel}
                  onChange={(e) => setFormData({ ...formData, shortLabel: e.target.value })}
                  placeholder="Short pill label"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Icon Symbol
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-400"
                >
                  {ICON_OPTIONS.map((ico) => (
                    <option key={ico} value={ico}>{ico}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Accent Color / Gradient
                </label>
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  placeholder="#00b4d8 or hex color"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Division Tagline (e.g. Targeted Pain Management & Mobility)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Tagline displayed on category cards"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Division therapeutic overview..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Highlight Stat (e.g. 15+ Formulations)
                </label>
                <input
                  type="text"
                  value={formData.stat}
                  onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                  placeholder="e.g. 15+ Formulations"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Card Theme Style
                </label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="e.g. from-blue-900/40 to-cyan-900/40"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Banner Slides Section */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sliders size={14} /> Rotating Banner Slides on /products?division={formData.id || '...'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  These banners auto-rotate smoothly at the top of the products catalogue when this division is selected.
                </p>
              </div>
              <button
                type="button"
                onClick={addBannerSlide}
                className="btn text-xs px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-md shadow-cyan-900/20"
              >
                <Plus size={13} /> Add Slide
              </button>
            </div>

            <div className="space-y-4">
              {formData.banners.map((slide, sIdx) => (
                <div key={sIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-200 text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-[10px]">
                        {sIdx + 1}
                      </span>
                      Banner Slide #{sIdx + 1}
                    </span>
                    {formData.banners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBannerSlide(sIdx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 cursor-pointer transition-colors text-xs flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Slide Eyebrow (e.g. BIOLYTIX RESPIRATORY CARE)
                      </label>
                      <input
                        type="text"
                        value={slide.eyebrow}
                        onChange={(e) => updateBannerSlide(sIdx, 'eyebrow', e.target.value)}
                        placeholder="Eyebrow text"
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Slide Headline *
                      </label>
                      <input
                        type="text"
                        required
                        value={slide.title}
                        onChange={(e) => updateBannerSlide(sIdx, 'title', e.target.value)}
                        placeholder="Main banner title"
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Slide Description Body
                    </label>
                    <input
                      type="text"
                      value={slide.body}
                      onChange={(e) => updateBannerSlide(sIdx, 'body', e.target.value)}
                      placeholder="Concise overview sentence"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Badge Stat (e.g. 100% Quality Assured)
                      </label>
                      <input
                        type="text"
                        value={slide.stat}
                        onChange={(e) => updateBannerSlide(sIdx, 'stat', e.target.value)}
                        placeholder="Key metric / badge"
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Graphic Art Icon
                      </label>
                      <select
                        value={slide.art}
                        onChange={(e) => updateBannerSlide(sIdx, 'art', e.target.value as any)}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      >
                        {ART_OPTIONS.map((art) => (
                          <option key={art} value={art}>{art}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Gradient Accent Tint
                      </label>
                      <input
                        type="text"
                        value={slide.tint}
                        onChange={(e) => updateBannerSlide(sIdx, 'tint', e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </AdminModal>

      {/* ── Delete Confirmation (Viewport Portal) ────────────────────────── */}
      <AdminConfirmDialog
        isOpen={deleteModalOpen && !!divToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete Division: ${divToDelete?.name || ''}?`}
        confirmLabel="Delete Division"
        variant="warning"
        description={
          <>
            Medicines currently assigned to this division ({medicines.filter(m => m.divisionId === divToDelete?.id).length} products) will still remain in catalogue, but the division pill and banner category will be removed.
          </>
        }
      />
    </div>
  )
}
