import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, Truck, Users, CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const cateringOptions = [
  {
    title: "Svensk Buffé",
    icon: "🍲",
    description: "Klassisk svensk buffé med lokala råvaror och traditionella smaker",
    examples: [
      "Skagenröra med dill och citron",
      "Gravad lax med hovmästarsås",
      "Köttbullar med gräddsås",
      "Janssons frestelse",
      "Inlagd sill",
      "Västerbottenpaj",
      "Färskpotatis med dill",
      "Tunnbröd och smör"
    ]
  },
  {
    title: "Italiensk Catering",
    icon: "🍝",
    description: "Autentiska italienska smaker med färska råvaror och traditionella recept",
    examples: [
      "Antipasti - marinerade grönsaker och oliver",
      "Insalata caprese med buffelmozzarella",
      "Bruschetta med tomater och basilika",
      "Pasta med hemgjord pesto",
      "Pinsa pizza med tryffel och ricotta",
      "Prosciutto di Parma",
      "Risotto med svamp och parmesan",
      "Tiramisu till efterrätt"
    ]
  },
  {
    title: "Sliders & Varma Wraps",
    icon: "🍔",
    description: "Perfekt för lunch eller mingel - lätta att äta och alltid populära",
    examples: [
      "BBQ pulled pork sliders",
      "Halloumi och grönsakssliders",
      "Kyckling teriyaki wraps",
      "Vegetariska wraps med hummus",
      "Cheeseburger sliders",
      "Falafel wraps med tzatziki",
      "Lax och avokado wraps",
      "Mini fish & chips sliders"
    ]
  },
  {
    title: "Mellanöstern Mezze",
    icon: "🫒",
    description: "Färska mezze-rätter, hummus och välkryddade grönsaker från Mellanöstern",
    examples: [
      "Hummus med olivolja och paprika",
      "Baba ghanoush - aubergineröra",
      "Tabboule med persilja och tomat",
      "Falafel med tahini-sås",
      "Dolmar - vinbladsdolmar",
      "Fatayer - spenatpiroger",
      "Grillad halloumi",
      "Varmt pitabröd"
    ]
  }
];

