import { useState, useMemo } from 'react'
import { 
  Pill, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  X, 
  Copy,
  ArrowRightLeft,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Layers,
  FolderInput,
  Check,
  MoveUp,
  MoveDown,
  Table as TableIcon
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
  'Powder',
  'Soap',
]

export default function AdminProducts() {
  const { 
    medicines, 
    divisions, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    reorderMedicines,
    moveMedicineDivision,
    batchMoveDivision
  } = useDataContext()

  // View state: 'table' vs 'board'
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table')

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDiv, setSelectedDiv] = useState<string>('all')
  const [selectedForm, setSelectedForm] = useState<string>('all')

  // Selection state for batch operations
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [batchTargetDiv, setBatchTargetDiv] = useState<string>(divisions[0]?.id || '')

  // Board Transfer Mode states
  const [sourceDivId, setSourceDivId] = useState<string>(divisions[0]?.id || 'multivitamins')
  const [targetDivId, setTargetDivId] = useState<string>(divisions[1]?.id || 'analgesics')
  const [sourceSelectedIds, setSourceSelectedIds] = useState<string[]>([])
  const [targetSelectedIds, setTargetSelectedIds] = useState<string[]>([])

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [quickMoveModalOpen, setQuickMoveModalOpen] = useState(false)
  const [editingMed, setEditingMed] = useState<Medicine | null>(null)
  const [medToDelete, setMedToDelete] = useState<Medicine | null>(null)
  const [medToQuickMove, setMedToQuickMove] = useState<Medicine | null>(null)
  const [quickMoveTargetDiv, setQuickMoveTargetDiv] = useState<string>('')

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
    divisionId: divisions[0]?.id || 'multivitamins',
    form: 'Tablet',
    pack: '10x10 Alu-Alu',
    indication: '',
    schedule: 'Rx',
    isNew: false,
    featured: false,
    ingredients: [{ name: '', strength: '' }],
  })

  // Filtered medicines for table
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

  // Products by source & target division for Board view
  const sourceProducts = useMemo(() => {
    return medicines.filter(m => m.divisionId === sourceDivId)
  }, [medicines, sourceDivId])

  const targetProducts = useMemo(() => {
    return medicines.filter(m => m.divisionId === targetDivId)
  }, [medicines, targetDivId])

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingMed(null)
    setFormData({
      name: '',
      composition: '',
      divisionId: selectedDiv !== 'all' ? selectedDiv : (divisions[0]?.id || 'multivitamins'),
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
      genericName: formData.composition.trim().slice(0, 100),
      composition: formData.composition.trim(),
      divisionId: formData.divisionId,
      form: formData.form,
      pack: formData.pack.trim(),
      indication: formData.indication.trim(),
      schedule: formData.schedule,
      isNew: formData.isNew,
      featured: formData.featured,
      isFeatured: formData.featured,
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

  // ── REORDER & DIVISION MOVE HANDLERS ──────────────────────────────────────
  
  // Single Move Division
  const handleDirectMove = async (medId: string, newDivId: string) => {
    if (!newDivId) return
    await moveMedicineDivision(medId, newDivId)
  }

  // Quick Move Modal Open
  const handleOpenQuickMove = (med: Medicine) => {
    setMedToQuickMove(med)
    setQuickMoveTargetDiv(med.divisionId)
    setQuickMoveModalOpen(true)
  }

  // Quick Move Modal Submit
  const handleQuickMoveSubmit = async () => {
    if (!medToQuickMove || !quickMoveTargetDiv) return
    if (quickMoveTargetDiv === medToQuickMove.divisionId) {
      setQuickMoveModalOpen(false)
      return
    }
    await moveMedicineDivision(medToQuickMove.id, quickMoveTargetDiv)
    setQuickMoveModalOpen(false)
    setMedToQuickMove(null)
  }

  // Batch Move Selected Products
  const handleExecuteBatchMove = async (targetDiv: string) => {
    if (selectedProductIds.length === 0 || !targetDiv) return
    await batchMoveDivision(selectedProductIds, targetDiv)
    setSelectedProductIds([])
  }

  // Reorder Position: Move Up within Division
  const handleReorderUp = async (medId: string, divId?: string) => {
    const list = [...medicines]
    const idx = list.findIndex(m => m.id === medId)
    if (idx <= 0) return

    if (divId) {
      // Find previous item in same division
      let prevSameDivIdx = -1
      for (let i = idx - 1; i >= 0; i--) {
        if (list[i].divisionId === divId) {
          prevSameDivIdx = i
          break
        }
      }
      if (prevSameDivIdx !== -1) {
        const item = list.splice(idx, 1)[0]
        list.splice(prevSameDivIdx, 0, item)
        await reorderMedicines(list)
      }
    } else {
      const item = list.splice(idx, 1)[0]
      list.splice(idx - 1, 0, item)
      await reorderMedicines(list)
    }
  }

  // Reorder Position: Move Down within Division
  const handleReorderDown = async (medId: string, divId?: string) => {
    const list = [...medicines]
    const idx = list.findIndex(m => m.id === medId)
    if (idx === -1 || idx >= list.length - 1) return

    if (divId) {
      // Find next item in same division
      let nextSameDivIdx = -1
      for (let i = idx + 1; i < list.length; i++) {
        if (list[i].divisionId === divId) {
          nextSameDivIdx = i
          break
        }
      }
      if (nextSameDivIdx !== -1) {
        const item = list.splice(idx, 1)[0]
        list.splice(nextSameDivIdx, 0, item)
        await reorderMedicines(list)
      }
    } else {
      const item = list.splice(idx, 1)[0]
      list.splice(idx + 1, 0, item)
      await reorderMedicines(list)
    }
  }

  // Board View: Transfer Selected from Source to Target
  const handleTransferSourceToTarget = async () => {
    if (sourceSelectedIds.length === 0 || !targetDivId) return
    await batchMoveDivision(sourceSelectedIds, targetDivId)
    setSourceSelectedIds([])
  }

  // Board View: Transfer Selected from Target to Source
  const handleTransferTargetToSource = async () => {
    if (targetSelectedIds.length === 0 || !sourceDivId) return
    await batchMoveDivision(targetSelectedIds, sourceDivId)
    setTargetSelectedIds([])
  }

  // Selection Helpers
  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredMedicines.length) {
      setSelectedProductIds([])
    } else {
      setSelectedProductIds(filteredMedicines.map(m => m.id))
    }
  }

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Export JSON
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

  const sourceDivData = divisions.find(d => d.id === sourceDivId) || divisions[0]
  const targetDivData = divisions.find(d => d.id === targetDivId) || divisions[1]

  return (
    <div className="space-y-6">
      {/* ── Top Bar & Actions ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Pill className="text-cyan-400" size={22} />
              <span>Pharmaceutical Formulations Catalogue</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              {medicines.length} Products
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage products, reorder sequence, or instantly transfer formulations between therapeutic divisions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Switcher Tabs */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TableIcon size={14} /> Table View
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ArrowRightLeft size={14} /> Reorder & Move Board
            </button>
          </div>

          <button
            onClick={exportCatalogue}
            className="btn px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={handleOpenCreate}
            className="btn px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 inline-flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* ── VIEW 1: REORDER & TRANSFER BETWEEN DIVISIONS BOARD ───────────────── */}
      {viewMode === 'board' && (
        <div className="space-y-6">
          {/* Quick Division Summary Pills */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers size={14} className="text-cyan-400" />
                <span>Select Divisions to Transfer Formulations Between</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Tip: Select products on either side and click Transfer, or use Up/Down to rearrange sequence.
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {divisions.map((d) => {
                const count = medicines.filter(m => m.divisionId === d.id).length
                const isSource = sourceDivId === d.id
                const isTarget = targetDivId === d.id
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      if (sourceDivId !== d.id) setSourceDivId(d.id)
                      else setTargetDivId(d.id)
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSource
                        ? 'bg-blue-950/70 border-cyan-400 text-white shadow-md'
                        : isTarget
                        ? 'bg-purple-950/70 border-purple-400 text-white shadow-md'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                        {d.shortLabel}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {count}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      {isSource && <span className="text-cyan-300 font-bold">● Source</span>}
                      {isTarget && <span className="text-purple-300 font-bold">● Target</span>}
                      {!isSource && !isTarget && <span className="text-slate-500">Click to focus</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dual Column Transfer Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* ── LEFT PANE: Source Division ──────────────────────────────── */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col shadow-xl">
              {/* Header */}
              <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                    <label className="text-xs font-bold uppercase text-cyan-300">Source Division</label>
                  </div>
                  <span className="text-xs font-bold text-slate-300">
                    {sourceProducts.length} Formulations
                  </span>
                </div>

                <select
                  value={sourceDivId}
                  onChange={(e) => {
                    setSourceDivId(e.target.value)
                    setSourceSelectedIds([])
                  }}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-cyan-800/60 text-white focus:outline-none focus:border-cyan-400"
                >
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({medicines.filter(m => m.divisionId === d.id).length} products)
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={sourceSelectedIds.length > 0 && sourceSelectedIds.length === sourceProducts.length}
                      onChange={() => {
                        if (sourceSelectedIds.length === sourceProducts.length) setSourceSelectedIds([])
                        else setSourceSelectedIds(sourceProducts.map(p => p.id))
                      }}
                      className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                    />
                    <span>Select All ({sourceProducts.length})</span>
                  </label>

                  {sourceSelectedIds.length > 0 && (
                    <span className="text-cyan-400 font-bold">{sourceSelectedIds.length} Selected</span>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="p-3 divide-y divide-slate-800/50 max-h-[550px] overflow-y-auto custom-scrollbar">
                {sourceProducts.length > 0 ? (
                  sourceProducts.map((med, idx) => {
                    const isSelected = sourceSelectedIds.includes(med.id)
                    return (
                      <div
                        key={med.id}
                        className={`p-3 rounded-xl transition-all flex items-center justify-between gap-3 ${
                          isSelected ? 'bg-cyan-950/40 border border-cyan-800/50' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSourceSelectedIds(prev => 
                                prev.includes(med.id) ? prev.filter(id => id !== med.id) : [...prev, med.id]
                              )
                            }}
                            className="rounded border-slate-700 bg-slate-950 text-cyan-500 cursor-pointer"
                          />
                          <span className="w-5 text-[11px] font-mono text-slate-500 flex-shrink-0">
                            #{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{med.name}</p>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{med.composition}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{med.form}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">{med.pack}</span>
                            </div>
                          </div>
                        </div>

                        {/* Reorder & Transfer Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleReorderUp(med.id, sourceDivId)}
                              disabled={idx === 0}
                              title="Move Up in Division"
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                            >
                              <MoveUp size={12} />
                            </button>
                            <button
                              onClick={() => handleReorderDown(med.id, sourceDivId)}
                              disabled={idx === sourceProducts.length - 1}
                              title="Move Down in Division"
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                            >
                              <MoveDown size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleDirectMove(med.id, targetDivId)}
                            title={`Transfer directly to ${targetDivData.name}`}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                          >
                            <span>Move</span> <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No products in {sourceDivData.name}.
                  </div>
                )}
              </div>
            </div>

            {/* ── CENTER CONTROLS: Transfer Operations ──────────────────────── */}
            <div className="lg:col-span-2 flex lg:flex-col items-center justify-center gap-3 py-4">
              <button
                onClick={handleTransferSourceToTarget}
                disabled={sourceSelectedIds.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span>Move Selected</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={handleTransferTargetToSource}
                disabled={targetSelectedIds.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <ArrowLeft size={14} />
                <span>Move Selected</span>
              </button>

              <div className="text-center mt-2 hidden lg:block">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                  Bidirectional
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Live Instant Sync
                </span>
              </div>
            </div>

            {/* ── RIGHT PANE: Target Division ─────────────────────────────── */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col shadow-xl">
              {/* Header */}
              <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                    <label className="text-xs font-bold uppercase text-purple-300">Target Division</label>
                  </div>
                  <span className="text-xs font-bold text-slate-300">
                    {targetProducts.length} Formulations
                  </span>
                </div>

                <select
                  value={targetDivId}
                  onChange={(e) => {
                    setTargetDivId(e.target.value)
                    setTargetSelectedIds([])
                  }}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-purple-800/60 text-white focus:outline-none focus:border-purple-400"
                >
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({medicines.filter(m => m.divisionId === d.id).length} products)
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={targetSelectedIds.length > 0 && targetSelectedIds.length === targetProducts.length}
                      onChange={() => {
                        if (targetSelectedIds.length === targetProducts.length) setTargetSelectedIds([])
                        else setTargetSelectedIds(targetProducts.map(p => p.id))
                      }}
                      className="rounded border-slate-700 bg-slate-950 text-purple-500"
                    />
                    <span>Select All ({targetProducts.length})</span>
                  </label>

                  {targetSelectedIds.length > 0 && (
                    <span className="text-purple-400 font-bold">{targetSelectedIds.length} Selected</span>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="p-3 divide-y divide-slate-800/50 max-h-[550px] overflow-y-auto custom-scrollbar">
                {targetProducts.length > 0 ? (
                  targetProducts.map((med, idx) => {
                    const isSelected = targetSelectedIds.includes(med.id)
                    return (
                      <div
                        key={med.id}
                        className={`p-3 rounded-xl transition-all flex items-center justify-between gap-3 ${
                          isSelected ? 'bg-purple-950/40 border border-purple-800/50' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setTargetSelectedIds(prev => 
                                prev.includes(med.id) ? prev.filter(id => id !== med.id) : [...prev, med.id]
                              )
                            }}
                            className="rounded border-slate-700 bg-slate-950 text-purple-500 cursor-pointer"
                          />
                          <span className="w-5 text-[11px] font-mono text-slate-500 flex-shrink-0">
                            #{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{med.name}</p>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{med.composition}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{med.form}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">{med.pack}</span>
                            </div>
                          </div>
                        </div>

                        {/* Reorder & Transfer Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleDirectMove(med.id, sourceDivId)}
                            title={`Transfer back to ${sourceDivData.name}`}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                          >
                            <ArrowLeft size={12} /> <span>Move</span>
                          </button>

                          <div className="flex flex-col">
                            <button
                              onClick={() => handleReorderUp(med.id, targetDivId)}
                              disabled={idx === 0}
                              title="Move Up in Division"
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                            >
                              <MoveUp size={12} />
                            </button>
                            <button
                              onClick={() => handleReorderDown(med.id, targetDivId)}
                              disabled={idx === targetProducts.length - 1}
                              title="Move Down in Division"
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                            >
                              <MoveDown size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No products in {targetDivData.name}.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── VIEW 2: FULL TABLE CATALOGUE WITH BATCH TRANSFERS & QUICK MOVE ── */}
      {viewMode === 'table' && (
        <div className="space-y-4">
          {/* Filter & Search Controls Bar */}
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

          {/* Floating / Sticky Batch Transfer Action Bar */}
          {selectedProductIds.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-700/80 shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs">
                  {selectedProductIds.length} Selected
                </span>
                <span className="text-xs text-cyan-200 font-medium">
                  Transfer selected formulations to another division:
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={batchTargetDiv}
                  onChange={(e) => setBatchTargetDiv(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-cyan-600 text-white focus:outline-none font-semibold"
                >
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      Move to: {d.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleExecuteBatchMove(batchTargetDiv)}
                  className="btn px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 inline-flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <FolderInput size={14} /> Apply Move
                </button>

                <button
                  onClick={() => setSelectedProductIds([])}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300 min-w-[820px]">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredMedicines.length > 0 && selectedProductIds.length === filteredMedicines.length}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-700 bg-slate-950 text-cyan-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Brand / Generic Formulation</th>
                    <th className="py-3.5 px-4">Dosage Form</th>
                    <th className="py-3.5 px-4">Division & Quick Move</th>
                    <th className="py-3.5 px-4">Packaging</th>
                    <th className="py-3.5 px-4">Indication</th>
                    <th className="py-3.5 px-4 text-center">Order</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((med, idx) => {
                      const div = divisions.find(d => d.id === med.divisionId)
                      const isSelected = selectedProductIds.includes(med.id)
                      return (
                        <tr 
                          key={med.id} 
                          className={`transition-colors ${isSelected ? 'bg-cyan-950/30' : 'hover:bg-slate-800/40'}`}
                        >
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectProduct(med.id)}
                              className="rounded border-slate-700 bg-slate-950 text-cyan-500 cursor-pointer"
                            />
                          </td>

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

                          {/* Division with Quick 1-Click Move Dropdown */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <select
                                value={med.divisionId}
                                onChange={(e) => handleDirectMove(med.id, e.target.value)}
                                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
                                style={{ color: div?.accentColor || '#38bdf8' }}
                              >
                                {divisions.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.shortLabel}
                                  </option>
                                ))}
                              </select>
                              
                              <button
                                onClick={() => handleOpenQuickMove(med)}
                                title="Change division"
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                              >
                                <ArrowRightLeft size={12} />
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300 font-medium whitespace-nowrap">
                            {med.pack}
                          </td>

                          <td className="py-3.5 px-4 max-w-xs truncate text-slate-400" title={med.indication}>
                            {med.indication}
                          </td>

                          {/* Reorder Up/Down Position Arrows */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleReorderUp(med.id)}
                                disabled={idx === 0}
                                title="Move Up in Global List"
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp size={13} />
                              </button>
                              <button
                                onClick={() => handleReorderDown(med.id)}
                                disabled={idx === filteredMedicines.length - 1}
                                title="Move Down in Global List"
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown size={13} />
                              </button>
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
                      <td colSpan={8} className="py-12 text-center text-slate-400">
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
              <span className="text-[11px]">Real-time synchronized across all views</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Move Division Modal ────────────────────────────────────── */}
      <AdminModal
        isOpen={quickMoveModalOpen}
        onClose={() => setQuickMoveModalOpen(false)}
        title="Move Formulation to Division"
        subtitle={medToQuickMove ? `Reassign "${medToQuickMove.name}" to another therapeutic area` : ''}
        icon={ArrowRightLeft}
        iconColor="text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setQuickMoveModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleQuickMoveSubmit}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Save Division Change
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {medToQuickMove && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-white text-sm block">{medToQuickMove.name}</span>
              <span className="text-slate-400 block mt-0.5">{medToQuickMove.composition}</span>
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span className="text-slate-500">Current Division:</span>
                <span className="font-bold text-cyan-400">
                  {divisions.find(d => d.id === medToQuickMove.divisionId)?.name || medToQuickMove.divisionId}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-2">
              Select New Therapeutic Division:
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
              {divisions.map((d) => {
                const isSelected = quickMoveTargetDiv === d.id
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setQuickMoveTargetDiv(d.id)}
                    className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 text-white font-bold shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold" style={{ color: d.accentColor || '#38bdf8' }}>{d.name}</p>
                      <p className="text-[11px] text-slate-400 font-sans">{d.shortLabel}</p>
                    </div>
                    {isSelected && <Check size={16} className="text-cyan-400" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </AdminModal>

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
            <textarea
              required
              rows={2}
              value={formData.composition}
              onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
              placeholder="Active ingredients and concentrations"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Division */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Therapeutic Division *</label>
              <select
                value={formData.divisionId}
                onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-semibold"
              >
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Dosage Form */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Dosage Form *</label>
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

            {/* Schedule */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Prescription Status</label>
              <select
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value as 'Rx' | 'OTC' })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Rx">Rx (Prescription)</option>
                <option value="OTC">OTC (Over The Counter)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Packaging */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Packaging (e.g. 10x10 Alu-Alu)</label>
              <input
                type="text"
                value={formData.pack}
                onChange={(e) => setFormData({ ...formData, pack: e.target.value })}
                placeholder="Unit packaging"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Flags */}
            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                />
                <span>Mark as "New" Launch</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                />
                <span>Featured on Home</span>
              </label>
            </div>
          </div>

          {/* Indication */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Clinical Indications</label>
            <input
              type="text"
              value={formData.indication}
              onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
              placeholder="Therapeutic uses & medical conditions treated"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Active Ingredients Builder */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-300">Structured Active Ingredients & Strengths</label>
              <button
                type="button"
                onClick={addIngredientRow}
                className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} /> Add Ingredient
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
              {formData.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                    placeholder="Active Ingredient Name"
                    className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    value={ing.strength}
                    onChange={(e) => updateIngredient(i, 'strength', e.target.value)}
                    placeholder="Strength (e.g. 500mg)"
                    className="w-32 p-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientRow(i)}
                      className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </AdminModal>

      {/* ── Delete Confirmation Dialog ─────────────────────────────────── */}
      <AdminConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Formulation"
        description={medToDelete ? `Are you sure you want to permanently remove "${medToDelete.name}" from the product catalogue? This action will remove it from all public and admin views.` : ''}
        confirmLabel="Delete Formulation"
      />
    </div>
  )
}
