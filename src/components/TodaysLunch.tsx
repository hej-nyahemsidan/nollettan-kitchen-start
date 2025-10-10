import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Coffee, Beef, Fish, Leaf, AlertTriangle, Mail, UtensilsCrossed, Calendar, Salad, Soup, Cookie, Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMenu } from "@/contexts/MenuContext";

const TodaysLunch = () => {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { menuData } = useMenu();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    
    toast({
      title: "Registrering lyckades!",
      description: "Du kommer att få veckans meny varje måndag kl 09:00 och våra marknadsföringskampanjer.",
    });
    
    setEmail("");
    setIsOpen(false);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Soup': return Soup;
      case 'Salad': return Salad;
      case 'Cookie': return Cookie;
      case 'Coffee': return Coffee;
      case 'Heart': return Heart;
      default: return Soup;
    }
  };

  return (
    <section id="todays-lunch" className="section-premium overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <div className="animate-in slide-in-from-bottom-8 duration-1000">
          <h2 className="text-5xl md:text-6xl font-heading font-semibold text-gradient-gold mb-8 hover:scale-105 transition-transform cursor-default">
            Lunchmeny
          </h2>
          <p className="text-xl text-premium mb-16 max-w-3xl mx-auto">
            Färsk lunch varje dag, serverad med kärlek och omtanke
          </p>
        </div>
        
        {/* Always Available Menu */}
        <div className="card-premium max-w-5xl mx-auto mb-12 animate-in slide-in-from-left-8 duration-1000 delay-300 hover:-translate-y-3 hover:shadow-2xl transition-all duration-500">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl text-gradient-gold flex items-center justify-center gap-3 -translate-x-[3%] md:-translate-x-[3%]">
              <UtensilsCrossed className="w-8 h-8" />
              <span className="hidden md:block">{menuData.categoryTexts?.alwaysOnTitle || "Alltid på Noll Ettan"}</span>
              <span className="md:hidden text-center leading-tight">
                {menuData.categoryTexts?.alwaysOnTitle || "Alltid på Noll Ettan"}
              </span>
            </CardTitle>
            <p className="text-restaurant-text-light/80 text-base italic mt-4 mb-6">
              Serveras 11:00–15:00
            </p>
            
            {/* What's Included - Compact */}
            <div className="bg-restaurant-gold/10 border border-restaurant-gold/30 rounded-xl p-8 mb-6">
              <h4 className="text-restaurant-gold font-semibold text-xl mb-8">Till lunchmenyn ingår alltid:</h4>
              <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-8 w-full">
                  {(menuData.lunchIncluded || []).map((item, index) => {
                    const IconComponent = getIconComponent(item.icon);
                    return (
                      <div key={index} className="flex flex-col items-center gap-3">
                        <IconComponent className="icon-large" />
                        <span className="text-base text-restaurant-text-light">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {(menuData.alwaysOnMenu || []).map((item, index) => (
                <div key={index} className="text-left p-4 bg-white/5 rounded-lg border border-primary/20 relative">
                  <h3 className="text-lg font-medium text-restaurant-text-light pr-16">{item.name}</h3>
                  <span className="absolute top-4 right-4 text-restaurant-gold font-semibold">{item.price}:-</span>
                  <p className="text-restaurant-text-light/80 mt-2">{item.description}</p>
                </div>
              ))}
            </div>
            
          </CardContent>
        </div>

        {/* Meny Zero Uno */}
        <div className="card-premium max-w-5xl mx-auto animate-in slide-in-from-right-8 duration-1000 delay-500 hover:-translate-y-3 hover:shadow-2xl transition-all duration-500">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl text-gradient-gold">
              Meny Zero Uno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-12">
            {/* Pinsa Pizza */}
            <div>
              <h3 className="text-2xl font-heading text-restaurant-gold mb-6">{menuData.categoryTexts?.pinsaPizzaTitle || "PINSA PIZZA"}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {(menuData.pinsaPizza || []).map((item, index) => (
                  <div key={index} className="text-left p-4 bg-white/5 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium text-restaurant-text-light">{item.name}</h4>
                      <span className="text-restaurant-gold font-semibold">{item.price}:-</span>
                    </div>
                    <p className="text-restaurant-text-light/80">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sallader */}
            <div>
              <h3 className="text-2xl font-heading text-restaurant-gold mb-6">{menuData.categoryTexts?.saladsTitle || "SALLADER"}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {(menuData.salads || []).map((item, index) => (
                  <div key={index} className="text-left p-4 bg-white/5 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium text-restaurant-text-light">{item.name}</h4>
                      <span className="text-restaurant-gold font-semibold">{item.price}:-</span>
                    </div>
                    <p className="text-restaurant-text-light/80">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pasta */}
            <div>
              <h3 className="text-2xl font-heading text-restaurant-gold mb-6">{menuData.categoryTexts?.pastaTitle || "PASTA"}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {(menuData.pasta || []).map((item, index) => (
                  <div key={index} className="text-left p-4 bg-white/5 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium text-restaurant-text-light">{item.name}</h4>
                      <span className="text-restaurant-gold font-semibold">{item.price}:-</span>
                    </div>
                    <p className="text-restaurant-text-light/80">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Info */}
            <div className="flex justify-center items-center py-4 border-y border-muted/20">
              <div className="flex items-center gap-2 text-restaurant-text-light">
                <Clock className="w-5 h-5" />
                <span>11:00–15:00</span>
              </div>
            </div>
            
          </CardContent>
        </div>
      </div>
    </section>
  );
};

export default TodaysLunch;