import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { divisions as defaultDivisions, medicines as defaultMedicines, type Medicine, type Division } from '../data/products'
import { company as defaultCompany, type CompanyInfo } from '../data/company'

export interface HeroSlide {
  id: number
  eyebrow: string
  headline: [string, string]
  highlight: number
  body: string
  cta1: { label: string; to: string }
  cta2: { label: string; to: string }
  chips: string[]
  iconName?: string
  image: string
  artColor: string
  statNumber: string
  statLabel: string
  statDesc: string
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  date: string
  read?: boolean
}

export interface AuditEntry {
  id: string
  action: string
  entity: string
  summary: string
  timestamp: string
}

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: 'success' | 'info' | 'error' | 'warning'
}

interface DataContextType {
  // State
  medicines: Medicine[]
  divisions: Division[]
  slides: HeroSlide[]
  company: CompanyInfo
  inquiries: Inquiry[]
  auditLog: AuditEntry[]
  isConnected: boolean
  syncMode: 'sse' | 'broadcast' | 'offline'
  isLoading: boolean
  lastUpdated: string | null
  reconnect: () => void

  // Helpers
  getMedicineById: (id: string) => Medicine | undefined
  getMedicinesByDivision: (divisionId: string) => Medicine[]
  getDivisionById: (id: string) => Division | undefined

  // CRUD Actions
  addProduct: (product: Omit<Medicine, 'id'> & { id?: string }) => Promise<boolean>
  updateProduct: (id: string, product: Partial<Medicine>) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>
  reorderMedicines: (medicines: Medicine[]) => Promise<boolean>
  moveMedicineDivision: (medicineId: string, targetDivisionId: string) => Promise<boolean>
  batchMoveDivision: (medicineIds: string[], targetDivisionId: string) => Promise<boolean>

  addDivision: (division: Omit<Division, 'id'> & { id?: string }) => Promise<boolean>
  updateDivision: (id: string, division: Partial<Division>) => Promise<boolean>
  deleteDivision: (id: string) => Promise<boolean>

  addSlide: (slide: Omit<HeroSlide, 'id'> & { id?: number }) => Promise<boolean>
  updateSlide: (id: number, slide: Partial<HeroSlide>) => Promise<boolean>
  deleteSlide: (id: number) => Promise<boolean>
  reorderSlides: (slides: HeroSlide[]) => Promise<boolean>

  updateCompany: (info: Partial<CompanyInfo>) => Promise<boolean>

  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'>) => Promise<boolean>
  deleteInquiry: (id: string) => Promise<boolean>

  // Toast
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error' | 'warning') => void
  dismissToast: (id: string) => void
}

const DataContext = createContext<DataContextType | null>(null)

