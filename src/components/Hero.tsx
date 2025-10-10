import { memo, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Calendar, PartyPopper } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = memo(() => {
  const isMobile = useIsMobile();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  const getCurrentDay = () => {
    const days = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
    const today = new Date();
    return days[today.getDay()];
  };

  const getTargetDay = () => {
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
    
    return targetDay;
  };

  const scrollToTodaysMenu = useCallback(() => {
    const targetDay = getTargetDay();
    const todayElement = document.getElementById(`dag-${targetDay}`);
    
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback to general lunch section if target day isn't found
      document.getElementById('lunch')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handlePhoneClick = () => {
    if (isMobile) {
      window.location.href = 'tel:+4683332030';
    } else {
      setShowPhoneNumber(!showPhoneNumber);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden ambient-glow pt-32 sm:pt-28 md:pt-24 pb-32 md:pb-24">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-background.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-4 sm:mt-2 md:mt-0 animate-fade-in">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-light text-gradient-gold mb-8 leading-[1.1] drop-shadow-lg animate-in slide-in-from-bottom-8 duration-1000 translate-x-[0.25%]" style={{ textRendering: 'optimizeLegibility', letterSpacing: '0.02em', paddingBottom: '0.2em' }}>
          Enkel vardagslyx
        </h1>
        
        {/* Ingress */}
        <p className="text-lg md:text-xl text-white/90 mb-12 font-light max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 duration-1000 delay-300">
          Med omtanke i varje detalj hittar du Noll Ettan mitt i Sthlm 01-huset – en bistro som bjuder på mer än bara lunch. 
          Här möts nygräddat bröd, en fräsch salladsbuffé och noga utvalda råvaror i en varm atmosfär.
        </p>
        
        {/* Weekly Lunch Button */}
        <div className="mb-8 animate-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Button 
            className="bg-restaurant-gold hover:bg-restaurant-gold/90 text-black px-12 py-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-restaurant-gold/30 flex items-center gap-3 mx-auto group"
            onClick={scrollToTodaysMenu}
          >
            <Calendar className="w-6 h-6 text-black mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Se veckans lunch
          </Button>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-in slide-in-from-bottom-8 duration-1000 delay-700">
          <Button 
            className="bg-restaurant-gold hover:bg-restaurant-gold/90 text-black px-12 py-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-restaurant-gold/30 flex items-center gap-3 group"
            onClick={() => document.getElementById('catering')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <PartyPopper className="w-6 h-6 text-black mr-2 group-hover:animate-pulse" />
            <span className="group-hover:animate-pulse">Beställ catering</span>
          </Button>
          <div className="relative">
            <Button 
              className="bg-restaurant-gold hover:bg-restaurant-gold/90 text-black px-12 py-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-restaurant-gold/30 flex items-center gap-3 group"
              onClick={handlePhoneClick}
              aria-label="Ring Noll Ettan för att beställa lunch på 08-33 32 03"
            >
              <Phone className="w-6 h-6 text-black mr-2 group-hover:animate-bounce" />
              Ring & hämta lunch
            </Button>
            {showPhoneNumber && !isMobile && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-lg shadow-lg font-semibold text-lg whitespace-nowrap">
                08-33 32 03
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;