// ─── Company Data ────────────────────────────────────────────────────────────
// Single source of truth — update here and it propagates everywhere.

export interface CompanyInfo {
  name: string
  shortName?: string
  tagline: string
  foundingYear?: number
  registeredOffice: string
  correspondenceOffice: string
  phone: string
  mobile?: string
  altPhone?: string
  email: string
  website: string
  workingHours: string
  certifications: string[]
  yearsOfExcellence?: number
  divisionsCount?: number
  formulationsCount?: string
  distributionPartners?: string
  isoCertNumber?: string
  gdpCertNumber?: string
}

export const company: CompanyInfo = {
  name: "Biolytix Pharmaceuticals",
  shortName: "Biolytix",
  tagline: "Quality pharmaceuticals, responsibly manufactured.",
  foundingYear: 2024,

  // ── Contact ───────────────────────────────────────────────────────────────
  registeredOffice:
    "18-394/2/G/4, Mallikarjuna Colony, Shadnagar, Ranga Reddy – 509216, Telangana, India",
  correspondenceOffice:
    "18-394/2/G/4, Mallikarjuna Colony, Shadnagar, Ranga Reddy – 509216, Telangana, India",
  phone: "+91 93473 34911",
  mobile: "+91 79934 67911",
  altPhone: "+91 79934 67911",
  email: "biolytixpharmaceuticals@gmail.com",
  website: "www.biolytixpharma.com",
  workingHours: "Mon – Sat: 9:00 AM – 6:00 PM",

  // ── Certifications (ISO 9001:2015 & GDP Certified) ───────────────────────
  certifications: ["ISO 9001:2015", "GDP Compliant", "WHO-GMP", "USAB Accredited"],
  isoCertNumber: "SCPL5037",
  gdpCertNumber: "SCPL5038",

  yearsOfExcellence: Math.max(1, new Date().getFullYear() - 2024 || 2),
  divisionsCount: 8,
  formulationsCount: "73+",
  distributionPartners: "5,000+",
}
