import { useState } from 'react'
import { 
  Mail, 
  Trash2, 
  Phone, 
  Search, 
  LayoutGrid, 
  Table as TableIcon, 
  MessageSquare,
  Eye,
  Clock
} from 'lucide-react'
import { useDataContext, type Inquiry } from '../../context/DataContext'
import AdminModal from '../../components/admin/AdminModal'
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog'

export default function AdminInquiries() {
  const { inquiries, deleteInquiry } = useDataContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null)
  const [filterType, setFilterType] = useState<string>('all')

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.phone && inq.phone.includes(searchQuery)) ||
      (inq.subject && inq.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterType === 'all') return matchesSearch
    if (filterType === 'procurement') return matchesSearch && (inq.subject?.toLowerCase().includes('bulk') || inq.subject?.toLowerCase().includes('procurement') || inq.subject?.toLowerCase().includes('supply'))
    if (filterType === 'franchise') return matchesSearch && (inq.subject?.toLowerCase().includes('pcd') || inq.subject?.toLowerCase().includes('franchise') || inq.subject?.toLowerCase().includes('distributor'))
    return matchesSearch
  })

  const confirmDelete = async () => {
    if (!inquiryToDelete) return
    await deleteInquiry(inquiryToDelete.id)
    setInquiryToDelete(null)
    if (selectedInquiry?.id === inquiryToDelete.id) {
      setSelectedInquiry(null)
    }
  }

  const getSubjectBadgeColor = (subject?: string) => {
    const s = (subject || '').toLowerCase()
    if (s.includes('bulk') || s.includes('procurement') || s.includes('supply')) {
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    }
    if (s.includes('franchise') || s.includes('pcd') || s.includes('distributor')) {
      return 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    }
    if (s.includes('quality') || s.includes('clinical') || s.includes('rx')) {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    }
    return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
  }

  return (
    <div className="space-y-6">
      {/* ── Header & Key Metrics ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="text-emerald-400" size={22} />
            <span>Commercial Inquiries & Customer Leads</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time distributor requests, franchise queries, and institutional supply messages submitted from the public site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {inquiries.length} Active Leads
          </span>
        </div>
      </div>

      {/* ── Filter Bar & View Mode Toggle ─────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* View Mode & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold text-slate-400">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-slate-800 text-white shadow' : 'hover:text-slate-200'
              }`}
            >
              All ({inquiries.length})
            </button>
            <button
              onClick={() => setFilterType('procurement')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === 'procurement' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' : 'hover:text-slate-200'
              }`}
            >
              Procurement
            </button>
            <button
              onClick={() => setFilterType('franchise')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === 'franchise' ? 'bg-purple-950 text-purple-300 border border-purple-800/40' : 'hover:text-slate-200'
              }`}
            >
              Franchise/PCD
            </button>
          </div>

          {/* Cards vs Table Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Data Table View"
            >
              <TableIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content View: Cards or Table ─────────────────────────────────── */}
      {filteredInquiries.length > 0 ? (
        viewMode === 'cards' ? (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInquiries.map((inq) => {
              const badgeClass = getSubjectBadgeColor(inq.subject)

              return (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg shadow-black/20"
                >
                  <div className="space-y-3">
                    {/* Top Row: Avatar, Name & Timestamp */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shadow-inner">
                          {inq.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight">{inq.name}</h3>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={11} /> {new Date(inq.date).toLocaleDateString()} at {new Date(inq.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badgeClass}`}>
                        {inq.subject || 'General Inquiry'}
                      </span>
                    </div>

                    {/* Contact Badges */}
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <a
                        href={`mailto:${inq.email}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-800 transition-colors flex items-center gap-1.5"
                      >
                        <Mail size={12} /> {inq.email}
                      </a>
                      {inq.phone && (
                        <a
                          href={`tel:${inq.phone}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
                        >
                          <Phone size={12} /> {inq.phone}
                        </a>
                      )}
                    </div>

                    {/* Message Snippet */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                      {inq.message}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Eye size={13} /> View Full Details
                    </button>

                    <div className="flex items-center gap-1.5">
                      {inq.phone && (
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40 cursor-pointer"
                          title="Open WhatsApp Chat"
                        >
                          <MessageSquare size={13} />
                        </a>
                      )}
                      <button
                        onClick={() => setInquiryToDelete(inq)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/40 cursor-pointer transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Table View */
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Date & Time</th>
                    <th className="p-3.5">Contact Name</th>
                    <th className="p-3.5">Email & Phone</th>
                    <th className="p-3.5">Subject / Category</th>
                    <th className="p-3.5">Message Excerpt</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredInquiries.map((inq) => {
                    const badgeClass = getSubjectBadgeColor(inq.subject)

                    return (
                      <tr key={inq.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 pl-5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {new Date(inq.date).toLocaleDateString()}
                          <div className="text-[10px] text-slate-500">{new Date(inq.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>

                        <td className="p-3.5 font-bold text-white whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center justify-center">
                              {inq.name.charAt(0).toUpperCase()}
                            </div>
                            {inq.name}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <a href={`mailto:${inq.email}`} className="text-cyan-400 hover:underline block truncate max-w-[160px]">
                            {inq.email}
                          </a>
                          {inq.phone && (
                            <a href={`tel:${inq.phone}`} className="text-slate-400 hover:text-white text-[11px] block">
                              {inq.phone}
                            </a>
                          )}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badgeClass}`}>
                            {inq.subject || 'General'}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-300 max-w-xs truncate">
                          {inq.message}
                        </td>

                        <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedInquiry(inq)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                              title="Inspect Full Message"
                            >
                              <Eye size={14} />
                            </button>
                            <a
                              href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Inquiry')}`}
                              className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 cursor-pointer"
                              title="Reply via Email"
                            >
                              <Mail size={14} />
                            </a>
                            <button
                              onClick={() => setInquiryToDelete(inq)}
                              className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/40 cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
          <Mail size={32} className="mx-auto text-slate-600 mb-2" />
          <p className="font-semibold text-slate-300">No matching inquiries found</p>
          <p className="text-[11px] mt-1">Inquiries submitted through the Contact Us form will show up here in real time.</p>
        </div>
      )}

      {/* ── Full Detail Modal Drawer (Viewport Portal) ────────────────── */}
      <AdminModal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title={selectedInquiry?.name || 'Customer Inquiry'}
        subtitle={selectedInquiry ? `Received on ${new Date(selectedInquiry.date).toLocaleDateString()} at ${new Date(selectedInquiry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
        icon={Mail}
        iconColor="text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
        maxWidth="max-w-2xl"
        footer={
          selectedInquiry && (
            <div className="flex flex-wrap items-center justify-between gap-3 w-full">
              <button
                type="button"
                onClick={() => setInquiryToDelete(selectedInquiry)}
                className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 font-semibold inline-flex items-center gap-1.5 cursor-pointer text-xs transition-colors"
              >
                <Trash2 size={14} /> Delete Lead
              </button>

              <div className="flex items-center gap-3">
                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer text-xs transition-colors"
                  >
                    <MessageSquare size={14} /> WhatsApp Reply
                  </a>
                )}
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'Biolytix Inquiry')}`}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold inline-flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer text-xs transition-colors"
                >
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </div>
          )
        }
      >
        {selectedInquiry && (
          <div className="space-y-5 text-xs">
            {/* Contact Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Email Address
                </span>
                <a href={`mailto:${selectedInquiry.email}`} className="text-cyan-400 font-semibold hover:underline flex items-center gap-1.5">
                  <Mail size={13} /> {selectedInquiry.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Telephone / WhatsApp
                </span>
                {selectedInquiry.phone ? (
                  <a href={`tel:${selectedInquiry.phone}`} className="text-white font-semibold hover:underline flex items-center gap-1.5">
                    <Phone size={13} /> {selectedInquiry.phone}
                  </a>
                ) : (
                  <span className="text-slate-500">Not provided</span>
                )}
              </div>
            </div>

            {/* Subject Tag */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Inquiry Category / Subject
              </span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-white text-sm">
                {selectedInquiry.subject || 'General Partnership / Procurement Inquiry'}
              </div>
            </div>

            {/* Message Content */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Full Customer Message
              </span>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed font-sans text-sm whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* ── Delete Confirmation Dialog (Viewport Portal) ─────────────────── */}
      <AdminConfirmDialog
        isOpen={!!inquiryToDelete}
        onClose={() => setInquiryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Customer Lead?"
        confirmLabel="Delete Lead"
        description={
          <>
            Are you sure you want to delete inquiry from <strong className="text-white">{inquiryToDelete?.name}</strong> ({inquiryToDelete?.email})? This action cannot be undone.
          </>
        }
      />
    </div>
  )
}
