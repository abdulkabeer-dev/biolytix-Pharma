import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  Award, 
  FileCheck, 
  Download, 
  Eye, 
  X,
  Sparkles
} from 'lucide-react'
import PageHero from '../components/site/PageHero'
import Reveal from '../components/site/Reveal'
import SectionHeading from '../components/site/SectionHeading'
import { useDataContext } from '../context/DataContext'

interface CertificateItem {
  id: string
  title: string
  standard: string
  certNumber: string
  issueDate: string
  validUntil: string
  scope: string
  issuedBy: string
  accreditation: string
  image: string
  badgeColor: string
  badgeBg: string
}

const CERTIFICATES: CertificateItem[] = [
  {
    id: 'iso-9001',
    title: 'ISO 9001:2015 Quality Management System',
    standard: 'ISO 9001:2015',
    certNumber: 'SCPL5037',
    issueDate: '11.08.2026',
    validUntil: '10.07.2029',
    scope: 'MARKETING OF PHARMA AND NUTRACEUTICAL LIKE TABLET CAPSULE, INJECTION, POWDERS, SACHETS, OINTMENTS & FOOD SUPPLEMENTS',
    issuedBy: 'SIGMA CERTIFICATION PTY LTD (Queensland, Australia)',
    accreditation: 'UNITED STATES ACCREDITATION BOARD (USAB, Delaware, USA)',
    image: '/images/certificates/iso-certificate.png',
    badgeColor: 'text-blue-400 border-blue-500/40',
    badgeBg: 'bg-blue-500/10',
  },
  {
    id: 'gdp',
    title: 'Good Distribution Practice (GDP) Compliance',
    standard: 'GDP Compliant',
    certNumber: 'SCPL5038',
    issueDate: '11.08.2026',
    validUntil: '10.07.2029',
    scope: 'MARKETING OF PHARMA AND NUTRACEUTICAL LIKE TABLET CAPSULE, INJECTION, POWDERS, SACHETS, OINTMENTS & FOOD SUPPLEMENTS',
    issuedBy: 'SIGMA CERTIFICATION PTY LTD (Queensland, Australia)',
    accreditation: 'Global Good Distribution Practice Standard',
    image: '/images/certificates/gdp-certificate.png',
    badgeColor: 'text-emerald-400 border-emerald-500/40',
    badgeBg: 'bg-emerald-500/10',
  }
]

export default function Certificates() {
  const { company } = useDataContext()
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null)

  return (
    <>
      <PageHero
        eyebrow="Official Accreditations"
        title="Regulatory Certifications & Quality Compliance"
        description="Authentic certified quality management and Good Distribution Practice compliance documents issued by internationally recognized accreditation bodies."
        breadcrumbs={[
          { label: 'About Us', to: '/about' },
          { label: 'Certificates' }
        ]}
        bgImage="/images/heroes/quality.jpg"
      />

      {/* ── Summary Accreditation Bar ────────────────────────────────────── */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Certified Organization</h4>
                <p className="text-xs text-slate-400 font-sans">Biolytix Pharmaceuticals</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Award size={26} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Active Certifications</h4>
                <p className="text-xs text-slate-400 font-sans">ISO 9001:2015 & GDP Compliant</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <FileCheck size={26} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Accrediting Bodies</h4>
                <p className="text-xs text-slate-400 font-sans">USAB (USA) & Sigma (Australia)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Certificate Cards Grid ────────────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Compliance Documents"
            title="Official Verified Certificates"
            description="Inspect our complete regulatory registration documents. Click any certificate to view high-resolution image and verification details."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {CERTIFICATES.map((cert, i) => (
              <Reveal key={cert.id} delay={i * 0.15}>
                <div className="rounded-3xl border border-slate-200 bg-white hover:border-cyan-500/50 hover:shadow-2xl transition-all overflow-hidden flex flex-col md:flex-row group h-full">
                  {/* Certificate Image Preview */}
                  <div 
                    onClick={() => setSelectedCert(cert)}
                    className="md:w-5/12 bg-slate-950/5 relative cursor-pointer overflow-hidden flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100 group"
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-auto max-h-[360px] object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <span className="px-4 py-2 rounded-xl bg-white text-slate-950 text-xs font-bold shadow-xl inline-flex items-center gap-1.5">
                        <Eye size={14} /> Click to Enlarge
                      </span>
                    </div>
                  </div>

                  {/* Certificate Information */}
                  <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cert.badgeColor} ${cert.badgeBg}`}>
                          {cert.standard}
                        </span>
                        <span className="text-xs font-mono text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                          No: {cert.certNumber}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug mt-2">
                        {cert.title}
                      </h3>

                      <div className="mt-4 space-y-2 text-xs text-slate-600">
                        <div>
                          <span className="font-semibold text-slate-700 block">Registered Entity:</span>
                          <span className="text-slate-900 font-medium">{company.name}</span>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-700 block">Registered Location:</span>
                          <span className="text-slate-600">{company.registeredOffice}</span>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-700 block">Certified Scope:</span>
                          <p className="text-[11px] text-slate-500 font-sans leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                            {cert.scope}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="btn btn-primary text-xs py-2 px-4 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye size={13} /> View Certificate
                      </button>

                      <a
                        href={cert.image}
                        download={`${cert.id}-biolytix.png`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
                      >
                        <Download size={13} /> Download
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quality Framework & Verification Notice ──────────────────────── */}
      <section className="section bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Certificate Verification Notice</h3>
                <p className="text-xs text-slate-500">How to authenticate Biolytix compliance records</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              These certificates are property of <strong>SIGMA CERTIFICATION PTY LTD</strong> and remain valid subject to satisfactory surveillance audits. Healthcare institutions, government procurement agencies, and distribution partners can independently verify the validity of these certificates online at <a href="http://www.sigma-au.com" target="_blank" rel="noopener noreferrer" className="text-cyan-600 font-semibold hover:underline">www.sigma-au.com</a> using certificate numbers <strong>SCPL5037</strong> (ISO 9001:2015) and <strong>SCPL5038</strong> (GDP Compliance).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Certification Body Contact</p>
                <p className="text-slate-600">Sigma Certification Pty Ltd</p>
                <p className="text-slate-500">33, Rookwood Avenue, Coopers Plains, Queensland 4108, Australia</p>
                <p className="text-cyan-600 mt-1">info@sigma-au.com</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Accreditation Board</p>
                <p className="text-slate-600">United States Accreditation Board (USAB)</p>
                <p className="text-slate-500">600 N Broad Street, Middletown, Delaware 19709, USA</p>
                <p className="text-cyan-600 mt-1">Accredited Quality Standard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox / Fullscreen Certificate Modal ──────────────────────── */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{selectedCert.title}</h3>
                    <span className="text-[11px] font-mono text-cyan-400">Certificate No: {selectedCert.certNumber}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedCert.image}
                    download={`${selectedCert.id}-biolytix.png`}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="Download Certificate"
                  >
                    <Download size={18} />
                  </a>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body with Scrollable High-Res Image */}
              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex items-center justify-center bg-slate-950">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="max-w-full h-auto max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-800"
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>Issued to: <strong className="text-white">Biolytix Pharmaceuticals</strong></span>
                <span>Valid: {selectedCert.issueDate} – {selectedCert.validUntil}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
