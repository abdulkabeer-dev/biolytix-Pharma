import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Target, Eye, Heart, Zap, TrendingUp, Building2, FlaskConical, Award, Users } from 'lucide-react'
import PageHero from '../components/site/PageHero'
import SectionHeading from '../components/site/SectionHeading'
import Reveal from '../components/site/Reveal'
import BiolytixAcronym from '../components/site/BiolytixAcronym'
import { useDataContext } from '../context/DataContext'

const VALUES = [
  { icon: <CheckCircle2 size={24} />, title: 'Integrity', desc: 'We uphold the highest standards of honesty and transparency in every batch we manufacture and every relationship we build.' },
  { icon: <Zap size={24} />, title: 'Scientific Rigour', desc: 'Evidence-based formulation development and rigorous quality testing underpin every product in our portfolio.' },
  { icon: <Heart size={24} />, title: 'Patient First', desc: 'Every decision — from ingredient sourcing to packaging — is made with patient safety and therapeutic efficacy as the top priority.' },
  { icon: <TrendingUp size={24} />, title: 'Continuous Improvement', desc: 'We invest in people, processes, and technology to raise our quality standards year on year.' },
]

const MILESTONES = [
  {
    year: '2024',
    title: 'Company Established',
    desc: 'Biolytix Pharmaceuticals is established in Shadnagar, Telangana with a vision to deliver premium quality, evidence-based medicines.',
    icon: <Building2 size={20} />,
    color: '#1a7fc1',
  },
  {
    year: '2024',
    title: 'ISO 9001:2015 & GDP Certified',
    desc: 'Awarded ISO 9001:2015 (Cert: SCPL5037) and GDP Compliance (Cert: SCPL5038) accredited by USAB & Sigma Certification Pty Ltd.',
    icon: <Award size={20} />,
    color: '#0ea5e9',
  },
  {
    year: '2025',
    title: '8 Therapeutic Divisions',
    desc: 'Expanded marketing operations across 8 core therapy areas covering 73+ DCGI-approved pharmaceutical formulations.',
    icon: <FlaskConical size={20} />,
    color: '#10b981',
  },
  {
    year: '2026',
    title: 'Nationwide Distribution',
    desc: 'Connecting with 5,000+ physicians, clinics, hospitals, and distribution partners across India.',
    icon: <Users size={20} />,
    color: '#a855f7',
  },
]

