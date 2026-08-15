import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, AlertTriangle, type LucideIcon } from 'lucide-react'

interface AdminConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  icon?: LucideIcon
}

export default function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon: CustomIcon,
}: AdminConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const Icon = CustomIcon || (variant === 'danger' ? Trash2 : AlertTriangle)
  const iconStyle = variant === 'danger' 
    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  const confirmBtnStyle = variant === 'danger'
    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'

  const content = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${iconStyle}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {description}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer transition-colors ${confirmBtnStyle}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
