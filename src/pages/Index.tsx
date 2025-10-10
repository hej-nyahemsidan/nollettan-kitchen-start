import { Suspense, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
// Import critical above-the-fold components directly for faster loading
import WeeklyMenu from "@/components/WeeklyMenu";
import { 
  LazyAbout, 
  LazyTodaysLunch, 
  LazyCatering, 
  LazyContact, 
  LazyFinalCTA, 
  LazyStickyMobileActions 
} from "./LazyComponents";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-restaurant-gold"></div>
  </div>
);

const Index = () => {
  // Scroll to top when page loads/refreshes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-restaurant-dark">
      <Navigation />
      <Hero />
      <Suspense fallback={<LoadingSpinner />}>
        <div className="-mt-8 md:-mt-12 relative z-20">
          <LazyAbout />
        </div>
      </Suspense>
      {/* Load WeeklyMenu directly since it's visible on initial scroll */}
      <div id="lunch" className="py-4">
        <WeeklyMenu />
        <Suspense fallback={<LoadingSpinner />}>
          <div className="py-4">
            <LazyTodaysLunch />
          </div>
        </Suspense>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <div id="catering" className="py-8">
          <LazyCatering />
        </div>
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="py-6">
          <LazyFinalCTA />
        </div>
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <div id="contact" className="py-4">
          <LazyContact />
        </div>
      </Suspense>
      <Footer />
      <Suspense fallback={null}>
        <LazyStickyMobileActions />
      </Suspense>
    </div>
  );
};

export default Index;
