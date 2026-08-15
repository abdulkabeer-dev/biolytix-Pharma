import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, type LucideIcon } from 'lucide-react'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  maxWidth?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  maxWidth = 'max-w-3xl',
  children,
  footer,
}: AdminModalProps) {
  // Lock body scroll when modal is open and handle ESC key
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

  const modalContent = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className={`relative w-full ${maxWidth} bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-800/90 flex-shrink-0 bg-slate-900">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                <Icon size={20} />
              </div>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-slate-800/90 bg-slate-900/95 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
