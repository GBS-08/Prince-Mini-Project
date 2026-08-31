import { courses } from './courses'

const departmentMeta = {
  'btech-cse': {
    icon: 'Code2',
    focus: ['Software Engineering', 'Artificial Intelligence', 'Networks'],
  },
  'btech-aids': {
    icon: 'BrainCircuit',
    focus: ['Machine Learning', 'Big Data Analytics', 'NLP'],
  },
  'btech-cyber': {
    icon: 'ShieldCheck',
    focus: ['Ethical Hacking', 'Cryptography', 'Digital Forensics'],
  },
  'btech-ece': {
    icon: 'RadioTower',
    focus: ['VLSI Design', 'Embedded Systems', 'Signal Processing'],
  },
  'btech-eee': {
    icon: 'Zap',
    focus: ['Power Systems', 'Control Systems', 'Renewable Energy'],
  },
  'btech-mech': {
    icon: 'Cog',
    focus: ['Design & Manufacturing', 'Thermal Engineering', 'CAD/CAM'],
  },
  'btech-civil': {
    icon: 'Building2',
    focus: ['Structural Engineering', 'Construction Management', 'Geo-Technical'],
  },
  'mtech-cse': {
    icon: 'Cpu',
    focus: ['Cloud Computing', 'Advanced Algorithms', 'Research'],
  },
  'mtech-vlsi': {
    icon: 'CircuitBoard',
    focus: ['CMOS Design', 'Semiconductor Technology', 'HDL'],
  },
  mba: {
    icon: 'Briefcase',
    focus: ['Marketing', 'Finance', 'Human Resources'],
  },
}

export const departments = courses.map((course) => ({
  id: course.id,
  name: course.shortTitle,
  degree: course.degree,
  level: course.level,
  duration: course.duration,
  seats: course.seats,
  description: course.description,
  summary: course.summary,
  image: course.image,
  link: course.link,
  icon: departmentMeta[course.id]?.icon ?? 'GraduationCap',
  focus: departmentMeta[course.id]?.focus ?? [],
}))

export const supportingDepartments = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
]
