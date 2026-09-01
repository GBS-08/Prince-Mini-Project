import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollProgressBar from './ScrollProgressBar'
import BackToTop from './BackToTop'
import ScrollToTop from './ScrollToTop'
import LoadingScreen from './LoadingScreen'
import ErrorBoundary from './ErrorBoundary'
import AuthModal from './auth/AuthModal'

/** Shared page chrome: header, routed content, footer and the global widgets. */
export default function Layout() {
  const { pathname } = useLocation()

  return (
    <>
      <ScrollProgressBar />
      <ScrollToTop />
      <Navbar />

      <main id="main-content" key={pathname} className="animate-page-fade-in">
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <BackToTop />
      <AuthModal />
    </>
  )
}
