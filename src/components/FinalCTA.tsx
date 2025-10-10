import { Button } from "@/components/ui/button";

const FinalCTA = () => {
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
      todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback to general lunch section if target day isn't found
      document.getElementById('lunch')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="section-dark text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-heading font-light text-white mb-8">
          Noll Ettan – din lunchrestaurang i Hammarby Sjöstad
        </h2>
        <p className="text-xl text-white/90 mb-12 leading-relaxed">
          Välkommen in på lunch eller beställ catering.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            className="btn-hero text-lg px-12 py-6"
            onClick={scrollToTodaysMenu}
          >
            Se dagens meny
          </Button>
          <Button 
            className="btn-secondary text-lg px-12 py-6"
            onClick={() => document.getElementById('catering')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Beställ catering
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;