import React, { useState } from 'react'
import { Building2, Save, ShieldCheck } from 'lucide-react'
import { useDataContext } from '../../context/DataContext'
import { type CompanyInfo } from '../../data/company'

export default function AdminCompany() {
  const { company, updateCompany } = useDataContext()

  const [formData, setFormData] = useState<CompanyInfo>({
    name: company.name,
    tagline: company.tagline,
    foundingYear: company.foundingYear || 2024,
    phone: company.phone,
    altPhone: company.altPhone || '',
    email: company.email,
    website: company.website,
    registeredOffice: company.registeredOffice,
    correspondenceOffice: company.correspondenceOffice,
    workingHours: company.workingHours,
    certifications: [...company.certifications],
  })

  const [certInput, setCertInput] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateCompany(formData)
    setSaving(false)
  }

  const addCert = () => {
    if (!certInput.trim()) return
    setFormData((prev: CompanyInfo) => ({
      ...prev,
      certifications: [...prev.certifications, certInput.trim()]
    }))
    setCertInput('')
  }

  const removeCert = (idx: number) => {
    setFormData((prev: CompanyInfo) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i: number) => i !== idx)
    }))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="text-cyan-400" size={22} />
            <span>Company Profile & Contact Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update official company address, telephone numbers, emails, and regulatory certifications displayed in header and footer.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand Info */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white mb-2">Corporate Identity</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Company Legal Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Established Year *</label>
              <input
                type="number"
                required
                value={formData.foundingYear || 2024}
                onChange={(e) => setFormData({ ...formData, foundingYear: parseInt(e.target.value) || 2024 })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Brand Tagline *</label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Email */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white mb-2">Contact Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Primary Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Alternate / WhatsApp Number</label>
              <input
                type="text"
                value={formData.altPhone}
                onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Operating Working Hours</label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Office Locations */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white mb-2">Office Addresses</h3>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Registered Office (R.O.) *</label>
            <textarea
              rows={2}
              required
              value={formData.registeredOffice}
              onChange={(e) => setFormData({ ...formData, registeredOffice: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Correspondence Office (C.O.) *</label>
            <textarea
              rows={2}
              required
              value={formData.correspondenceOffice}
              onChange={(e) => setFormData({ ...formData, correspondenceOffice: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
          </div>
        </div>

        {/* Certifications */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white mb-2">Quality Certifications & Badges</h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {formData.certifications.map((c: string, i: number) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50"
              >
                <ShieldCheck size={13} />
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => removeCert(i)}
                  className="hover:text-rose-400 ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Add certification (e.g. Schedule M, GMP, ISO 14001:2015)"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
            <button
              type="button"
              onClick={addCert}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn px-8 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save & Broadcast Updates'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
