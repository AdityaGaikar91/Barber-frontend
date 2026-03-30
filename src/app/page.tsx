import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { PricingSection } from "@/components/marketing/pricing-section";
import { Testimonials } from "@/components/marketing/testimonials";
import { CTASection } from "@/components/marketing/cta-section";

/**
 * Main SaaS Landing Page
 * Following @react-best-practices:
 * - Uses Server Components for the main shell to minimize JS bundle.
 * - Sections are modularized for clean maintenance.
 * - Critical assets in Hero are prioritized.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        
        <div id="features">
          <FeaturesGrid />
        </div>
        
        <Testimonials />
        
        <div id="pricing">
          <PricingSection />
        </div>
        
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

