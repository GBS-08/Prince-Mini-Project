import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Courses = lazy(() => import('./pages/Courses'))
const Facilities = lazy(() => import('./pages/Facilities'))
const NoticeBoard = lazy(() => import('./pages/NoticeBoard'))
const Student = lazy(() => import('./pages/Student'))
const Teacher = lazy(() => import('./pages/Teacher'))
const Ads = lazy(() => import('./pages/Ads'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Central route table — every page is code-split behind React.lazy. */
export const routes = [
  { path: '/', element: <Home />, title: 'Home' },
  { path: '/about', element: <About />, title: 'About Us' },
  { path: '/courses', element: <Courses />, title: 'Courses' },
  { path: '/facilities', element: <Facilities />, title: 'Facilities' },
  { path: '/notice-board', element: <NoticeBoard />, title: 'Notice Board' },
  { path: '/student', element: <Student />, title: 'Student Portal' },
  { path: '/teacher', element: <Teacher />, title: 'Teacher Portal' },
  { path: '/ads', element: <Ads />, title: 'Advertisements' },
]

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {/* Legacy .html deep links from the pre-React site keep working. */}
        <Route path="/index.html" element={<Home />} />
        <Route path="/About.html" element={<About />} />
        <Route path="/Courses.html" element={<Courses />} />
        <Route path="/Facilities.html" element={<Facilities />} />
        <Route path="/NoticeBoard.html" element={<NoticeBoard />} />
        <Route path="/notices" element={<NoticeBoard />} />
        <Route path="/Student.html" element={<Student />} />
        <Route path="/Teacher.html" element={<Teacher />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
