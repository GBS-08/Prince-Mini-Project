/** Static content for the About page — taken verbatim from the old About.html. */

export const aboutParagraphs = [
  {
    id: 'intro',
    content: (
      <>
        <strong>Prince Dr K Vasudevan College of Engineering and Technology</strong>, established in 2009, is a premier
        institution dedicated to excellence in engineering education and research. Located on a serene 65-acre campus in
        Ponmar, Chennai, the college offers state-of-the-art facilities and a vibrant campus life.
      </>
    ),
  },
  {
    id: 'mission',
    content: (
      <>
        Our mission is to nurture innovative minds and equip students with the skills needed to excel in the
        ever-evolving field of technology. With a team of experienced faculty members and strong industry
        collaborations, we strive to provide a holistic learning experience that fosters creativity, critical thinking,
        and professional growth.
      </>
    ),
  },
  {
    id: 'accreditation',
    content: (
      <>
        Affiliated with Anna University and approved by AICTE, the college holds a prestigious{' '}
        <strong>NAAC A+ Grade</strong> accreditation, reflecting our commitment to academic quality, research
        excellence, and student development.
      </>
    ),
  },
]

export const aboutHighlights = [
  'Anna University Affiliated — TNEA Code 4116',
  'NAAC A+ Accredited until 2029',
  'AICTE Approved & ISO 9001:2015 Certified',
  'Over 14 Years of Educational Excellence',
]

export const aboutStats = [
  { icon: 'fas fa-calendar-alt', tone: 'green', value: 14, label: 'Years of Excellence' },
  { icon: 'fas fa-users', tone: 'blue', value: 2452, label: 'Students Enrolled' },
  { icon: 'fas fa-chalkboard-teacher', tone: 'gold', value: 183, label: 'Faculty Members' },
  { icon: 'fas fa-building', tone: 'teal', value: 60, label: 'Acres Campus' },
]

export const missionPoints = [
  'Provide quality education with a practical orientation',
  'Foster research, innovation and entrepreneurship',
  'Collaborate with industry for real-world learning',
  'Develop well-rounded professionals with strong ethics',
  'Promote inclusive and sustainable development',
]

export const visionText =
  'To be a globally recognized institution of excellence, producing technically competent and ethically grounded engineers who contribute meaningfully to society and drive technological innovation.'

export const contactCards = [
  {
    icon: 'fas fa-map-marker-alt',
    title: 'Address',
    lines: [
      'Prince Dr K Vasudevan College of Engineering and Technology',
      'Medavakkam-Mambakkam Main Road',
      'Ponmar, Chennai - 600 127, Tamil Nadu',
    ],
    link: {
      href: 'https://maps.google.com/?q=Prince+Dr+K+Vasudevan+College+of+Engineering+and+Technology,+Ponmar,+Chennai',
      icon: 'fas fa-directions',
      label: 'Get Directions',
      external: true,
    },
  },
  {
    icon: 'fas fa-phone-alt',
    title: 'Phone',
    lines: ['+91 44-2242 0129', '+91 44-2246 1478'],
    link: { href: 'tel:+914422420129', icon: 'fas fa-phone', label: 'Call Now' },
  },
  {
    icon: 'fas fa-envelope',
    title: 'Email',
    lines: ['princedrkvasudevan@gmail.com'],
    link: { href: 'mailto:princedrkvasudevan@gmail.com', icon: 'fas fa-paper-plane', label: 'Send Email' },
  },
  {
    icon: 'fas fa-globe',
    title: 'Website',
    lines: ['www.princedrkvasudevan.ac.in', 'TNEA Code: 4116'],
    link: {
      href: 'https://www.princedrkvasudevan.com',
      icon: 'fas fa-external-link-alt',
      label: 'Visit Site',
      external: true,
    },
  },
]

export const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.5!2d80.2!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525c12b32c3e85%3A0xda69d76e2d7b4d4f!2sPrince%20Dr%20K%20Vasudevan%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1234567890'
