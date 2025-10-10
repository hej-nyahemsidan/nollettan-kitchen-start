import { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = memo(() => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverLightSection, setIsOverLightSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      
      // Check if we're over light sections (about, catering, contact sections typically have light backgrounds)
      const aboutSection = document.getElementById('about');
      const cateringSection = document.getElementById('catering');
      const contactSection = document.getElementById('contact');
      
      let overLightSection = false;
      
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          overLightSection = true;
        }
      }
      
      if (cateringSection) {
        const rect = cateringSection.getBoundingClientRect();
        // For catering section, we want the nav to remain dark since it has dark background
        if (rect.top <= 100 && rect.bottom >= 100) {
          overLightSection = false; // Keep nav light on dark catering background
        }
      }
      
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        // Contact section has dark background - keep nav light
        if (rect.top <= 100 && rect.bottom >= 100) {
          overLightSection = false; // Keep nav light on dark contact background
        }
      }
      
      setIsOverLightSection(overLightSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const scrollToTodaysMenu = useCallback(() => {
    const days = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
    const today = new Date();
    const currentHour = today.getHours();
    const currentDay = days[today.getDay()];
    
    // After 16:00, point to next day's menu
    let targetDay = currentDay;
    if (currentHour >= 16) {
      const nextDayIndex = (today.getDay() + 1) % 7;
      targetDay = days[nextDayIndex];
    }
    
    // If target day is weekend, show Monday's menu instead
    if (targetDay === 'lördag' || targetDay === 'söndag') {
      targetDay = 'måndag';
    }
    
    const todayElement = document.getElementById(`dag-${targetDay}`);
    
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback to general lunch section if target day isn't found
      document.getElementById('lunch')?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-restaurant-dark/98 backdrop-blur-md shadow-2xl border-b border-restaurant-gold/30' : 'bg-restaurant-dark/90 backdrop-blur-sm'
    }`} style={{ willChange: 'transform' }}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:opacity-80 transition-all duration-300 hover:scale-110 hover-glow"
          >
            <span className="text-2xl font-heading font-bold text-restaurant-gold drop-shadow-lg">
              Noll Ettan
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`story-link ${isOverLightSection ? 'text-restaurant-dark' : 'text-restaurant-text-light'} hover:text-restaurant-gold transition-all duration-300 hover:scale-110`}
            >
              Hem
            </button>
            <button 
              onClick={() => scrollToSection('todays-lunch')}
              className={`story-link ${isOverLightSection ? 'text-restaurant-dark' : 'text-restaurant-text-light'} hover:text-restaurant-gold transition-all duration-300 hover:scale-110`}
            >
              Lunchmeny
            </button>
            <button 
              onClick={scrollToTodaysMenu}
              className={`story-link ${isOverLightSection ? 'text-restaurant-dark' : 'text-restaurant-text-light'} hover:text-restaurant-gold transition-all duration-300 hover:scale-110`}
            >
              Veckans Lunch
            </button>
            <button 
              onClick={() => scrollToSection('catering')}
              className={`story-link ${isOverLightSection ? 'text-restaurant-dark' : 'text-restaurant-text-light'} hover:text-restaurant-gold transition-all duration-300 hover:scale-110`}
            >
              Catering
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className={`story-link ${isOverLightSection ? 'text-restaurant-dark' : 'text-restaurant-text-light'} hover:text-restaurant-gold transition-all duration-300 hover:scale-110`}
            >
              Om oss
            </button>
            <button 
              onClick={() => scrollToSection('contact-form')}
              className={`story-link ${isOverLightSection ? 'text-restaurant-dark' : 'text-restaurant-text-light'} hover:text-restaurant-gold transition-all duration-300 hover:scale-110`}
            >
              Kontakt
            </button>
            
            {/* Phone Number */}
            <button 
              onClick={() => window.location.href = 'tel:+4683332030'}
              className="hover-scale text-restaurant-gold font-semibold border-l border-restaurant-gold/30 pl-6 ml-2 hover:text-restaurant-gold/80 transition-all duration-300"
              aria-label="Ring Noll Ettan på 08-33 32 03"
            >
              08-33 32 03
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${isOverLightSection ? 'text-restaurant-dark' : 'text-restaurant-text-light'} hover:text-restaurant-gold transition-colors`}
          >
            {isMobileMenuOpen ? <X className="icon-standard" /> : <Menu className="icon-standard" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-restaurant-gold/30 bg-restaurant-dark/95 backdrop-blur-md rounded-b-lg">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="story-link text-restaurant-text-light hover:text-restaurant-gold transition-all duration-300 text-left hover:translate-x-2"
              >
                Hem
              </button>
              <button 
                onClick={() => scrollToSection('todays-lunch')}
                className="story-link text-restaurant-text-light hover:text-restaurant-gold transition-all duration-300 text-left hover:translate-x-2"
              >
                Lunchmeny
              </button>
              <button 
                onClick={scrollToTodaysMenu}
                className="story-link text-restaurant-text-light hover:text-restaurant-gold transition-all duration-300 text-left hover:translate-x-2"
              >
                Veckans Lunch
              </button>
              <button 
                onClick={() => scrollToSection('catering')}
                className="story-link text-restaurant-text-light hover:text-restaurant-gold transition-all duration-300 text-left hover:translate-x-2"
              >
                Catering
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="story-link text-restaurant-text-light hover:text-restaurant-gold transition-all duration-300 text-left hover:translate-x-2"
              >
                Om oss
              </button>
              <button 
                onClick={() => scrollToSection('contact-form')}
                className="story-link text-restaurant-text-light hover:text-restaurant-gold transition-all duration-300 text-left hover:translate-x-2"
              >
                Kontakt
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;