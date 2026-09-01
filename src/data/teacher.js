/** Teacher portal option lists (verbatim from the original Teacher.js). */
export const TEACHER_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Cyber Security',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'MBA',
  'M.Tech CSE',
  'M.Tech VLSI',
]

export const DESIGNATIONS = [
  'Professor & Head',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer',
  'Lab Instructor',
  'Teaching Assistant',
]

export const EXAM_TYPES = [
  { id: 'ciat1', label: 'CIAT – I', icon: 'fas fa-pencil-alt' },
  { id: 'ciat2', label: 'CIAT – II', icon: 'fas fa-pen-nib' },
  { id: 'final', label: 'Final Exam', icon: 'fas fa-graduation-cap', longLabel: 'Final Examination' },
]

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
export const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]

export const ordinal = (n) => ({ 1: 'st', 2: 'nd', 3: 'rd', 4: 'th' })[n] || 'th'

export const formatDate = (value) => {
  if (!value) return '—'
  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

export const formatDateFull = (value) => {
  if (!value) return '—'
  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return value
  }
}
