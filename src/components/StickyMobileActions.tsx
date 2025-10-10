import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const StickyMobileActions = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTodaysMenu = () => {
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
      todayElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback to general lunch section if target day isn't found
      document.getElementById('lunch')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="sticky-mobile md:hidden">
      <div className="flex gap-3 max-w-sm mx-auto px-4">
        <Button 
          className="btn-hero flex-1 flex items-center justify-center h-14 px-4 py-3 leading-none"
          onClick={() => document.getElementById('catering')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="font-medium text-center">Catering</span>
        </Button>
        <Button 
          className="btn-secondary flex-1 flex items-center justify-center h-14 px-4 py-3 leading-none"
          onClick={scrollToTodaysMenu}
        >
          <span className="font-medium text-center">Se veckans lunch</span>
        </Button>
      </div>
    </div>
  );
};

export default StickyMobileActions;