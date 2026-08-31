export const admissionSteps = [
  {
    step: '01',
    title: 'Check Eligibility',
    description:
      'Confirm you meet the academic requirements for your chosen B.Tech, M.Tech or MBA programme.',
    icon: 'ClipboardCheck',
  },
  {
    step: '02',
    title: 'Submit Application',
    description:
      'Complete the online application form with your personal, academic and course preference details.',
    icon: 'FileText',
  },
  {
    step: '03',
    title: 'Document Verification',
    description:
      'Our admissions team verifies your marksheets, certificates and entrance scores.',
    icon: 'FileSearch',
  },
  {
    step: '04',
    title: 'Admission Process',
    description:
      'Counselling through TNEA / TANCET or the management quota based on your application.',
    icon: 'Users',
  },
  {
    step: '05',
    title: 'Confirm Enrollment',
    description:
      'Pay the fees, complete the joining formalities and begin your journey at PDKV.',
    icon: 'CheckCircle2',
  },
]

export const eligibility = [
  {
    programme: 'B.Tech (UG)',
    icon: 'GraduationCap',
    requirements: [
      'Pass in 10+2 with Physics, Chemistry and Mathematics',
      'Admission through TNEA counselling (TNEA Code 4116) or management quota',
      'Lateral entry available for diploma holders in Mechanical Engineering',
    ],
  },
  {
    programme: 'M.Tech (PG)',
    icon: 'Cpu',
    requirements: [
      'B.E. / B.Tech degree in a relevant discipline',
      'Admission through TANCET / GATE score',
      'M.Tech CSE has 9 seats and M.Tech VLSI Design has 18 seats',
    ],
  },
  {
    programme: 'MBA',
    icon: 'Briefcase',
    requirements: [
      'Bachelor degree in any discipline from a recognised university',
      'Admission through TANCET counselling or management quota',
      'Specialisations in Marketing, Finance and Human Resources',
    ],
  },
]

export const requiredDocuments = [
  '10th Standard marksheet and certificate',
  '12th Standard marksheet and certificate',
  'Transfer Certificate (TC)',
  'Community / Category certificate',
  'Entrance exam scorecard (TNEA / TANCET / GATE), if applicable',
  'Passport size photographs',
  'Aadhaar card copy',
  'UG degree and consolidated marksheet (for PG applicants)',
]

export const applicantTypes = [
  { value: 'UG', label: 'UG (B.Tech / Arts)', icon: 'University' },
  { value: 'PG', label: 'PG (M.Tech / MBA)', icon: 'GraduationCap' },
]

export const boards = [
  'Tamil Nadu State Board',
  'CBSE',
  'ICSE',
  'Matriculation',
  'Other',
]

export const streams = ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts']

export const categories = ['OC', 'BC', 'MBC', 'SC', 'ST']

export const quotas = ['Government (TNEA)', 'Management']

export const entranceExams = ['TNEA', 'TANCET', 'GATE', 'JEE Main', 'Other']

export const genders = ['Male', 'Female', 'Other']
