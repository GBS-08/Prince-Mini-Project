import Hero from '@/components/Hero'
import CollegeStats from '@/components/CollegeStats'
import AboutSection from '@/components/AboutSection'
import Programs from '@/components/Programs'
import Gallery from '@/components/Gallery'
import Placements from '@/components/Placements'
import CampusLife from '@/components/CampusLife'
import News from '@/components/News'
import ContactSection from '@/components/ContactSection'
import CtaBanner from '@/components/CtaBanner'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'

export default function Home() {
  usePageMeta(pageSeo.home)

  return (
    <>
      <Hero />
      <CollegeStats />
      <AboutSection />
      <Programs limit={6} background="muted" />
      <Gallery limit={8} showFilters={false} background="white" />
      <Placements />
      <CampusLife limit={3} background="white" />
      <News limit={3} />
      <ContactSection background="white" />
      <CtaBanner />
    </>
  )
}