const Catering = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [guests, setGuests] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('ykwI-L5D4LNo9ysD4');
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenAccordions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare template parameters for EmailJS
      const templateParams = {
        guest_count: guests,
        event_date: selectedDate ? format(selectedDate, "PPP", { locale: sv }) : "",
        email: email,
        phone: phone,
        sent_date: new Date().toLocaleString('sv-SE'),
        from_name: "hemsidan"
      };

      // Send email using EmailJS with catering template
      await emailjs.send(
        'service_ym8t03o', // Service ID
        'catering_template', // Template ID for catering
        templateParams
      );

      // Success
      toast({
        title: "Offertförfrågan skickad!",
        description: "Vi kontaktar dig inom 48 timmar med en personlig offert.",
      });

      // Reset form
      setGuests("");
      setSelectedDate(undefined);
      setEmail("");
      setPhone("");

    } catch (error) {
      console.error('Form submission error:', error);
      
      // Error
      toast({
        title: "Något gick fel",
        description: "Kunde inte skicka offertförfrågan. Försök igen eller kontakta oss direkt.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="catering" className="section-padding bg-muted/5 ambient-glow">
      <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-heading font-semibold text-gradient-gold mb-8 pb-2 leading-[1.1] hover:scale-105 transition-transform duration-300 cursor-default">
            Catering för alla tillfällen
          </h2>
          <p className="text-2xl text-premium max-w-4xl mx-auto mb-12 leading-relaxed hover:text-restaurant-gold transition-colors duration-300">
            Låt oss ta hand om maten så att du kan fokusera på det viktiga – dina gäster
          </p>
          
          {/* Catering Services */}
          <div className="bg-restaurant-gold/10 border border-restaurant-gold/30 rounded-2xl p-8 max-w-4xl mx-auto mb-12">
            <h3 className="text-3xl font-heading text-gradient-gold mb-8 text-center leading-[1.1] pb-2">
              Våra cateringtjänster
            </h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              {/* Frukost */}
              <div className="text-center p-6 bg-white/5 rounded-xl border border-restaurant-gold/20">
                <h4 className="text-xl font-semibold text-restaurant-gold mb-3">
                  Frukost
                </h4>
                <p className="text-restaurant-text-light/80 leading-relaxed">
                  Färsk frukost för perfekt start på dagen
                </p>
              </div>
              
              {/* Lunch */}
              <div className="text-center p-6 bg-white/5 rounded-xl border border-restaurant-gold/20">
                <h4 className="text-xl font-semibold text-restaurant-gold mb-3">
                  Lunch
                </h4>
                <p className="text-restaurant-text-light/80 leading-relaxed">
                  Sallader, wraps, smörgåsar och varmrätt
                </p>
              </div>
              
              {/* Buffé */}
              <div className="text-center p-6 bg-white/5 rounded-xl border border-restaurant-gold/20">
                <h4 className="text-xl font-semibold text-restaurant-gold mb-3">
                  Buffé
                </h4>
                <p className="text-restaurant-text-light/80 leading-relaxed">
                  Varmrätt, sallad och tillbehör
                </p>
              </div>
              
              {/* Premium */}
              <div className="text-center p-6 bg-white/5 rounded-xl border border-restaurant-gold/20">
                <h4 className="text-xl font-semibold text-restaurant-gold mb-3">
                  Premium
                </h4>
                <p className="text-restaurant-text-light/80 leading-relaxed">
                  Flera varmrätter, förrätt och dessert
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8 pt-6 border-t border-restaurant-gold/20">
              <p className="text-restaurant-text-light mb-2">
                <span className="font-semibold text-restaurant-gold">Kontakta oss</span> för personlig offert och priser
              </p>
              <p className="text-restaurant-text-light/80 text-sm">
                Vi anpassar våra menyer efter era önskemål och budget
              </p>
            </div>
          </div>
          
          {/* USP Row - Prominently displayed */}
          <div className="grid md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 bg-restaurant-gold/10 rounded-xl shadow-subtle">
              <CheckCircle className="icon-large" />
              <span className="text-restaurant-gold font-medium">Fri leverans hela Stockholm</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-restaurant-gold/10 rounded-xl shadow-subtle">
              <Users className="icon-large" />
              <span className="text-restaurant-gold font-medium">Anpassas för allergier</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-restaurant-gold/10 rounded-xl shadow-subtle">
              <Check className="icon-large" />
              <span className="text-restaurant-gold font-medium">Minst 20 personer</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-restaurant-gold/10 rounded-xl shadow-subtle">
              <Truck className="icon-large" />
              <span className="text-restaurant-gold font-medium">Professionell service</span>
            </div>
          </div>
        </div>
        
        
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {cateringOptions.map((option, index) => (
            <Card key={index} className="card-restaurant bg-muted/10 border-restaurant-gold/20 group animate-in slide-in-from-bottom-8 duration-700 hover:-translate-y-3 hover:shadow-2xl hover:border-restaurant-gold/40 transition-all duration-500" style={{ animationDelay: `${index * 200}ms` }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-restaurant-gold flex items-center gap-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl group-hover:animate-bounce" role="img" aria-label={option.title}>{option.icon}</span>
                  {option.title}
                </CardTitle>
                <p className="text-restaurant-text-light group-hover:text-restaurant-gold/80 transition-colors duration-300 text-sm">{option.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <Collapsible open={openAccordions.includes(index)} onOpenChange={() => toggleAccordion(index)}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left hover:bg-white/5 p-2 rounded transition-colors duration-300 group/trigger">
                    <h4 className="font-medium text-restaurant-gold text-sm group-hover/trigger:text-restaurant-gold-light transition-colors">Inspiration från menyn - vi kan göra det mesta!</h4>
                    {openAccordions.includes(index) ? 
                      <ChevronUp className="icon-small group-hover/trigger:animate-bounce transition-transform" /> : 
                      <ChevronDown className="icon-small group-hover/trigger:animate-bounce transition-transform" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="accordion-content">
                    <div className="mt-3 space-y-1">
                      <ul className="text-sm text-muted-foreground space-y-0.5">
                        {option.examples.map((example, idx) => (
                          <li key={idx} className="hover:text-restaurant-gold hover:translate-x-1 transition-all duration-200 cursor-default">• {example}</li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Form */}
        <Card className="card-restaurant bg-muted/10 border-restaurant-gold/20 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-restaurant-gold text-center">
              Begär offert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Number of Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-restaurant-text-light">Antal gäster</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="bg-background border-muted">
                    <SelectValue placeholder="Välj antal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20-30">20-30 personer</SelectItem>
                    <SelectItem value="31-50">31-50 personer</SelectItem>
                    <SelectItem value="51-100">51-100 personer</SelectItem>
                    <SelectItem value="100+">100+ personer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label className="text-restaurant-text-light">Datum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-muted",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: sv }) : "Välj datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-restaurant-text-light">E-post *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-muted"
                  placeholder="din@email.se"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-restaurant-text-light">Telefonnummer *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background border-muted"
                  placeholder="Telefonnummer"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center py-6 border border-restaurant-gold/20 rounded-lg bg-muted/5 space-y-3">
              <p className="text-restaurant-text-light mb-4">Kontakta oss för personlig offert</p>
              <div className="space-y-2">
                <a 
                  href="tel:+46833320300" 
                  className="story-link block text-2xl font-bold text-restaurant-gold hover:text-restaurant-gold-light hover:scale-110 transition-all duration-300"
                >
                  08-33 32 03
                </a>
                <a 
                  href="mailto:info@nollettan.se" 
                  className="story-link block text-lg text-restaurant-gold hover:text-restaurant-gold-light hover:scale-110 transition-all duration-300"
                >
                  info@nollettan.se
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Button 
                type="submit"
                className="w-full btn-hero"
                disabled={!guests || !selectedDate || !email || !phone || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  "Begär offert"
                )}
              </Button>
            </form>

            {/* USP Row */}
            <div className="grid md:grid-cols-4 gap-4 pt-4 border-t border-muted/20 text-center">
              <div className="flex flex-col items-center gap-2">
                <Check className="icon-standard" />
                <span className="text-sm text-muted-foreground">Snabb offert</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Truck className="icon-standard" />
                <span className="text-sm text-muted-foreground">Fri leverans hela Stockholm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Users className="icon-standard" />
                <span className="text-sm text-muted-foreground">Anpassas för allergier</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Check className="icon-standard" />
                <span className="text-sm text-muted-foreground">Professionell service</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Catering;