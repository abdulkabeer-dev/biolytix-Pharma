import React, { useState } from 'react'
import { 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye
} from 'lucide-react'
import { useDataContext, type HeroSlide } from '../../context/DataContext'
import AdminModal from '../../components/admin/AdminModal'

const PRESET_IMAGES = [
  { label: 'Clinical Laboratory Hub (Slide 1)', url: '/images/slides/slide1.jpg' },
  { label: 'Automated Cleanroom Line (Slide 2)', url: '/images/slides/slide2.jpg' },
  { label: 'Cardiology Diagnostics (Slide 3)', url: '/images/slides/slide3.jpg' },
  { label: 'Nutraceutical Biotechnology (Slide 4)', url: '/images/slides/slide4.jpg' },
  { label: 'Pharma Lab Facility (About Hero)', url: '/images/heroes/about.jpg' },
  { label: 'Packaging Line (Products Hero)', url: '/images/heroes/products.jpg' },
  { label: 'WHO-GMP QC Lab (Quality Hero)', url: '/images/heroes/quality.jpg' },
  { label: 'Headquarters Facade (Contact Hero)', url: '/images/heroes/contact.jpg' },
]

export default function AdminHeroSlider() {
  const { slides, addSlide, updateSlide, deleteSlide, reorderSlides } = useDataContext()

  const [activeSlideId, setActiveSlideId] = useState<number>(slides[0]?.id || 1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)

  const [formData, setFormData] = useState<{
    eyebrow: string
    headlineLine1: string
    headlineLine2: string
    highlight: number
    body: string
    cta1Label: string
    cta1To: string
    cta2Label: string
    cta2To: string
    chips: string
    image: string
    artColor: string
    statNumber: string
    statLabel: string
    statDesc: string
  }>({
    eyebrow: 'WHO-GMP Certified Manufacturer',
    headlineLine1: 'Quality That',
    headlineLine2: 'Physicians Trust',
    highlight: 1,
    body: 'Precision formulations across 8 therapeutic divisions.',
    cta1Label: 'Explore Products',
    cta1To: '/products',
    cta2Label: 'About Us',
    cta2To: '/about',
    chips: 'WHO-GMP Certified, ISO 9001:2015, DCGI Approved',
    image: '/images/slides/slide1.jpg',
    artColor: '#38bdf8',
    statNumber: '5,000+',
    statLabel: 'Healthcare Providers',
    statDesc: 'Prescribing Biolytix formulations across India',
  })

  const currentActiveSlide = slides.find(s => s.id === activeSlideId) || slides[0]

  const handleOpenCreate = () => {
    setEditingSlide(null)
    setFormData({
      eyebrow: 'New Therapeutic Launch',
      headlineLine1: 'Advanced Formulations,',
      headlineLine2: 'Proven Clinical Care',
      highlight: 1,
      body: 'Delivering patient-centric healthcare solutions across hospital and institutional networks.',
      cta1Label: 'View Products',
      cta1To: '/products',
      cta2Label: 'Contact Us',
      cta2To: '/contact',
      chips: 'WHO-GMP Certified, Batch Tested, 100% Quality',
      image: '/images/slides/slide1.jpg',
      artColor: '#38bdf8',
      statNumber: '100%',
      statLabel: 'Batch Verified',
      statDesc: 'Tested under strict pharmacopoeial protocols',
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      eyebrow: slide.eyebrow,
      headlineLine1: slide.headline[0] || '',
      headlineLine2: slide.headline[1] || '',
      highlight: slide.highlight ?? 1,
      body: slide.body,
      cta1Label: slide.cta1.label,
      cta1To: slide.cta1.to,
      cta2Label: slide.cta2.label,
      cta2To: slide.cta2.to,
      chips: slide.chips.join(', '),
      image: slide.image,
      artColor: slide.artColor,
      statNumber: slide.statNumber,
      statLabel: slide.statLabel,
      statDesc: slide.statDesc,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanedChips = formData.chips.split(',').map(c => c.trim()).filter(Boolean)

    const payload: Omit<HeroSlide, 'id'> = {
      eyebrow: formData.eyebrow.trim(),
      headline: [formData.headlineLine1.trim(), formData.headlineLine2.trim()],
      highlight: formData.highlight,
      body: formData.body.trim(),
      cta1: { label: formData.cta1Label.trim(), to: formData.cta1To.trim() },
      cta2: { label: formData.cta2Label.trim(), to: formData.cta2To.trim() },
      chips: cleanedChips,
      image: formData.image.trim(),
      artColor: formData.artColor.trim(),
      statNumber: formData.statNumber.trim(),
      statLabel: formData.statLabel.trim(),
      statDesc: formData.statDesc.trim(),
    }

    if (editingSlide) {
      const ok = await updateSlide(editingSlide.id, payload)
      if (ok) setModalOpen(false)
    } else {
      const ok = await addSlide(payload)
      if (ok) setModalOpen(false)
    }
  }

  const moveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= slides.length) return

    const newSlides = [...slides]
    const temp = newSlides[index]
    newSlides[index] = newSlides[targetIdx]
    newSlides[targetIdx] = temp

    await reorderSlides(newSlides)
  }

  return (
    <div className="space-y-8">
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="text-cyan-400" size={22} />
            <span>Homepage Hero Carousel & Banner Editor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update background images, headlines, highlight colors, and buttons with real-time live preview.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Plus size={16} /> Add Hero Slide
        </button>
      </div>

      {/* ── Live Interactive Preview Window ──────────────────────────────── */}
      {currentActiveSlide && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Live Public Site Simulation (Slide #{slides.findIndex(s => s.id === currentActiveSlide.id) + 1})
              </span>
            </div>
            <button
              onClick={() => handleOpenEdit(currentActiveSlide)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Edit3 size={13} /> Edit This Slide
            </button>
          </div>

          {/* Simulated Slide Canvas */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/8] sm:aspect-[16/7] bg-slate-950 border border-slate-800 flex items-center p-6 sm:p-10 shadow-2xl">
            {/* Background Image */}
            <img
              src={currentActiveSlide.image}
              alt="Slide Preview"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.8]"
            />
            {/* Contrast Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, rgba(6, 20, 36, 0.95) 0%, rgba(6, 20, 36, 0.85) 50%, rgba(6, 20, 36, 0.4) 100%)',
              }}
            />

            {/* Content Layer */}
            <div className="relative z-10 max-w-xl space-y-3">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-white backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: currentActiveSlide.artColor }} />
                <span style={{ color: currentActiveSlide.artColor }}>{currentActiveSlide.eyebrow}</span>
              </span>

              <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
                {currentActiveSlide.headline.map((line, i) => (
                  <span key={i} className="block">
                    {i === currentActiveSlide.highlight ? (
                      <span style={{ color: currentActiveSlide.artColor }}>{line}</span>
                    ) : line}
                  </span>
                ))}
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
                {currentActiveSlide.body}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 shadow-md"
                  style={{ background: currentActiveSlide.artColor }}
                >
                  {currentActiveSlide.cta1.label} →
                </span>
                <span className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/10 border border-white/20">
                  {currentActiveSlide.cta2.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Slide Manager List ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
          Carousel Sequence ({slides.length} Active Slides)
        </h3>

        <div className="space-y-3">
          {slides.map((slide, idx) => {
            const isSelected = slide.id === activeSlideId

            return (
              <div
                key={slide.id}
                onClick={() => setActiveSlideId(slide.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected 
                    ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/40' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700 bg-slate-950">
                    <img src={slide.image} alt={slide.eyebrow} className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950/80 text-white">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: slide.artColor }}>
                        {slide.eyebrow}
                      </span>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                          Active Preview
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white truncate mt-0.5">
                      {slide.headline.join(' ')}
                    </h4>
                    <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                      Buttons: "{slide.cta1.label}" → {slide.cta1.to} | "{slide.cta2.label}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    disabled={idx === 0}
                    onClick={() => moveSlide(idx, 'up')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                    title="Move slide up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={idx === slides.length - 1}
                    onClick={() => moveSlide(idx, 'down')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                    title="Move slide down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 cursor-pointer"
                    title="Edit slide"
                  >
                    <Edit3 size={14} />
                  </button>
                  {slides.length > 1 && (
                    <button
                      onClick={() => deleteSlide(slide.id)}
                      className="p-2 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/40 cursor-pointer"
                      title="Delete slide"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Slide Edit / Create Modal (Viewport Portal) ────────────────── */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlide ? `Edit Hero Slide` : 'Add New Hero Slide'}
        subtitle="Customize homepage hero slide presentation & CTA"
        icon={Sliders}
        iconColor="text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
        maxWidth="max-w-2xl"
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
              form="heroSlideForm"
              className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer transition-colors"
            >
              {editingSlide ? 'Update & Publish Slide' : 'Create Slide'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} id="heroSlideForm" className="space-y-4 text-xs">
          {/* Eyebrow */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Top Eyebrow Badge (e.g. WHO-GMP Certified Manufacturer)
            </label>
            <input
              type="text"
              required
              value={formData.eyebrow}
              onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Headline Line 1 *
              </label>
              <input
                type="text"
                required
                value={formData.headlineLine1}
                onChange={(e) => setFormData({ ...formData, headlineLine1: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Headline Line 2 *
              </label>
              <input
                type="text"
                required
                value={formData.headlineLine2}
                onChange={(e) => setFormData({ ...formData, headlineLine2: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>
          </div>

          {/* Highlight Line & Accent Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Highlight Colored Line
              </label>
              <select
                value={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: parseInt(e.target.value, 10) })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value={0}>Highlight Line 1 ("{formData.headlineLine1 || 'Line 1'}")</option>
                <option value={1}>Highlight Line 2 ("{formData.headlineLine2 || 'Line 2'}")</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Accent Glow Color
              </label>
              <input
                type="text"
                value={formData.artColor}
                onChange={(e) => setFormData({ ...formData, artColor: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Body Text */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Slide Description Text *
            </label>
            <textarea
              rows={2}
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Background Image selector */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Background Image URL / Preset Selection *
            </label>
            <div className="space-y-2">
              <select
                onChange={(e) => {
                  if (e.target.value) setFormData({ ...formData, image: e.target.value })
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">-- Choose from preset high-res images --</option>
                {PRESET_IMAGES.map((p, idx) => (
                  <option key={idx} value={p.url}>{p.label}</option>
                ))}
              </select>
              <input
                type="text"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/slides/slide1.jpg or https://..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Buttons: CTA 1 & CTA 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="space-y-2">
              <span className="font-bold text-cyan-400">Primary Button (CTA 1)</span>
              <input
                type="text"
                placeholder="Button Label (e.g. Explore Products)"
                value={formData.cta1Label}
                onChange={(e) => setFormData({ ...formData, cta1Label: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <input
                type="text"
                placeholder="Destination (e.g. /products)"
                value={formData.cta1To}
                onChange={(e) => setFormData({ ...formData, cta1To: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-300">Secondary Button (CTA 2)</span>
              <input
                type="text"
                placeholder="Button Label (e.g. About Us)"
                value={formData.cta2Label}
                onChange={(e) => setFormData({ ...formData, cta2Label: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <input
                type="text"
                placeholder="Destination (e.g. /about)"
                value={formData.cta2To}
                onChange={(e) => setFormData({ ...formData, cta2To: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          {/* Stat Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Key Stat</label>
              <input
                type="text"
                placeholder="e.g. 5,000+"
                value={formData.statNumber}
                onChange={(e) => setFormData({ ...formData, statNumber: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Stat Label</label>
              <input
                type="text"
                placeholder="e.g. Healthcare Providers"
                value={formData.statLabel}
                onChange={(e) => setFormData({ ...formData, statLabel: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Stat Summary</label>
              <input
                type="text"
                placeholder="e.g. Prescribing across India"
                value={formData.statDesc}
                onChange={(e) => setFormData({ ...formData, statDesc: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Chips */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Feature Chips (comma-separated)
            </label>
            <input
              type="text"
              value={formData.chips}
              onChange={(e) => setFormData({ ...formData, chips: e.target.value })}
              placeholder="WHO-GMP Certified, ISO 9001:2015, Batch Tested"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </form>
      </AdminModal>
    </div>
  )
}
