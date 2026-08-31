import PageHero from '@/components/PageHero'
import GallerySection from '@/components/Gallery'
import CtaBanner from '@/components/CtaBanner'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'
import campusImage from '@/assets/campus-hero.jpg'

export default function Gallery() {
  usePageMeta(pageSeo.gallery)

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Our campus in pictures"
        description="Photos and videos from across the 65-acre campus — infrastructure, laboratories, events, sports and student activities."
        image={campusImage}
      />

      <GallerySection
        background="white"
        title="Campus Photo & Video Gallery"
        subtitle="Filter by category to explore different parts of campus life. Select any image to view it full screen."
      />

      <CtaBanner
        title="Want to see it in person?"
        description="Book a campus tour with our admissions team and walk the grounds yourself."
        primaryLabel="Contact Us"
        primaryTo="/contact"
      />
    </>
  )
}
