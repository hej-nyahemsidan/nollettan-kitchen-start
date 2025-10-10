import nollEttanInterior from "@/assets/noll-ettan-interior-new.png";
import hammarbyModernBuilding from "@/assets/hammarby-modern-building-new.png";

const About = () => {
  return (
    <section id="about" className="section-light overflow-hidden ambient-glow">
      <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-1000">
            <h2 className="text-4xl md:text-5xl font-heading font-light text-gradient-gold mb-8 hover:scale-105 transition-all duration-500 cursor-default leading-[1.1] pb-2">
              Lunch varje vardag
            </h2>
            <p className="text-xl text-restaurant-text-dark/90 leading-relaxed">
              Varje dag erbjuder vi kött, fisk och vegetariskt – och utöver det finns en bred meny med fler rätter att välja mellan. 
              Alltid med soppa, salladsbuffé, kaffe och en liten godbit.
            </p>
            <p className="text-lg text-restaurant-text-dark/70 leading-relaxed">
              Perfekt för en paus från jobbet eller en lunch med vänner.
            </p>
            
            {/* Customer Quote */}
            <div className="bg-restaurant-gold/10 border border-restaurant-gold/30 rounded-xl p-6 my-8">
              <p className="text-restaurant-text-dark/80 italic text-lg leading-relaxed">
                "Ätit lunch här ett tiotal gånger och maten har alltid varit av väldigt hög klass!"
              </p>
              <p className="text-restaurant-gold font-semibold mt-3">— Jimmy</p>
            </div>
            
            
            <div className="pt-8">
              <h3 className="text-3xl md:text-4xl font-heading font-light text-gradient-gold mb-6 hover:scale-105 transition-all duration-500 cursor-default leading-[1.1] pb-2">
                Catering & fester
              </h3>
              <p className="text-xl text-restaurant-text-dark/90 leading-relaxed mb-4">
                Vi hjälper företag och privatpersoner med catering.
              </p>
              <p className="text-lg text-restaurant-text-dark/70 leading-relaxed">
                Allt från svenska bufféer till italienska och libanesiska rätter.
                Alltid lagat med omsorg och personlig känsla.
              </p>
            </div>
          </div>
          
          {/* Images Grid */}
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-1000 delay-300">
            {/* Restaurant Interior - Now full width on top */}
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:rotate-1 group-hover:-translate-y-2">
                <img
                  src={nollEttanInterior}
                  alt="Noll Ettan restaurang lunch Hammarby Sjöstad - mysig kvarterskrog interior med moderna stolar och lampor Stockholm"
                  className="w-full h-80 md:h-96 object-cover hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-restaurant-text-dark/80 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-restaurant-cream text-sm font-medium">Vår mysiga lokal</span>
              </div>
            </div>

            {/* Modern Hammarby Building - Below but also larger */}
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:-rotate-1 group-hover:-translate-y-2">
                <img
                  src={hammarbyModernBuilding}
                  alt="Hammarby Sjöstad Stockholm - moderna bostäder nära Noll Ettan restaurang och catering"
                  className="w-full h-80 md:h-96 object-cover hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-restaurant-text-dark/80 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-restaurant-cream text-sm font-medium">Hjärtat av Sjöstan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;