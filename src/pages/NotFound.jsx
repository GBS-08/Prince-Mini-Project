import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

export default function NotFound() {
  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        overlay="linear-gradient(135deg, rgba(13,21,85,0.92), rgba(26,35,126,0.72), rgba(59,130,246,0.45))"
        height="h-[clamp(210px,32vw,320px)]"
        contentClassName="px-6"
        title={
          <>
            <i className="fas fa-compass" aria-hidden="true" /> Page Not Found
          </>
        }
        subtitle="The page you're looking for doesn't exist or has moved"
      />

      <section className="section-block bg-[linear-gradient(135deg,#f0f4f8_0%,#e8f4fd_100%)]">
        <div className="container-page text-center">
          <p className="font-heading text-[clamp(4rem,14vw,8rem)] font-black leading-none text-gradient-brand">404</p>
          <p className="section-subtitle mb-9 mt-4">
            Try one of the links below, or use the navigation at the top of the page.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-home" /> Back to Home
            </Link>
            <Link to="/courses" className="btn btn-secondary">
              <i className="fas fa-book-open" /> Explore Courses
            </Link>
            <Link to="/notice-board" className="btn btn-outline">
              <i className="fas fa-bell" /> Notice Board
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
