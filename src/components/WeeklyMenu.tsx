import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Coffee, ChefHat, Soup, Salad, Cookie, Heart } from "lucide-react";
import { useMenu } from "@/contexts/MenuContext";

const WeeklyMenu = () => {
  const { menuData } = useMenu();
  
  const getCurrentDay = () => {
    const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
    const today = new Date();
    const currentHour = today.getHours();
    
    // After 16:00, show next day's menu
    if (currentHour >= 16) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return days[tomorrow.getDay()];
    }
    
    return days[today.getDay()];
  };

  const getActualToday = () => {
    const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
    const today = new Date();
    return days[today.getDay()];
  };

  const currentDay = getCurrentDay();
  const actualToday = getActualToday();

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case "Kött":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Fisk":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Veg":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-restaurant-gold/20 text-restaurant-gold border-restaurant-gold/30";
    }
  };

  return (
    <section id="weekly-lunch" className="section-premium overflow-hidden ambient-glow">
      <div className="max-w-6xl mx-auto text-center">
        <div className="animate-in slide-in-from-bottom-8 duration-1000">
          <h2 className="text-5xl md:text-6xl font-heading font-semibold text-gradient-gold mb-8 hover:scale-105 transition-transform cursor-default leading-[1.1] pb-2">
            Veckans Lunch
          </h2>
          <p className="text-xl text-premium mb-16 max-w-3xl mx-auto">
            Vecka {menuData.week} • <span className="text-base italic">11:00–14:00</span>
          </p>
        </div>

        {/* Weekly Menu */}
        <div className="space-y-8">
          {menuData.weeklyLunch.map((day, dayIndex) => {
            const isHighlighted = day.day === currentDay;
            const isActuallyToday = day.day === actualToday;
            return (
              <div key={dayIndex} id={`dag-${day.day.toLowerCase()}`} className="animate-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: `${dayIndex * 150}ms` }}>
                <Card className={`card-premium hover:-translate-y-3 hover:shadow-2xl transition-all duration-500 group ${
                  isHighlighted 
                    ? 'ring-2 ring-restaurant-gold border-restaurant-gold/50 bg-restaurant-gold/5 shadow-lg shadow-restaurant-gold/20' 
                    : ''
                }`}>
                  <CardHeader className="pb-6">
                    <CardTitle className={`text-3xl flex items-center justify-center gap-3 group-hover:scale-110 transition-transform duration-300 ${
                      isHighlighted ? 'text-restaurant-gold' : 'text-gradient-gold'
                    }`} style={{ marginLeft: '-5%' }}>
                      <ChefHat className={`icon-large group-hover:rotate-12 transition-transform duration-300 ${
                        isHighlighted ? 'text-restaurant-gold animate-pulse' : ''
                      }`} />
                      {day.day} {isActuallyToday && <span className="text-sm bg-restaurant-gold text-black px-2 py-1 rounded-full ml-2">IDAG</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="bg-white/5 rounded-lg p-6 border border-primary/20 hover:border-primary/40 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group/meal">
                          <Badge className={`mb-4 ${getMealTypeColor(meal.type)} group-hover/meal:scale-110 transition-transform duration-300`}>
                            {meal.type}
                          </Badge>
                          <div className="mb-3">
                            <h3 className="text-xl font-medium text-restaurant-text-light group-hover/meal:text-restaurant-gold transition-colors duration-300">
                              {meal.name}
                            </h3>
                          </div>
                          <p className="text-restaurant-text-light/80 leading-relaxed">
                            {meal.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* What's Included - Show after Friday */}
                {day.day === "Fredag" && (
                  <div className="bg-restaurant-gold/10 border border-restaurant-gold/30 rounded-xl p-8 mt-8">
                    <h3 className="text-restaurant-gold font-semibold text-xl mb-6 text-center">
                      Till dagens lunch ingår alltid:
                    </h3>
                    <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
                       <div className="flex flex-col items-center gap-4 md:gap-3">
                         <Soup className="w-8 h-8 md:w-6 md:h-6 text-restaurant-gold" />
                         <span className="text-base text-restaurant-text-light">Dagens soppa</span>
                       </div>
                       <div className="flex flex-col items-center gap-4 md:gap-3">
                         <Salad className="w-8 h-8 md:w-6 md:h-6 text-restaurant-gold" />
                         <span className="text-base text-restaurant-text-light">Salladsbuffé</span>
                       </div>
                       <div className="flex flex-col items-center gap-4 md:gap-3">
                         <Cookie className="w-8 h-8 md:w-6 md:h-6 text-restaurant-gold" />
                         <span className="text-base text-restaurant-text-light">Nybakat bröd</span>
                       </div>
                       <div className="flex flex-col items-center gap-4 md:gap-3">
                         <Coffee className="w-8 h-8 md:w-6 md:h-6 text-restaurant-gold" />
                         <span className="text-base text-restaurant-text-light">Kaffe</span>
                       </div>
                       <div className="flex flex-col items-center gap-4 md:gap-3">
                         <Heart className="w-8 h-8 md:w-6 md:h-6 text-restaurant-gold" />
                         <span className="text-base text-restaurant-text-light">En liten godbit</span>
                       </div>
                     </div>
                    
                     <div className="mt-8 pt-6 border-t border-restaurant-gold/20">
                       <h4 className="text-restaurant-gold font-semibold text-xl mb-4 text-center">Lunchpris</h4>
                       <div className="flex justify-center gap-8 md:gap-8">
                          <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                            <span className="font-bold text-lg text-restaurant-text-light">{(menuData.lunchPricing && menuData.lunchPricing.onSite) || 155} kr</span>
                            <span className="text-restaurant-text-light text-base md:ml-2 md:before:content-['•'] md:before:mr-2">På plats</span>
                          </div>
                          <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                            <span className="font-bold text-lg text-restaurant-text-light">{(menuData.lunchPricing && menuData.lunchPricing.takeaway) || 140} kr</span>
                            <span className="text-restaurant-text-light text-base md:ml-2 md:before:content-['•'] md:before:mr-2">Takeaway</span>
                          </div>
                       </div>
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Info */}
        <div className="flex justify-center items-center gap-4 py-8 mt-8 border-t border-primary/20">
          <div className="flex items-center gap-2 text-restaurant-text-light">
            <Clock className="icon-standard icon-spacing" />
            <span className="text-base italic">Serveras 11:00–14:00</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklyMenu;