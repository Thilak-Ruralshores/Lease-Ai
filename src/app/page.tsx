import { HomeNavbar } from "@/components/layout/home-navbar";
import { HeroSection } from "@/components/layout/hero-section";
import { HowItWorks } from "@/components/layout/how-it-works";
import { FeatureHighlights } from "@/components/layout/feature-highlights";
import { TrustIndicators } from "@/components/layout/trust-indicators";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HomeNavbar />
      <div className="pt-16">
        <HeroSection />
        <HowItWorks />
        <FeatureHighlights />
        <TrustIndicators />
        <Footer />
      </div>
    </main>
  );
}
