import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { contactSchema, type ContactFormData } from "@/lib/contact-schema";
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import nollEttanFacade from "@/assets/noll-ettan-facade.jpg";
import hammarbyStreetView from "@/assets/hammarby-street-view.png";
import hammarbyContactView from "@/assets/hammarby-contact-view.png";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize EmailJS
  useEffect(() => {
    console.log('Initializing EmailJS...');
    emailjs.init('ykwI-L5D4LNo9ysD4');
    console.log('EmailJS initialized successfully');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, starting process...');
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      console.log('Validating form data:', formData);
      const validatedData = contactSchema.parse(formData);
      console.log('Form data validated successfully:', validatedData);
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || "Ej angivet",
        message: validatedData.message,
        sent_date: new Date().toLocaleString('sv-SE'),
        from_name: "hemsidan"
      };
      console.log('Template params prepared:', templateParams);

      // Send email using EmailJS
      console.log('Attempting to send email via EmailJS...');
      const result = await emailjs.send(
        'service_ym8t03o', // Service ID
        'contact_template', // Template ID
        templateParams
        // Public key is not needed here since we initialized EmailJS
      );
      console.log('EmailJS response:', result);

      // Success
      toast({
        title: "Meddelande skickat!",
        description: "Tack för ditt meddelande. Vi återkommer så snart som möjligt.",
      });
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({});

    } catch (error) {
      console.error('Form submission error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Handle validation errors
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }

      // Handle other errors
      toast({
        title: "Ett fel uppstod",
        description: error instanceof Error ? error.message : "Kunde inte skicka meddelandet. Försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <section id="contact" className="section-padding bg-restaurant-dark overflow-hidden ambient-glow">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-heading font-semibold text-gradient-gold mb-8 animate-in slide-in-from-bottom-8 duration-1000 hover:scale-105 transition-transform cursor-default leading-[1.1] pb-2">
            Hitta oss
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Contact Information */}
          <div className="animate-in slide-in-from-left-8 duration-1000 delay-300">
            <Card className="card-restaurant bg-muted/10 border-restaurant-gold/20 hover:border-restaurant-gold/40 hover:-translate-y-2 transition-all duration-500 group h-full">
              <CardHeader>
                <CardTitle className="text-xl text-restaurant-gold group-hover:text-restaurant-gold-light transition-colors">
                  Kontaktinformation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 h-full flex flex-col">
                <div className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-lg transition-colors cursor-pointer group/item">
                  <Phone className="icon-standard icon-spacing group-hover/item:animate-bounce" />
                  <div>
                    <p className="text-restaurant-text-light mb-2">Telefon</p>
                    <a 
                      href="tel:+46833320300" 
                      className="story-link text-restaurant-gold hover:text-restaurant-gold-light hover:scale-110 transition-all duration-300 font-medium"
                    >
                      08-33 32 03
                    </a>
                  </div>
                </div>
              
                <div className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-lg transition-colors cursor-pointer group/item">
                  <Mail className="icon-standard icon-spacing group-hover/item:animate-pulse" />
                  <div>
                    <p className="text-restaurant-text-light mb-2">E-post</p>
                    <a 
                      href="mailto:info@nollettan.se" 
                      className="story-link text-restaurant-gold hover:text-restaurant-gold-light hover:scale-110 transition-all duration-300 font-medium"
                    >
                      info@nollettan.se
                    </a>
                  </div>
                </div>
              
                <div className="flex items-start gap-4 hover:bg-white/5 p-3 rounded-lg transition-colors group/item">
                  <MapPin className="icon-standard icon-spacing mt-1 group-hover/item:animate-bounce" />
                  <div className="space-y-3">
                    <p className="text-restaurant-text-light mb-2">Adress</p>
                    <p className="text-restaurant-gold font-medium">
                      Hammarbybacken 27<br />
                      120 30 Stockholm
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-restaurant-gold text-restaurant-gold hover:bg-restaurant-gold hover:text-restaurant-dark hover:scale-105 transition-all duration-300"
                      onClick={() => window.open('https://www.google.com/maps/dir/59.300927,18.0834765/NOLL+ETTAN+RESTAURANG+%26+CATERING,+Hammarbybacken+27,+120+30+Stockholm/@59.3009874,18.0807102,17z/data=!3m1!4b1!4m18!1m7!3m6!1s0x465f791f9ba3118f:0x210a1b1ca61e48b7!2sNOLL+ETTAN+RESTAURANG+%26+CATERING!8m2!3d59.301094!4d18.083229!16s%2Fg%2F11m_rt96wl!4m9!1m1!4e1!1m5!1m1!1s0x465f791f9ba3118f:0x210a1b1ca61e48b7!2m2!1d18.083229!2d59.301094!3e3?hl=sv&entry=ttu&g_ep=EgoyMDI1MDkxNi4wIKXMDSoASAFQAw%3D%3D', '_blank')}
                    >
                      Hitta hit
                    </Button>
                  </div>
                </div>
              
              <div className="flex items-start gap-4 hover:bg-white/5 p-3 rounded-lg transition-colors group/item flex-1">
                  <Clock className="icon-standard icon-spacing mt-1 group-hover/item:animate-spin" />
                  <div>
                    <p className="text-restaurant-text-light mb-2">Öppettider</p>
                    <div className="text-restaurant-gold font-medium text-base leading-relaxed">
                      <p>Måndag-Fredag: 08:00-16:00</p>
                      <p>Lördag-Söndag: Stängt</p>
                      <p>Helger: Stängt</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="animate-in slide-in-from-right-8 duration-1000 delay-500">
            <Card id="contact-form" className="card-restaurant bg-muted/10 border-restaurant-gold/20 hover:border-restaurant-gold/40 hover:-translate-y-2 transition-all duration-500 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-restaurant-gold">
                Skicka ett meddelande
              </CardTitle>
              <p className="text-restaurant-text-light text-sm mt-2">
                Vi svarar vanligtvis inom 24 timmar
              </p>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-restaurant-text-light">
                    Namn *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`bg-background border-muted focus:border-restaurant-gold transition-colors ${
                      errors.name ? 'border-destructive' : ''
                    }`}
                    placeholder="Ditt namn"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-restaurant-text-light">
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`bg-background border-muted focus:border-restaurant-gold transition-colors ${
                      errors.phone ? 'border-destructive' : ''
                    }`}
                    placeholder="Ditt telefonnummer"
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-restaurant-text-light">
                    E-post *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`bg-background border-muted focus:border-restaurant-gold transition-colors ${
                      errors.email ? 'border-destructive' : ''
                    }`}
                    placeholder="din@email.se"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2 flex-1">
                  <Label htmlFor="message" className="text-restaurant-text-light">
                    Meddelande *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`bg-background border-muted min-h-[140px] resize-none focus:border-restaurant-gold transition-colors ${
                      errors.message ? 'border-destructive' : ''
                    }`}
                    placeholder="Skriv ditt meddelande här..."
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                </div>
                
                <div className="mt-auto pt-4 space-y-4">
                  <p className="text-xs text-restaurant-text-light/70">
                    * Obligatoriska fält
                  </p>
                  <Button 
                    type="submit" 
                    className="w-full bg-restaurant-gold hover:bg-restaurant-gold-light text-restaurant-dark font-medium py-3 transition-colors"
                    disabled={!formData.name || !formData.email || !formData.message || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Skickar...
                      </>
                    ) : (
                      'Skicka meddelande'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

        {/* Google Maps and Area Image - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 animate-in slide-in-from-bottom-8 duration-1000 delay-700">
          <Card className="card-restaurant bg-muted/10 border-restaurant-gold/20 hover:scale-105 transition-transform duration-500 group">
            <CardContent className="p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2034.8474692836877!2d18.116455476553595!3d59.30687817447582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f77e2b3c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sHammarbybacken%2027%2C%20120%2030%20Stockholm!5e0!3m2!1ssv!2sse!4v1694872892347!5m2!1ssv!2sse"
                width="100%"
                height="360"
                style={{ border: 0, borderRadius: '0.75rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Noll Ettan - Hammarbybacken 27, Stockholm"
                className="w-full h-[360px]"
              ></iframe>
            </CardContent>
          </Card>
          
          <Card className="card-restaurant bg-muted/10 border-restaurant-gold/20 hover:scale-105 transition-transform duration-500 group">
            <CardContent className="p-0">
              <img
                src="https://placehold.co/800x600/1a1a1a/8B7355?text=Hammarby+Sjostad+View"
                alt="Gatvy över Hammarby Sjöstad med moderna byggnader och färgglada fasader"
                className="w-full h-[360px] object-cover rounded-lg group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
};

export default Contact;