export default function About() {
  const { company, medicines, divisions } = useDataContext()
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={`A Reputation Built on Quality, Established ${company.foundingYear || 2024}.`}
        description="Biolytix Pharmaceuticals was established with one goal: to make high-quality, responsibly manufactured medicines accessible across India."
        breadcrumbs={[{ label: 'About Us' }]}
        bgImage="/images/heroes/about.jpg"
      />

      {/* ── Our Story ────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal direction="left">
            <p className="eyebrow mb-3">Who We Are</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: 'var(--brand-ink)' }}>
              Trusted by Physicians. Chosen by Patients.
            </h2>
            <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <p>
                Established in {company.foundingYear || 2024}, Biolytix Pharmaceuticals is an ISO 9001:2015 certified and GDP (Good Distribution Practice) compliant pharmaceutical and nutraceutical marketing organization headquartered in Telangana, India.
              </p>
              <p>
                Our specialized portfolio spans {divisions.length} therapeutic divisions — including anti-infectives, cardiac care, analgesics, gastro-intestinals, respiratory care, multivitamins, dermatology, and ophthalmic preparations — with {medicines.length}+ active approved formulations marketed across India.
              </p>
              <p>
                Operating in full compliance with global standards accredited by the United States Accreditation Board (USAB) and Sigma Certification Pty Ltd, Biolytix delivers tablets, capsules, injections, powders, sachets, ointments, and nutritional supplements manufactured under rigorous GMP protocols.
              </p>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative">
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--brand-muted) 0%, #e0f2fe 100%)',
                  borderRadius: 24,
                  padding: '2.5rem',
                  border: '1px solid rgba(26,127,193,0.15)',
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: `Est. ${company.foundingYear || 2024}`, label: 'Established Year' },
                    { val: `${divisions.length}`, label: 'Therapeutic Divisions' },
                    { val: `${medicines.length}+`, label: 'Approved Formulations' },
                    { val: '5,000+', label: 'Healthcare Partners' },
                  ].map(s => (
                    <motion.div
                      key={s.label}
                      whileHover={{ scale: 1.03 }}
                      style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(26,127,193,.08)', cursor: 'default' }}
                    >
                      <p className="text-xl sm:text-2xl font-extrabold" style={{ color: 'var(--brand)' }}>{s.val}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </motion.div>
                  ))}
                </div>
                <div
                  className="mt-4"
                  style={{
                    background: 'var(--brand-ink)',
                    borderRadius: 14,
                    padding: '1rem 1.25rem',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <CheckCircle2 size={24} style={{ color: 'var(--brand-accent)' }} />
                  <div>
                    <p className="text-sm font-bold">ISO 9001:2015 & GDP Certified</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,.65)' }}>Cert: SCPL5037 / SCPL5038 · USAB Accredited</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Biolytix Acronym & Marketing Section ──────────────────────────── */}
      <BiolytixAcronym />

      {/* ── Mission & Vision ─────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-alt)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading eyebrow="Our Direction" title="Mission & Vision" />
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal delay={0}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="card p-8 h-full">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: 'var(--brand)' }}>
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-ink)' }}>Our Mission</h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  To manufacture and deliver safe, efficacious, and affordable pharmaceutical formulations that improve the quality of life for patients across India — while upholding the highest standards of quality, compliance, and environmental responsibility.
                </p>
              </motion.div>
            </Reveal>
            <Reveal delay={0.1}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="card p-8 h-full" style={{ borderColor: 'var(--brand)', boxShadow: '0 4px 20px rgba(26,127,193,.1)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: 'var(--brand)' }}>
                  <Eye size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-ink)' }}>Our Vision</h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  To become one of India's most trusted pharmaceutical manufacturing companies — renowned for consistent quality, innovation, and a patient-centric approach to healthcare delivery that extends beyond borders.
                </p>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Core Values"
            description="The principles that guide every decision we make — from the lab to the patient."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }} className="card p-6 h-full">
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--brand-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: 'var(--brand)' }}>
                    {v.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--brand-ink)' }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Milestones — Professional Vertical Timeline ────────────────── */}
      <section className="section brand-gradient-ink" style={{ overflow: 'hidden' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeading dark eyebrow="Our Journey" title="Key Milestones" description="Growth driven by quality excellence, regulatory compliance, and rapid healthcare expansion." />

          <div className="relative mt-12">
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 2,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, var(--brand) 0%, var(--brand-accent) 50%, rgba(255,255,255,0.15) 100%)',
            }} />

            <div className="space-y-10">
              {MILESTONES.map((m, i) => {
                const isLeft = i % 2 === 0
                return (
                  <motion.div
                    key={`${m.year}-${i}`}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                    className="relative flex items-center"
                    style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}
                  >
                    <div
                      style={{
                        width: 'calc(50% - 48px)',
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 18,
                        padding: '1.5rem 1.75rem',
                        position: 'relative',
                        boxShadow: '0 4px 20px rgba(0,0,0,.2)',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        [isLeft ? 'right' : 'left']: -10,
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderTop: '10px solid transparent',
                        borderBottom: '10px solid transparent',
                        [isLeft ? 'borderLeft' : 'borderRight']: '10px solid rgba(255,255,255,0.12)',
                      }} />

                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: `${m.color}25`,
                        border: `1px solid ${m.color}50`,
                        borderRadius: 8,
                        padding: '3px 10px',
                        marginBottom: 10,
                      }}>
                        <span style={{ color: m.color, fontSize: 13, fontWeight: 800 }}>{m.year}</span>
                      </div>

                      <h3 className="font-bold text-white mb-2" style={{ fontSize: 16 }}>{m.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{m.desc}</p>
                    </div>

                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}bb 100%)`,
                      border: '3px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: `0 0 0 6px ${m.color}20, 0 6px 24px rgba(0,0,0,.35)`,
                      zIndex: 2,
                      flexShrink: 0,
                    }}>
                      {m.icon}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div style={{
              display: 'flex', justifyContent: 'center', marginTop: 40,
            }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-accent) 100%)',
                borderRadius: 9999,
                padding: '8px 24px',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                boxShadow: '0 4px 20px rgba(26,127,193,.5)',
              }}>
                Our Journey Continues...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-alt)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold mb-5" style={{ color: 'var(--brand-ink)' }}>Ready to Partner with Biolytix?</h2>
            <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
              Let's discuss distribution, hospital supply, or institutional partnerships.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn btn-primary">Talk to Our Team</Link>
              <Link to="/products" className="btn btn-outline">Explore Products <ArrowRight size={14} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
