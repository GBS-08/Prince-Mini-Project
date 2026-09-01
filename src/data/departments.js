/** Departments offered — shared by the student and teacher portals. */
export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Cyber Security',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Master of Business Administration',
  'M.Tech Computer Science & Engineering',
  'M.Tech VLSI Design',
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
]

export const YEAR_SUFFIX = ['', 'st', 'nd', 'rd', 'th']

export const yearLabel = (year) => `${year}${YEAR_SUFFIX[year] || 'th'} Year`
