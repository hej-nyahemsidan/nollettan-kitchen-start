import { Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-restaurant-dark border-t border-restaurant-gold/20 py-16 ambient-glow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side - Brand and Social */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-heading font-bold text-gradient-gold mb-6">
              Noll Ettan
            </h3>
            
            <div className="flex justify-center md:justify-start gap-6 mb-8">
              <a 
                href="https://facebook.com/NOLLETTAN" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-restaurant-gold p-4 rounded-xl hover:bg-restaurant-gold-light transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-2xl hover:shadow-restaurant-gold/30 shadow-lg group"
                aria-label="Följ oss på Facebook - @NOLLETTAN"
              >
                <Facebook className="w-7 h-7 text-restaurant-dark group-hover:rotate-12 transition-transform duration-300" />
              </a>
              <a 
                href="https://instagram.com/noll_ettan" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-restaurant-gold p-4 rounded-xl hover:bg-restaurant-gold-light transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-2xl hover:shadow-restaurant-gold/30 shadow-lg group"
                aria-label="Följ oss på Instagram - @noll_ettan"
              >
                <Instagram className="w-7 h-7 text-restaurant-dark group-hover:rotate-12 transition-transform duration-300" />
              </a>
            </div>
            
            <p className="text-muted-foreground text-sm mb-8">
              © 2024 Noll Ettan. Alla rättigheter förbehållna.
              <Link 
                to="/admin" 
                className="opacity-30 hover:opacity-100 transition-opacity duration-300 ml-4 text-xs"
              >
                •
              </Link>
            </p>
          </div>
          
          {/* Right Side - Quick Contact */}
          <div className="text-center md:text-right">
            <div className="space-y-3 text-restaurant-text-light">
              <h4 className="text-xl font-heading font-semibold text-gradient-gold mb-6">
                Följ oss för dagens lunchmeny och erbjudanden
              </h4>
              <p>
                <a href="tel:+46833320300" className="story-link hover:text-restaurant-gold transition-all duration-300 text-lg hover:scale-110 inline-block">
                  08-33 32 03
                </a>
              </p>
              <p>
                <a href="mailto:info@nollettan.se" className="story-link hover:text-restaurant-gold transition-all duration-300 text-lg hover:scale-110 inline-block">
                  info@nollettan.se
                </a>
              </p>
              <p className="text-restaurant-text-light/70">
                Hammarbybacken 27, 120 30 Stockholm
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-restaurant-gold/20 text-center">
              <p className="text-restaurant-gold font-medium">
                Noll Ettan – lunch & catering i Hammarby Sjöstad sedan 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;