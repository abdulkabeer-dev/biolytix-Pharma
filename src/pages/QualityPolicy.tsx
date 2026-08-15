import { Link } from 'react-router-dom'
import { Shield, Award, FlaskConical, AlertTriangle, Truck, TrendingUp, CheckCircle2, ArrowRight, CalendarCheck } from 'lucide-react'
import PageHero from '../components/site/PageHero'
import SectionHeading from '../components/site/SectionHeading'
import Reveal from '../components/site/Reveal'
import { useDataContext } from '../context/DataContext'

const PILLARS = [
  {
    icon: <Shield size={28} />,
    title: 'WHO-GMP Manufacturing',
    desc: 'All our manufacturing units comply with World Health Organization Good Manufacturing Practice guidelines, ensuring every batch meets international quality standards.',
  },
  {
    icon: <Award size={28} />,
    title: 'ISO 9001 & 14001',
    desc: 'Our quality and environmental management systems are certified to ISO 9001:2015 and ISO 14001:2015, demonstrating systematic control of operations and environmental impact.',
  },
  {
    icon: <FlaskConical size={28} />,
    title: 'In-House QC Laboratory',
    desc: 'A fully equipped in-house microbiology and physicochemical testing laboratory enables comprehensive batch analysis — from raw material to finished product.',
  },
  {
    icon: <AlertTriangle size={28} />,
    title: 'Pharmacovigilance',
    desc: 'A structured post-market safety monitoring program tracks adverse events and product performance, safeguarding patient safety throughout the product lifecycle.',
  },
  {
    icon: <Truck size={28} />,
    title: 'Cold-Chain Aware Logistics',
    desc: 'Temperature-sensitive formulations are handled through validated cold-chain logistics protocols, preserving product integrity from the warehouse to the patient.',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Continuous Improvement',
    desc: 'Regular internal audits, management reviews, and CAPA (Corrective and Preventive Action) cycles drive ongoing improvement across all quality systems.',
  },
]

const BATCH_STEPS = [
  { num: '01', title: 'Raw Material Sourcing', desc: 'APIs and excipients procured from approved, audited vendors. Every incoming material undergoes identity and purity testing before acceptance.' },
  { num: '02', title: 'Manufacturing', desc: 'Production carried out in WHO-GMP compliant facilities by trained personnel, following validated Standard Operating Procedures (SOPs) for each dosage form.' },
  { num: '03', title: 'In-Process & Finished QC', desc: 'In-process checks at critical control points plus comprehensive finished product testing — assay, dissolution, microbial limits, and stability — before batch can progress.' },
  { num: '04', title: 'Batch Release', desc: 'Authorised Quality Assurance personnel review all batch documentation and test results. Only batches meeting all specifications are released for distribution.' },
  { num: '05', title: 'Post-Market Vigilance', desc: 'Continued monitoring of product performance and adverse event reports through our pharmacovigilance system, with systematic feedback loops for improvement.' },
]

export default function QualityPolicy() {
  const { company } = useDataContext()
  return (
    <>
      <PageHero
        eyebrow="Quality Assurance"
        title="Quality is a System, Not a Claim."
        description="Our quality framework is built on globally recognized standards, rigorous testing, and an unwavering commitment to patient safety."
        breadcrumbs={[{ label: 'Quality Policy' }]}
        bgImage="/images/heroes/quality.jpg"
      />

      {/* ── Policy Statement ──────────────────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div
              style={{
                background: 'linear-gradient(135deg, var(--brand-muted) 0%, #e0f2fe 100%)',
                border: '1px solid rgba(26,127,193,.2)',
                borderLeft: '4px solid var(--brand)',
                borderRadius: '0 16px 16px 0',
                padding: '2.5rem',
              }}
            >
              <p className="eyebrow mb-4">Our Quality Policy Statement</p>
              <blockquote className="text-base sm:text-lg leading-relaxed italic" style={{ color: 'var(--brand-ink)' }}>
                "Biolytix Pharmaceuticals is committed to manufacturing pharmaceutical products that consistently meet the requirements of our customers, regulatory authorities, and all applicable pharmacopoeial standards. We achieve this through a culture of continuous improvement, robust quality management systems, and the active involvement of every team member in upholding the highest standards of safety, efficacy, and quality — at every stage of the product lifecycle."
              </blockquote>
              <div className="mt-5 flex items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>MD</div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--brand-ink)' }}>Managing Director</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{company.name}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Six Pillars ───────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-alt)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Quality Architecture"
            title="Six Pillars of Quality Assurance"
            description="A layered quality framework that protects every patient and upholds every promise."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="card p-6 h-full">
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--brand-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)', marginBottom: 16 }}>
                    {p.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--brand-ink)' }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Batch Journey ─────────────────────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="From Raw Material to Patient"
            title="The Biolytix Batch Journey"
            description="Five rigorous stages separate every raw material from a released, market-ready medicine."
          />
          <div className="space-y-5">
            {BATCH_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.08}>
                <div className="card flex gap-5 p-5" style={{ borderLeft: '3px solid var(--brand)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-accent) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1" style={{ color: 'var(--brand-ink)' }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Certifications & Official Accreditation Badges */}
          <div className="mt-10 p-6 sm:p-8 rounded-3xl" style={{ background: 'var(--brand-muted)', border: '1px solid rgba(26,127,193,.2)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-blue-200/60">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand">Official Quality Accreditations</p>
                <h3 className="text-lg font-bold text-brand-ink">Verified Compliance & Registration</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5 self-start">
                <CheckCircle2 size={13} className="text-emerald-600" /> Active Compliance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ISO 9001:2015 Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                      ISO 9001:2015
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      Cert: SCPL5037
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Quality Management System</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Marketing of Pharma and Nutraceutical like Tablet, Capsule, Injection, Powders, Sachets, Ointments & Food Supplements.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Accredited: <strong>USAB & Sigma</strong></span>
                  <span className="text-brand font-semibold">Registered</span>
                </div>
              </div>

              {/* GDP Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      GDP Compliance
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      Cert: SCPL5038
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Good Distribution Practice</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Assessed and certified for sterile handling, warehouse integrity, and distribution protocols for finished formulations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Audited: <strong>Sigma Certification</strong></span>
                  <span className="text-emerald-700 font-semibold">Verified</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-blue-200/50">
              {company.certifications.map((c: string) => (
                <div key={c} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-semibold text-slate-700 border border-slate-200">
                  <CheckCircle2 size={12} className="text-brand" /> {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark CTA ─────────────────────────────────────────────────────── */}
      <section className="section brand-gradient-ink text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <p className="eyebrow-dark mb-3">Transparency & Partnerships</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
              Want to Audit Our Quality Systems?
            </h2>
            <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,.7)' }}>
              We welcome quality audits from distributors, hospital procurement teams, and regulatory bodies. Schedule a plant visit or request our quality dossier.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn" style={{ background: 'var(--brand-accent)', color: '#0a2540', fontWeight: 700 }}>
                <CalendarCheck size={16} /> Schedule a Visit
              </Link>
              <Link to="/contact" className="btn btn-outline-white">
                Request Quality Dossier <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
