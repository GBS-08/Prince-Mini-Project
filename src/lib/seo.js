import { college } from '@/data/college'

const SITE_NAME = college.name
const DEFAULT_IMAGE = college.logo

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function applySeo({ title, description, keywords, image = DEFAULT_IMAGE, path = '/' }) {
  const fullTitle = title ? `${title} | ${college.shortName}` : SITE_NAME
  const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path

  document.title = fullTitle
  upsertMeta('name', 'description', description)
  upsertMeta('name', 'keywords', keywords)
  upsertMeta('property', 'og:title', fullTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:image', image)
  upsertMeta('property', 'og:url', url)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', fullTitle)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', image)
  upsertCanonical(url)
}

export const pageSeo = {
  home: {
    title: 'Engineering & Technology in Chennai',
    description:
      'Prince Dr K Vasudevan College of Engineering and Technology — NAAC A+ accredited, Anna University affiliated, AICTE approved. 65-acre campus at Ponmar, Chennai. TNEA Code 4116.',
    keywords:
      'PDKV College, Prince Dr K Vasudevan College, engineering college Chennai, TNEA 4116, Anna University affiliated, NAAC A+',
  },
  about: {
    title: 'About Us',
    description:
      "Learn about Prince Dr K Vasudevan College's history since 2009, vision, mission, NAAC A+ accreditation and Anna University affiliation.",
    keywords: 'about PDKV College, vision mission, NAAC A+, AICTE approved, ISO 9001:2015',
  },
  academics: {
    title: 'Academic Programs',
    description:
      'Explore B.Tech, M.Tech and MBA programs at Prince Dr K Vasudevan College — CSE, AI & Data Science, Cyber Security, ECE, EEE, Mechanical, Civil, VLSI Design and MBA.',
    keywords: 'B.Tech Chennai, M.Tech VLSI, MBA Chennai, engineering courses, PDKV academics',
  },
  departments: {
    title: 'Departments',
    description:
      'Departments at Prince Dr K Vasudevan College: Computer Science, AI & Data Science, Cyber Security, ECE, EEE, Mechanical, Civil Engineering and Management Studies.',
    keywords: 'engineering departments Chennai, CSE, AIDS, cyber security, ECE, EEE, mechanical, civil',
  },
  admissions: {
    title: 'Admissions 2026–27',
    description:
      'Admission process, eligibility, required documents and online application for B.Tech, M.Tech and MBA programs at PDKV College. TNEA Code 4116.',
    keywords: 'engineering admission Chennai, TNEA 4116, TANCET, apply online, B.Tech admission',
  },
  placements: {
    title: 'Placements',
    description:
      'Placement highlights at Prince Dr K Vasudevan College — 82.3% placement rate for 2024-25 with recruiters including TCS, Infosys, Wipro, Zoho, Amazon and Microsoft.',
    keywords: 'PDKV placements, engineering placements Chennai, top recruiters, campus placement',
  },
  facilities: {
    title: 'Campus Facilities',
    description:
      'Hostel, sports complex, smart classrooms, laboratories, central library, auditorium, canteen and transport facilities across the 65-acre PDKV campus.',
    keywords: 'college hostel Chennai, engineering labs, campus facilities, library, sports complex',
  },
  campusLife: {
    title: 'Campus Life',
    description:
      'Clubs, cultural festivals, technical events, hackathons, sports and student organisations at Prince Dr K Vasudevan College.',
    keywords: 'campus life, student clubs, hackathon, cultural events, NSS, NCC',
  },
  news: {
    title: 'News & Notice Board',
    description:
      'Latest notices, events and exam announcements from Prince Dr K Vasudevan College of Engineering and Technology.',
    keywords: 'college notices, exam announcements, campus events, notice board',
  },
  gallery: {
    title: 'Gallery',
    description:
      'Photo gallery of the Prince Dr K Vasudevan College campus, infrastructure, events, sports and student activities.',
    keywords: 'college gallery, campus photos, PDKV images',
  },
  contact: {
    title: 'Contact Us',
    description:
      'Contact Prince Dr K Vasudevan College of Engineering and Technology — Medavakkam-Mambakkam Main Road, Ponmar, Chennai 600 127. Phone +91 44-2242 0129.',
    keywords: 'contact PDKV College, Ponmar Chennai, college address, admission enquiry',
  },
  student: {
    title: 'Student Portal',
    description:
      'Student portal for Prince Dr K Vasudevan College — view your profile, attendance, exam results and achievements.',
    keywords: 'student portal, attendance, results, PDKV',
  },
  teacher: {
    title: 'Teacher Portal',
    description:
      'Teacher portal for Prince Dr K Vasudevan College — manage classrooms, mark attendance and record exam data.',
    keywords: 'teacher portal, attendance management, classrooms, PDKV',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found.',
  },
}
