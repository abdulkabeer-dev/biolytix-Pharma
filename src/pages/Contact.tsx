import { useState, type FormEvent } from 'react'
import { MapPin, Phone, Smartphone, Mail, Clock, Globe, Send, CheckCircle2 } from 'lucide-react'
import PageHero from '../components/site/PageHero'
import Reveal from '../components/site/Reveal'
import BrandLogo from '../components/site/BrandLogo'
import { useDataContext } from '../context/DataContext'

const SUBJECTS = [
  'Distribution Partnership',
  'Product Inquiry',
  'Dossier Request',
  'Hospital & Institutional Supply',
  'Quality & Regulatory',
  'Other',
]

type FormState = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function Contact() {
  const { company, addInquiry } = useDataContext()
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const INFO_CARDS = [
    {
      icon: <MapPin size={22} />,
      title: 'Registered Office',
      lines: [company.registeredOffice],
    },
    {
      icon: <Phone size={22} />,
      title: 'Phone & Mobile',
      lines: [company.phone, company.altPhone || company.mobile || '+91 79934 67911'],
      isPhone: true,
    },
    {
      icon: <Mail size={22} />,
      title: 'Email & Web',
      lines: [company.email, company.website],
      isEmail: true,
    },
    {
      icon: <Clock size={22} />,
      title: 'Working Hours',
      lines: [company.workingHours, 'Closed on Sundays & National Holidays'],
    },
  ]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const success = await addInquiry({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject || 'General Inquiry',
      message: form.message,
    })
    setLoading(false)
    if (success) {
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Talk to Our Team About Partnerships and Supply."
        description="Whether you're a distributor, hospital buyer, or regulatory partner — we're ready to discuss how Biolytix can serve you."
        breadcrumbs={[{ label: 'Contact Us' }]}
        bgImage="/images/heroes/contact.jpg"
      />

      {/* ── Info Cards ───────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-alt)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INFO_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.08}>
                <div className="card p-6 h-full">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--brand-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)', marginBottom: 14 }}>
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--brand-ink)' }}>{card.title}</h3>
                  {card.lines.map((line, j) =>
                    card.isPhone ? (
                      <a key={j} href={`tel:${line}`} className="block text-sm mb-1 hover:text-brand transition-colors" style={{ color: 'var(--text-muted)' }}>{line}</a>
                    ) : card.isEmail && j === 0 ? (
                      <a key={j} href={`mailto:${line}`} className="block text-sm mb-1 hover:text-brand transition-colors" style={{ color: 'var(--text-muted)' }}>{line}</a>
                    ) : (
                      <p key={j} className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{line}</p>
                    )
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visiting Card + Map ───────────────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10">

          {/* Visiting card styled panel */}
          <Reveal direction="left">
            <div
              style={{
                background: 'linear-gradient(135deg, var(--brand-ink) 0%, var(--brand-deep) 100%)',
                borderRadius: 24,
                padding: '2.5rem',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative rings */}
              {[200, 280, 360].map(s => (
                <div key={s} style={{ position: 'absolute', right: -s/3, top: -s/4, width: s, height: s, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
              ))}

              <BrandLogo dark size="lg" />

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,.5)' }}>Contact Details</p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <MapPin size={15} style={{ color: 'var(--brand-accent)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,.5)' }}>Registered Office</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>{company.registeredOffice}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin size={15} style={{ color: 'var(--brand-accent)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,.5)' }}>Correspondence Office</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>{company.correspondenceOffice}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone size={15} style={{ color: 'var(--brand-accent)' }} />
                    <a href={`tel:${company.phone}`} className="text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>{company.phone}</a>
                  </div>
                  <div className="flex gap-3">
                    <Smartphone size={15} style={{ color: 'var(--brand-accent)' }} />
                    <a href={`tel:${company.mobile}`} className="text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>{company.mobile}</a>
                  </div>
                  <div className="flex gap-3">
                    <Mail size={15} style={{ color: 'var(--brand-accent)' }} />
                    <a href={`mailto:${company.email}`} className="text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>{company.email}</a>
                  </div>
                  <div className="flex gap-3">
                    <Globe size={15} style={{ color: 'var(--brand-accent)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>{company.website}</p>
                  </div>
                  <div className="flex gap-3">
                    <Clock size={15} style={{ color: 'var(--brand-accent)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>{company.workingHours}</p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="flex flex-wrap gap-2">
                  {(company.certifications || []).map((c: string) => (
                    <span key={c} className="cert-chip">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal direction="right">
            <div style={{ height: '100%', minHeight: 360, borderRadius: 24, overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
              {/* Map placeholder */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e8f4fd 0%, #dbeafe 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                {/* Simple map illustration */}
                <div style={{ position: 'relative' }}>
                  <svg width="200" height="180" viewBox="0 0 200 180" fill="none">
                    <rect x="20" y="20" width="160" height="140" rx="12" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
                    {/* Roads */}
                    <line x1="20" y1="90" x2="180" y2="90" stroke="#bfdbfe" strokeWidth="6"/>
                    <line x1="100" y1="20" x2="100" y2="160" stroke="#bfdbfe" strokeWidth="6"/>
                    <line x1="20" y1="60" x2="180" y2="120" stroke="#bfdbfe" strokeWidth="3"/>
                    {/* Location pin */}
                    <circle cx="100" cy="85" r="12" fill="var(--brand)" opacity=".9"/>
                    <circle cx="100" cy="85" r="5" fill="#fff"/>
                    <line x1="100" y1="97" x2="100" y2="110" stroke="var(--brand)" strokeWidth="2.5"/>
                    {/* Location pulse */}
                    <circle cx="100" cy="85" r="20" stroke="var(--brand)" strokeWidth="1" opacity=".3"/>
                    <circle cx="100" cy="85" r="28" stroke="var(--brand)" strokeWidth="0.5" opacity=".15"/>
                  </svg>
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--brand-ink)' }}>Shadnagar, Ranga Reddy District, Telangana</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>18-394/2/G/4, Mallikarjuna Colony, Shadnagar – 509216</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Mallikarjuna+Colony+Shadnagar+Ranga+Reddy+Telangana+509216"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-sm"
                >
                  <MapPin size={14} /> Get Directions
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Inquiry Form ─────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-alt)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="eyebrow mb-2">Enquiry Form</p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>Send Us a Message</h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>For partnerships, product inquiries, or quality-related queries — fill in the form below.</p>
          </div>

          {submitted ? (
            <Reveal>
              <div className="card p-10 text-center">
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-ink)' }}>Message Received!</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Thank you for reaching out to Biolytix Pharmaceuticals. Our team will respond within 1-2 business days.</p>
                <button className="btn btn-outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}>
                  Send Another Message
                </button>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--brand-ink)' }}>Full Name <span style={{ color: '#f43f5e' }}>*</span></label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Dr. Ravi Kumar"
                      className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all"
                      style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                      onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,127,193,.12)' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--brand-ink)' }}>Email Address <span style={{ color: '#f43f5e' }}>*</span></label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="ravi@hospital.com"
                      className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all"
                      style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                      onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,127,193,.12)' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--brand-ink)' }}>Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all"
                      style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                      onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,127,193,.12)' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--brand-ink)' }}>Subject <span style={{ color: '#f43f5e' }}>*</span></label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all"
                      style={{ borderColor: '#e2e8f0', background: '#f8fafc', color: form.subject ? 'var(--text)' : 'var(--text-muted)' }}
                      onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,127,193,.12)' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
                    >
                      <option value="">Select a subject...</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--brand-ink)' }}>Message <span style={{ color: '#f43f5e' }}>*</span></label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about your requirements — products, quantities, region, or any other details..."
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all resize-none"
                    style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                    onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,127,193,.12)' }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full justify-center text-sm py-3"
                  style={{ opacity: loading ? 0.75 : 1 }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity=".25"/>
                        <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><Send size={15} /> Send Message</span>
                  )}
                </button>

                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  We typically respond within 1-2 business days. For urgent matters, call <a href={`tel:${company.phone}`} className="text-brand font-semibold">{company.phone}</a>.
                </p>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
