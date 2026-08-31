import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import PageLoader from '@/components/PageLoader'
import { ScrollRestoration, ScrollToTop } from '@/components/ScrollToTop'
import Home from '@/pages/Home'

const About = lazy(() => import('@/pages/About'))
const Academics = lazy(() => import('@/pages/Academics'))
const Departments = lazy(() => import('@/pages/Departments'))
const Admissions = lazy(() => import('@/pages/Admissions'))
const Placements = lazy(() => import('@/pages/Placements'))
const Facilities = lazy(() => import('@/pages/Facilities'))
const CampusLifePage = lazy(() => import('@/pages/CampusLife'))
const News = lazy(() => import('@/pages/News'))
const GalleryPage = lazy(() => import('@/pages/Gallery'))
const Contact = lazy(() => import('@/pages/Contact'))
const StudentPortal = lazy(() => import('@/pages/StudentPortal'))
const TeacherPortal = lazy(() => import('@/pages/TeacherPortal'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-700 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to main content
      </a>

      <AnnouncementBar />
      <Navbar transparentTop={isHome} />
      <ScrollRestoration />

      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <Home />
                    </PageTransition>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <PageTransition>
                      <About />
                    </PageTransition>
                  }
                />
                <Route
                  path="/academics"
                  element={
                    <PageTransition>
                      <Academics />
                    </PageTransition>
                  }
                />
                <Route
                  path="/departments"
                  element={
                    <PageTransition>
                      <Departments />
                    </PageTransition>
                  }
                />
                <Route
                  path="/admissions"
                  element={
                    <PageTransition>
                      <Admissions />
                    </PageTransition>
                  }
                />
                <Route
                  path="/placements"
                  element={
                    <PageTransition>
                      <Placements />
                    </PageTransition>
                  }
                />
                <Route
                  path="/facilities"
                  element={
                    <PageTransition>
                      <Facilities />
                    </PageTransition>
                  }
                />
                <Route
                  path="/campus-life"
                  element={
                    <PageTransition>
                      <CampusLifePage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/news"
                  element={
                    <PageTransition>
                      <News />
                    </PageTransition>
                  }
                />
                <Route
                  path="/gallery"
                  element={
                    <PageTransition>
                      <GalleryPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PageTransition>
                      <Contact />
                    </PageTransition>
                  }
                />
                <Route
                  path="/student"
                  element={
                    <PageTransition>
                      <StudentPortal />
                    </PageTransition>
                  }
                />
                <Route
                  path="/teacher"
                  element={
                    <PageTransition>
                      <TeacherPortal />
                    </PageTransition>
                  }
                />
                <Route
                  path="*"
                  element={
                    <PageTransition>
                      <NotFound />
                    </PageTransition>
                  }
                />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
