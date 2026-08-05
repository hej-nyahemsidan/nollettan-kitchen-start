export const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Noll Ettan",
  image:
    "https://storage.googleapis.com/gpt-engineer-file-uploads/2qURdbKI4TP2Vdw9MHE6cL5QAQr1/social-images/social-1758110731633-Logotyp.png",
  description:
    "Lunch och catering i Hammarby Sjöstad, Stockholm. Husmanskost, italienskt och vegetariskt. Betyg 4.9/5 av 65 gäster.",
  url: "https://nollettan.se",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hammarbybacken 27",
    postalCode: "120 30",
    addressLocality: "Stockholm",
    addressRegion: "Stockholm",
    addressCountry: "SE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "59.3007",
    longitude: "18.1024",
  },
  telephone: "+46833320300",
  email: "info@nollettan.se",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
  ],
  servesCuisine: ["Swedish", "Italian", "Mediterranean", "Vegetarian"],
  priceRange: "$$",
  acceptsReservations: "True",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "65",
  },
  hasMenu: [
    {
      "@type": "Menu",
      name: "Dagens Lunch",
      description:
        "Serveras måndag-fredag 11:00-14:00 med soppa, salladsbuffé, kaffe och bröd",
    },
    {
      "@type": "Menu",
      name: "Cateringmeny",
      description:
        "Svensk buffé, italiensk och libanesisk catering från 195 kr/person med fri leverans",
    },
  ],
  makesOffer: {
    "@type": "Offer",
    description: "Catering från 195 kr/person med fri leverans i hela Stockholm",
    priceSpecification: {
      "@type": "PriceSpecification",
      price: "195",
      priceCurrency: "SEK",
      description: "Pris per person",
    },
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Noll Ettan",
  image:
    "https://storage.googleapis.com/gpt-engineer-file-uploads/2qURdbKI4TP2Vdw9MHE6cL5QAQr1/social-images/social-1758110731633-Logotyp.png",
  description:
    "Kvarterskrog och cateringservice i Hammarby Sjöstad, Stockholm. Lunch vardagar 11-14. Catering från 195 kr/pers.",
  "@id": "https://nollettan.se",
  url: "https://nollettan.se",
  telephone: "+46833320300",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hammarbybacken 27",
    postalCode: "120 30",
    addressLocality: "Stockholm",
    addressRegion: "Stockholm",
    addressCountry: "SE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "59.3007",
    longitude: "18.1024",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "65",
  },
  priceRange: "$$",
};
