import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SchoolHero } from '@/components/schools/SchoolHero';
import { SchoolBenefits } from '@/components/schools/SchoolBenefits';
import { SchoolTestimonials } from '@/components/schools/SchoolTestimonials';
import { SchoolCTA } from '@/components/schools/SchoolCTA';

export default function Schools() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SchoolHero />
        <SchoolBenefits />
        <SchoolTestimonials />
        <SchoolCTA />
      </main>
      <Footer />
    </div>
  );
}