const BROADCAST_CHANNEL_NAME = 'biolytix_live_sync'

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(defaultMedicines)
  const [divisions, setDivisions] = useState<Division[]>(defaultDivisions)
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      id: 1,
      eyebrow: 'WHO-GMP Certified Manufacturer',
      headline: ['Quality That', 'Physicians Trust'],
      highlight: 1,
      body: 'From anti-infectives to cardiac care — Biolytix delivers precision-formulated medicines across 8 therapeutic divisions with uncompromised clinical efficacy.',
      cta1: { label: 'Explore Products', to: '/products' },
      cta2: { label: 'About Us', to: '/about' },
      chips: ['WHO-GMP Certified', 'ISO 9001:2015', 'DCGI Approved'],
      image: '/images/slides/slide1.jpg',
      artColor: '#38bdf8',
      statNumber: '1,000+',
      statLabel: 'Healthcare Providers',
      statDesc: 'Prescribing Biolytix formulations across India'
    },
    {
      id: 2,
      eyebrow: '8 Therapeutic Divisions',
      headline: ['73+ Formulations,', 'One Standard of Quality'],
      highlight: 0,
      body: 'Every tablet, capsule, injection, and syrup in our portfolio undergoes rigorous in-house QC & stability testing before release from our WHO-GMP units.',
      cta1: { label: 'View Catalogue', to: '/products' },
      cta2: { label: 'Quality Policy', to: '/quality-policy' },
      chips: ['In-House QC Lab', '8 Divisions', 'Batch Tested'],
      image: '/images/slides/slide2.jpg',
      artColor: '#00e5ff',
      statNumber: '100%',
      statLabel: 'Batch Verified',
      statDesc: 'Physicochemical & microbiological release testing'
    },
    {
      id: 3,
      eyebrow: 'Cardiac & Metabolic Care',
      headline: ['Precision Therapeutics', 'for Chronic Disease'],
      highlight: 0,
      body: 'Evidence-based formulations for hypertension, diabetes, dyslipidemia, and chronic pain management — manufactured to strict pharmacopoeial standards.',
      cta1: { label: 'Cardiac Division', to: '/products?division=cardiac' },
      cta2: { label: 'Partner With Us', to: '/contact' },
      chips: ['Cardiovascular', 'Anti-Diabetic', 'Chronic Care'],
      image: '/images/slides/slide3.jpg',
      artColor: '#60a5fa',
      statNumber: '120+',
      statLabel: 'Formulation Pipeline',
      statDesc: 'Expanding chronic care therapeutic solutions'
    },
    {
      id: 4,
      eyebrow: 'Nutrition & Preventive Health',
      headline: ['Science-Backed', 'Supplementation'],
      highlight: 1,
      body: 'Next-generation vitamins, liposomal minerals, and nutraceuticals designed with enhanced bioavailability (e.g. Nanolyte D3 Nano Shots & Bio-Q 300).',
      cta1: { label: 'Nutrition Division', to: '/products?division=multivitamins' },
      cta2: { label: 'Contact Commercial Team', to: '/contact' },
      chips: ['Liposomal CoQ10', 'Vitamin D3 Nano Shots', 'Collagen Peptides'],
      image: '/images/slides/slide4.jpg',
      artColor: '#34d399',
      statNumber: 'Max',
      statLabel: 'Bioavailability',
      statDesc: 'Engineered nano-emulsion & liposomal delivery'
    },
  ])
  const [company, setCompany] = useState<CompanyInfo>(defaultCompany)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [syncMode, setSyncMode] = useState<'sse' | 'broadcast' | 'offline'>('broadcast')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Toast Notification Trigger
  const showToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts(prev => [...prev.slice(-4), { id, title, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4500)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Apply complete state from server payload
  const applyDbSnapshot = useCallback((db: any) => {
    if (!db) return
    if (Array.isArray(db.medicines)) setMedicines(db.medicines)
    if (Array.isArray(db.divisions)) setDivisions(db.divisions)
    if (Array.isArray(db.slides)) setSlides(db.slides)
    if (db.company && typeof db.company === 'object') setCompany(db.company)
    if (Array.isArray(db.inquiries)) setInquiries(db.inquiries)
    if (Array.isArray(db.auditLog)) setAuditLog(db.auditLog)
    if (db.lastUpdated) setLastUpdated(db.lastUpdated)
  }, [])

  // Fetch initial snapshot from backend
  const fetchSnapshot = useCallback(async () => {
    try {
      const res = await fetch('/api/data')
      if (res.ok) {
        const db = await res.json()
        applyDbSnapshot(db)
        setIsConnected(true)
      }
    } catch (err) {
      console.warn('[DataContext] Backend API offline, using memory state', err)
    } finally {
      setIsLoading(false)
    }
  }, [applyDbSnapshot])

  // Setup SSE Real-time stream + BroadcastChannel for instant multi-tab sync
  const reconnect = useCallback(() => {
    fetchSnapshot()
  }, [fetchSnapshot])

  useEffect(() => {
    fetchSnapshot()

    // 1. Local BroadcastChannel (Sync across browser tabs instantly)
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME)
      bc.onmessage = (event) => {
        if (event.data?.db) {
          applyDbSnapshot(event.data.db)
          setIsConnected(true)
        }
      }
    } catch {
      // BroadcastChannel unsupported
    }

    // 2. Window focus & storage event fallback
    const handleFocus = () => {
      fetchSnapshot()
    }
    window.addEventListener('focus', handleFocus)

    // 3. Server-Sent Events (SSE) with auto-reconnection
    let es: EventSource | null = null
    let reconnectTimer: any = null
    let isDisposed = false

    const connectSSE = () => {
      if (isDisposed) return
      try {
        if (es) {
          es.close()
        }
        es = new EventSource('/api/events')

        es.onopen = () => {
          if (!isDisposed) {
            setIsConnected(true)
            setSyncMode('sse')
          }
        }

        es.addEventListener('connected', () => {
          if (!isDisposed) {
            setIsConnected(true)
            setSyncMode('sse')
          }
        })

        es.addEventListener('sync', (event: MessageEvent) => {
          if (isDisposed) return
          try {
            const payload = JSON.parse(event.data)
            if (payload.db) {
              applyDbSnapshot(payload.db)
              setIsConnected(true)
              setSyncMode('sse')
              if (bc) {
                bc.postMessage({ db: payload.db })
              }
            }
          } catch (err) {
            console.error('[DataContext] Error parsing SSE payload:', err)
          }
        })

        es.onerror = () => {
          if (isDisposed) return
          // When SSE stream drops or runs on static hosting, fallback to active browser BroadcastChannel
          if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            setIsConnected(true)
            setSyncMode('broadcast')
          } else {
            setIsConnected(false)
            setSyncMode('offline')
          }
          if (es) {
            es.close()
            es = null
          }
          // Schedule background retry
          clearTimeout(reconnectTimer)
          reconnectTimer = setTimeout(connectSSE, 8000)
        }
      } catch (err) {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          setIsConnected(true)
          setSyncMode('broadcast')
        }
      }
    }

    connectSSE()

    return () => {
      isDisposed = true
      clearTimeout(reconnectTimer)
      window.removeEventListener('focus', handleFocus)
      if (es) es.close()
      if (bc) bc.close()
    }
  }, [fetchSnapshot, applyDbSnapshot])

  // Helper getters
  const getMedicineById = useCallback((id: string) => medicines.find(m => m.id === id), [medicines])
  const getMedicinesByDivision = useCallback((divId: string) => medicines.filter(m => m.divisionId === divId), [medicines])
  const getDivisionById = useCallback((id: string) => divisions.find(d => d.id === id), [divisions])

  // ── CRUD: PRODUCTS ────────────────────────────────────────────────────────
  const addProduct = async (product: Omit<Medicine, 'id'> & { id?: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Product Added', `"${data.product.name}" has been added to the catalogue.`, 'success')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Adding Product', data.error || 'Failed to add product', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const updateProduct = async (id: string, product: Partial<Medicine>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Product Updated', `"${data.product.name}" details were updated.`, 'success')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Updating Product', data.error || 'Failed to update', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const med = medicines.find(m => m.id === id)
      const medName = med ? med.name : id
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Product Deleted', `"${medName}" has been removed from catalogue.`, 'info')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Deleting Product', data.error || 'Failed to delete', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const reorderMedicines = async (newMedicines: Medicine[]): Promise<boolean> => {
    try {
      setMedicines(newMedicines)
      const res = await fetch('/api/products/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: newMedicines }),
      })
      if (res.ok) {
        showToast('Sequence & Divisions Saved', 'Product catalogue sequence and division assignments updated live.', 'success')
        fetchSnapshot()
        return true
      } else {
        const data = await res.json()
        showToast('Error Reordering Products', data.error || 'Failed to reorder products', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Products Reordered', 'Catalogue sequence updated in current session.', 'info')
      return true
    }
  }

  const moveMedicineDivision = async (medicineId: string, targetDivisionId: string): Promise<boolean> => {
    try {
      const med = medicines.find(m => m.id === medicineId)
      if (!med) return false
      const targetDiv = divisions.find(d => d.id === targetDivisionId)
      const divName = targetDiv ? targetDiv.name : targetDivisionId

      const updatedMedicines = medicines.map(m => m.id === medicineId ? { ...m, divisionId: targetDivisionId } : m)
      setMedicines(updatedMedicines)

      const res = await fetch(`/api/products/${encodeURIComponent(medicineId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ divisionId: targetDivisionId }),
      })
      if (res.ok) {
        showToast('Division Updated', `"${med.name}" moved to ${divName}.`, 'success')
        fetchSnapshot()
        return true
      } else {
        const data = await res.json()
        showToast('Error Moving Product', data.error || 'Failed to move product', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const batchMoveDivision = async (medicineIds: string[], targetDivisionId: string): Promise<boolean> => {
    try {
      const targetDiv = divisions.find(d => d.id === targetDivisionId)
      const divName = targetDiv ? targetDiv.name : targetDivisionId

      const updatedMedicines = medicines.map(m => medicineIds.includes(m.id) ? { ...m, divisionId: targetDivisionId } : m)
      setMedicines(updatedMedicines)

      const res = await fetch('/api/products/batch-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineIds, targetDivisionId }),
      })
      if (res.ok) {
        showToast('Bulk Transfer Complete', `${medicineIds.length} products moved to ${divName}.`, 'success')
        fetchSnapshot()
        return true
      } else {
        const data = await res.json()
        showToast('Error Moving Products', data.error || 'Failed to batch move', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  // ── CRUD: DIVISIONS ───────────────────────────────────────────────────────
  const addDivision = async (division: Omit<Division, 'id'> & { id?: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/divisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(division),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Division Created', `Division "${data.division.name}" is now live.`, 'success')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Adding Division', data.error || 'Failed to add', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const updateDivision = async (id: string, division: Partial<Division>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/divisions/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(division),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Division Updated', `"${data.division.name}" updated successfully.`, 'success')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Updating Division', data.error || 'Failed to update', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const deleteDivision = async (id: string): Promise<boolean> => {
    try {
      const div = divisions.find(d => d.id === id)
      const divName = div ? div.name : id
      const res = await fetch(`/api/divisions/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Division Removed', `Division "${divName}" deleted.`, 'info')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Deleting Division', data.error || 'Failed to delete', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  // ── CRUD: HERO SLIDES ─────────────────────────────────────────────────────
  const addSlide = async (slide: Omit<HeroSlide, 'id'> & { id?: number }): Promise<boolean> => {
    try {
      const res = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Slide Added', 'New hero slide added to carousel.', 'success')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Adding Slide', data.error || 'Failed to add slide', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const updateSlide = async (id: number, slide: Partial<HeroSlide>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Slide Updated', `Slide #${id} updated live.`, 'success')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Updating Slide', data.error || 'Failed to update slide', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const deleteSlide = async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/slides/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Slide Removed', `Slide #${id} deleted from carousel.`, 'info')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Deleting Slide', data.error || 'Failed to delete slide', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const reorderSlides = async (newSlides: HeroSlide[]): Promise<boolean> => {
    try {
      setSlides(newSlides)
      const res = await fetch('/api/slides/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: newSlides }),
      })
      if (res.ok) {
        showToast('Slides Reordered', 'Hero carousel sequence updated.', 'success')
        fetchSnapshot()
        return true
      }
      return false
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  // ── CRUD: COMPANY INFO ────────────────────────────────────────────────────
  const updateCompany = async (info: Partial<CompanyInfo>): Promise<boolean> => {
    try {
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Company Info Saved', 'Company profile and contact details updated.', 'success')
        fetchSnapshot()
        return true
      } else {
        showToast('Error Updating Company', data.error || 'Failed to save', 'error')
        return false
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  // ── CRUD: INQUIRIES ───────────────────────────────────────────────────────
  const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'date'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Inquiry Submitted', data.message || 'Our commercial team will contact you shortly.', 'success')
        fetchSnapshot()
        return true
      }
      return false
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const deleteInquiry = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showToast('Inquiry Deleted', 'Lead removed from inbox.', 'info')
        fetchSnapshot()
        return true
      }
      return false
    } catch (err: any) {
      showToast('Network Error', err.message, 'error')
      return false
    }
  }

  const value = useMemo(() => ({
    medicines,
    divisions,
    slides,
    company,
    inquiries,
    auditLog,
    isConnected,
    syncMode,
    isLoading,
    lastUpdated,
    reconnect,
    getMedicineById,
    getMedicinesByDivision,
    getDivisionById,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderMedicines,
    moveMedicineDivision,
    batchMoveDivision,
    addDivision,
    updateDivision,
    deleteDivision,
    addSlide,
    updateSlide,
    deleteSlide,
    reorderSlides,
    updateCompany,
    addInquiry,
    deleteInquiry,
    showToast,
    dismissToast,
  }), [
    medicines,
    divisions,
    slides,
    company,
    inquiries,
    auditLog,
    isConnected,
    syncMode,
    isLoading,
    lastUpdated,
    reconnect,
    getMedicineById,
    getMedicinesByDivision,
    getDivisionById,
    showToast,
    dismissToast,
  ])

  return (
    <DataContext.Provider value={value}>
      {children}

      {/* ── Global Real-Time Toast Notifications Container ──────────────── */}
      <div className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success'
            const isError = toast.type === 'error'
            const isWarning = toast.type === 'warning'

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border"
                style={{
                  background: isSuccess
                    ? 'rgba(6, 26, 43, 0.95)'
                    : isError
                    ? 'rgba(40, 10, 15, 0.95)'
                    : isWarning
                    ? 'rgba(38, 28, 5, 0.95)'
                    : 'rgba(10, 25, 45, 0.95)',
                  borderColor: isSuccess
                    ? 'rgba(56, 189, 248, 0.4)'
                    : isError
                    ? 'rgba(239, 68, 68, 0.4)'
                    : isWarning
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'rgba(59, 130, 246, 0.4)',
                }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isSuccess && <CheckCircle2 size={18} className="text-cyan-400" />}
                  {isError && <AlertCircle size={18} className="text-rose-400" />}
                  {isWarning && <AlertTriangle size={18} className="text-amber-400" />}
                  {!isSuccess && !isError && !isWarning && <Info size={18} className="text-blue-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white leading-tight">{toast.title}</h4>
                  {toast.message && (
                    <p className="mt-1 text-[11px] text-slate-300 leading-normal">{toast.message}</p>
                  )}
                </div>

                <button
                  onClick={() => dismissToast(toast.id)}
                  className="flex-shrink-0 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </DataContext.Provider>
  )
}

export function useDataContext() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider')
  }
  return context
}
