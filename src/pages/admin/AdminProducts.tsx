import { useState, useMemo } from 'react'
import { 
  Pill, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  X, 
  Copy
} from 'lucide-react'
import { useDataContext } from '../../context/DataContext'
import { type Medicine, type DosageForm } from '../../data/products'
import AdminModal from '../../components/admin/AdminModal'
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog'

const DOSAGE_FORMS: DosageForm[] = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Drops',
  'Cream',
  'Injection',
  'Oral Solution',
  'Suspension',
  'Gel',
  'Ointment',
]

export default function AdminProducts() {
  const { medicines, divisions, addProduct, updateProduct, deleteProduct } = useDataContext()

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDiv, setSelectedDiv] = useState<string>('all')
  const [selectedForm, setSelectedForm] = useState<string>('all')

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingMed, setEditingMed] = useState<Medicine | null>(null)
  const [medToDelete, setMedToDelete] = useState<Medicine | null>(null)

  // Form states
  const [formData, setFormData] = useState<{
    name: string
    composition: string
    divisionId: string
    form: DosageForm
    pack: string
    indication: string
    schedule: 'Rx' | 'OTC'
    isNew: boolean
    featured: boolean
    ingredients: { name: string; strength: string }[]
  }>({
    name: '',
    composition: '',
    divisionId: divisions[0]?.id || 'anti-infectives',
    form: 'Tablet',
    pack: '10x10 Alu-Alu',
    indication: '',
    schedule: 'Rx',
    isNew: false,
    featured: false,
    ingredients: [{ name: '', strength: '' }],
  })

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.indication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.pack.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDiv = selectedDiv === 'all' || m.divisionId === selectedDiv
      const matchesForm = selectedForm === 'all' || m.form === selectedForm

      return matchesSearch && matchesDiv && matchesForm
    })
  }, [medicines, searchQuery, selectedDiv, selectedForm])

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingMed(null)
    setFormData({
      name: '',
      composition: '',
      divisionId: divisions[0]?.id || 'anti-infectives',
      form: 'Tablet',
      pack: '10x10 Alu-Alu',
      indication: '',
      schedule: 'Rx',
      isNew: false,
      featured: false,
      ingredients: [{ name: '', strength: '' }],
    })
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (med: Medicine) => {
    setEditingMed(med)
    setFormData({
      name: med.name,
      composition: med.composition,
      divisionId: med.divisionId,
      form: med.form,
      pack: med.pack,
      indication: med.indication,
      schedule: (med.schedule === 'OTC' ? 'OTC' : 'Rx') as 'Rx' | 'OTC',
      isNew: Boolean(med.isNew),
      featured: Boolean(med.featured || med.isFeatured),
      ingredients: med.ingredients && med.ingredients.length > 0 ? [...med.ingredients] : [{ name: '', strength: '' }],
    })
    setModalOpen(true)
  }

  // Duplicate Product
  const handleDuplicate = (med: Medicine) => {
    setEditingMed(null)
    setFormData({
      name: `${med.name} (Copy)`,
      composition: med.composition,
      divisionId: med.divisionId,
      form: med.form,
      pack: med.pack,
      indication: med.indication,
      schedule: (med.schedule === 'OTC' ? 'OTC' : 'Rx') as 'Rx' | 'OTC',
      isNew: true,
      featured: false,
      ingredients: [...med.ingredients],
    })
    setModalOpen(true)
  }

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.composition.trim()) return

    const cleanedIngredients = formData.ingredients.filter(i => i.name.trim())

    const payload = {
      name: formData.name.trim(),
      composition: formData.composition.trim(),
      divisionId: formData.divisionId,
      form: formData.form,
      pack: formData.pack.trim(),
      indication: formData.indication.trim(),
      schedule: formData.schedule,
      isNew: formData.isNew,
      featured: formData.featured,
      ingredients: cleanedIngredients.length > 0 ? cleanedIngredients : [{ name: formData.name, strength: '' }],
    }

    if (editingMed) {
      const ok = await updateProduct(editingMed.id, payload)
      if (ok) setModalOpen(false)
    } else {
      const ok = await addProduct(payload)
      if (ok) setModalOpen(false)
    }
  }

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!medToDelete) return
    await deleteProduct(medToDelete.id)
    setDeleteModalOpen(false)
    setMedToDelete(null)
  }

  // Export JSON / CSV
  const exportCatalogue = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(medicines, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `biolytix_catalogue_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Ingredient Helpers
  const addIngredientRow = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', strength: '' }]
    }))
  }

  const removeIngredientRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const updateIngredient = (index: number, field: 'name' | 'strength', val: string) => {
    setFormData(prev => {
      const updated = [...prev.ingredients]
      updated[index][field] = val
      return { ...prev, ingredients: updated }
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Top Bar & Actions ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Pill className="text-cyan-400" size={22} />
            <span>Pharmaceutical Formulations Catalogue</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage, edit, or add products. Changes are instantly reflected across all public user views.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCatalogue}
            className="btn px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 inline-flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} /> Export JSON
          </button>
          <button
            onClick={handleOpenCreate}
            className="btn px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus size={16} /> Add Formulation
          </button>
        </div>
      </div>

      {/* ── Filter & Search Controls Bar ─────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by brand name, active composition, indication, or pack size..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Division Filter */}
        <select
          value={selectedDiv}
          onChange={(e) => setSelectedDiv(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Divisions ({medicines.length})</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({medicines.filter(m => m.divisionId === d.id).length})
            </option>
          ))}
        </select>

        {/* Dosage Form Filter */}
        <select
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Forms</option>
          {DOSAGE_FORMS.map((form) => (
            <option key={form} value={form}>{form}</option>
          ))}
        </select>
      </div>

      {/* ── Products Table ───────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300 min-w-[760px]">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Brand / Generic Formulation</th>
                <th className="py-3.5 px-4">Dosage Form</th>
                <th className="py-3.5 px-4">Division</th>
                <th className="py-3.5 px-4">Packaging</th>
                <th className="py-3.5 px-4">Indication</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((med) => {
                  const div = divisions.find(d => d.id === med.divisionId)
                  return (
                    <tr key={med.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">{med.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-sm mt-0.5">
                            {med.composition}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-200 border border-slate-700 whitespace-nowrap">
                          {med.form}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/50 whitespace-nowrap">
                          {div ? div.shortLabel : med.divisionId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-medium whitespace-nowrap">
                        {med.pack}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-400" title={med.indication}>
                        {med.indication}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                            {med.schedule || 'Rx'}
                          </span>
                          {med.isNew && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDuplicate(med)}
                            title="Duplicate formulation"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(med)}
                            title="Edit product"
                            className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 transition-colors cursor-pointer"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => { setMedToDelete(med); setDeleteModalOpen(true); }}
                            title="Delete product"
                            className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No formulations found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Showing {filteredMedicines.length} of {medicines.length} total products</span>
          <span className="text-[11px]">Real-time synchronized with public catalogue</span>
        </div>
      </div>

      {/* ── Add / Edit Product Modal Drawer (Viewport Portal) ─────────── */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMed ? `Edit Product: ${editingMed.name}` : 'Add New Pharmaceutical Formulation'}
        subtitle="Real-time sync to public catalogue & search"
        icon={Pill}
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
              form="productForm"
              className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer transition-colors"
            >
              {editingMed ? 'Save & Sync Formulation' : 'Create Formulation'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} id="productForm" className="space-y-4 text-xs">
          {/* Brand Name */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Brand Name * (e.g. NANOLYTE D-3 NANO SHOT, DEFZIX-6 TAB)
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Brand / Trade Name"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-bold"
            />
          </div>

          {/* Composition */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Generic Composition * (e.g. Cholecalciferol 60,000 IU Oral Solution)
            </label>
            <input
              type="text"
              required
              value={formData.composition}
              onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
              placeholder="Full active pharmaceutical ingredients breakdown"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Division & Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Therapeutic Division *
              </label>
              <select
                value={formData.divisionId}
                onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.shortLabel})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Dosage Form *
              </label>
              <select
                value={formData.form}
                onChange={(e) => setFormData({ ...formData, form: e.target.value as DosageForm })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                {DOSAGE_FORMS.map((form) => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Packaging & Indication */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Packaging Specification * (e.g. 10x10 Alu-Alu, 4x5ml Shots, 100ml)
              </label>
              <input
                type="text"
                required
                value={formData.pack}
                onChange={(e) => setFormData({ ...formData, pack: e.target.value })}
                placeholder="e.g. 10x10 Alu-Alu"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Clinical Indication (e.g. Bone health, Pain relief)
              </label>
              <input
                type="text"
                value={formData.indication}
                onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                placeholder="Primary therapeutic usage"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Ingredients List */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-300">Active Ingredients & Strengths</span>
              <button
                type="button"
                onClick={addIngredientRow}
                className="text-[11px] text-cyan-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} /> Add Ingredient
              </button>
            </div>

            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Ingredient (e.g. Aceclofenac)"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Strength (e.g. 100mg)"
                  value={ing.strength}
                  onChange={(e) => updateIngredient(idx, 'strength', e.target.value)}
                  className="w-28 p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Toggles: Rx, New, Featured */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.schedule === 'Rx'}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.checked ? 'Rx' : 'OTC' })}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300 font-medium">Prescription Medicine (Rx Required)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300 font-medium">Flag as "NEW" Launch</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300 font-medium">Feature on Homepage Carousel</span>
            </label>
          </div>
        </form>
      </AdminModal>

      {/* ── Delete Confirmation Modal (Viewport Portal) ─────────────────── */}
      <AdminConfirmDialog
        isOpen={deleteModalOpen && !!medToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Formulation?"
        confirmLabel="Delete Formulation"
        description={
          <>
            Are you sure you want to remove <strong className="text-white">"{medToDelete?.name}"</strong>? This will remove it from all public catalogue searches and therapeutic division filters immediately.
          </>
        }
      />
    </div>
  )
}
