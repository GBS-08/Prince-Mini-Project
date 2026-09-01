import Hero from '../sections/home/Hero'
import AboutFacts from '../sections/home/AboutFacts'
import CampusGallery from '../sections/home/CampusGallery'
import Placements from '../sections/home/Placements'
import StudentSupport from '../sections/home/StudentSupport'
import FloatingAds from '../components/FloatingAds'
import usePageMeta from '../hooks/usePageMeta'

export default function Home() {
  usePageMeta({
    title: 'Prince Dr K Vasudevan College of Engineering and Technology',
    description:
      'Premier engineering college in Chennai. NAAC A+ accredited, Anna University affiliated. Explore B.Tech, M.Tech, MBA programs.',
  })

  return (
    <>
      <Hero />

      {/* Wave separator between the hero and the first content section */}
      <div className="-mt-0.5 block w-full overflow-hidden leading-[0] [background:linear-gradient(135deg,#f0f4f8,#e3f2fd)]">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          aria-hidden="true"
        >
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="rgba(10,15,60,0.72)" />
        </svg>
      </div>

      <AboutFacts />
      <CampusGallery />
      <Placements />
      <StudentSupport />
      <FloatingAds />
    </>
  )
}
