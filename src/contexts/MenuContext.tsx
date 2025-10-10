import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Weekly lunch items (no prices)
export interface WeeklyMeal {
  name: string;
  description: string;
  type: 'Kött' | 'Fisk' | 'Veg';
}

export interface DayMenu {
  day: string;
  meals: WeeklyMeal[];
}

// Individual menu items (with prices)
export interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface CategoryTexts {
  alwaysOnTitle: string;
  alwaysOnDescription: string;
  pinsaPizzaTitle: string;
  pinsaPizzaDescription: string;
  saladsTitle: string;
  saladsDescription: string;
  pastaTitle: string;
  pastaDescription: string;
}

export interface MenuData {
  week: number;
  weeklyLunch: DayMenu[];
  alwaysOnMenu: MenuItem[];
  pinsaPizza: MenuItem[];
  salads: MenuItem[];
  pasta: MenuItem[];
  lunchIncluded: LunchIncludedItem[];
  lunchPricing: LunchPricing;
  categoryTexts: CategoryTexts;
}

export interface LunchIncludedItem {
  name: string;
  icon: string;
}

export interface LunchPricing {
  onSite: number;
  takeaway: number;
}

interface MenuContextType {
  menuData: MenuData;
  updateMenuData: (data: MenuData) => void;
  updateDayMenu: (dayIndex: number, meals: WeeklyMeal[]) => void;
  updateAlwaysOnMenu: (index: number, item: MenuItem) => void;
  addAlwaysOnMenuItem: (item: MenuItem) => void;
  deleteAlwaysOnMenuItem: (index: number) => void;
  updatePinsaPizza: (index: number, item: MenuItem) => void;
  addPinsaPizza: (item: MenuItem) => void;
  deletePinsaPizza: (index: number) => void;
  updateSalad: (index: number, item: MenuItem) => void;
  addSalad: (item: MenuItem) => void;
  deleteSalad: (index: number) => void;
  updatePasta: (index: number, item: MenuItem) => void;
  addPasta: (item: MenuItem) => void;
  deletePasta: (index: number) => void;
  updateLunchIncluded: (index: number, item: LunchIncludedItem) => void;
  addLunchIncludedItem: (item: LunchIncludedItem) => void;
  deleteLunchIncludedItem: (index: number) => void;
  updateLunchPricing: (pricing: LunchPricing) => void;
  updateWeek: (week: number) => void;
  updateCategoryTexts: (texts: CategoryTexts) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const DEFAULT_MENU: MenuData = {
  week: 41,
  categoryTexts: {
    alwaysOnTitle: "Alltid på Nollettan",
    alwaysOnDescription: "Våra populära rätter som alltid finns tillgängliga",
    pinsaPizzaTitle: "Pinsa Pizza",
    pinsaPizzaDescription: "Italiensk pinsa med färska ingredienser",
    saladsTitle: "Sallader", 
    saladsDescription: "Fräscha och näringsrika sallader",
    pastaTitle: "Pasta",
    pastaDescription: "Hemgjord pasta med italienska smaker"
  },
  weeklyLunch: [
    {
      day: "Måndag",
      meals: [
        {
          name: "Fyllda oxrullader",
          description: "bacon & purjolök, kantarellsås, potatismos",
          type: "Kött"
        },
        {
          name: "Gratinerad koljafilé",
          description: "vitvinssås, sockerärtor, purjolök, parmesan, potatismos",
          type: "Fisk"
        },
        {
          name: "Svamp toast",
          description: "stuvad blandsvamp, parmesan, sidosallad",
          type: "Veg"
        }
      ]
    },
    {
      day: "Tisdag",
      meals: [
        {
          name: "Nattbakad fläskkarre",
          description: "pepparsky, potatisgratäng, haricots verts",
          type: "Kött"
        },
        {
          name: "Fisk & skaldjursqueneller",
          description: "champagnesås, pilaffris",
          type: "Fisk"
        },
        {
          name: "Svamp toast",
          description: "stuvad blandsvamp, parmesan, sidosallad",
          type: "Veg"
        }
      ]
    },
    {
      day: "Onsdag",
      meals: [
        {
          name: "Köttbullar",
          description: "gräddsås, lingon, saltgurka, potatismos",
          type: "Kött"
        },
        {
          name: "Stekt panerad torskfilé",
          description: "skagenröra, ärtor, kokt potatis",
          type: "Fisk"
        },
        {
          name: "Svamp toast",
          description: "stuvad blandsvamp, parmesan, sidosallad",
          type: "Veg"
        }
      ]
    },
    {
      day: "Torsdag",
      meals: [
        {
          name: "Schnitzel",
          description: "tryffelmayo, rödvinssås, råstekt potatis",
          type: "Kött"
        },
        {
          name: "Thai fishcakes",
          description: "chili & lime, asiapesto, udonnudelsallad",
          type: "Fisk"
        },
        {
          name: "Morotsrisotto",
          description: "rostad morot, parmesan",
          type: "Veg"
        }
      ]
    },
    {
      day: "Fredag",
      meals: [
        {
          name: "Lasagne al forno",
          description: "ruccola, basilika, parmesan",
          type: "Kött"
        },
        {
          name: "Smörstekt sejfilé",
          description: "dill & pepparrotmayo, citron, kokt potatis",
          type: "Fisk"
        },
        {
          name: "Morotsrisotto",
          description: "rostad morot, parmesan",
          type: "Veg"
        }
      ]
    }
  ],
  alwaysOnMenu: [
    {
      name: "Dahlens köttbullar",
      description: "Gräddsås, lingon, gurka, potatis",
      price: 185,
      category: "Alltid på Noll Ettan"
    },
    {
      name: "Caesarsallad",
      description: "Kyckling, bacon, krutonger, parmesan",
      price: 155,
      category: "Alltid på Noll Ettan"
    },
    {
      name: "Räksallad",
      description: "Lök, avokado, ägg, citron, aioli",
      price: 165,
      category: "Alltid på Noll Ettan"
    },
    {
      name: "Caesarsallad ala räkor",
      description: "Bacon, krutonger, parmesan, räkor",
      price: 165,
      category: "Alltid på Noll Ettan"
    },
    {
      name: "Kycklingsallad",
      description: "Avokado, picklad rödlök, aioli",
      price: 155,
      category: "Alltid på Noll Ettan"
    },
    {
      name: "Halloumisallad",
      description: "Avokado, picklad rödlök, aioli",
      price: 165,
      category: "Alltid på Noll Ettan"
    }
  ],
  pinsaPizza: [
    {
      name: "Burratina",
      description: "Tomatsås, burrata, basilika, olivolja, balsamico",
      price: 135,
      category: "Pinsa Pizza"
    },
    {
      name: "Parma",
      description: "Tomatsås, mozzarella, prosciutto di parma, ruccola & parmesan",
      price: 140,
      category: "Pinsa Pizza"
    },
    {
      name: "Gamberi",
      description: "Tomatsås, mozzarella, scampi, chili, vitlök, persilja, citron",
      price: 140,
      category: "Pinsa Pizza"
    }
  ],
  salads: [
    {
      name: "Räksallad",
      description: "Avokado, ägg, picklad rödlök, tomat, citron, sockerärtor, örtdressing",
      price: 165,
      category: "Sallader"
    },
    {
      name: "Caesarsallad",
      description: "Kyckling, bacon, krutonger, parmesan",
      price: 165,
      category: "Sallader"
    },
    {
      name: "Caesarsallad ala räkor",
      description: "Räkor, bacon, krutonger, parmesan",
      price: 165,
      category: "Sallader"
    },
    {
      name: "Laxsallad",
      description: "Varmrökt lax, fransk potatissallad, avokado, sockerärtor, morot & fänkålskruditér, örtdressing",
      price: 175,
      category: "Sallader"
    },
    {
      name: "Asiatisk kycklingsallad",
      description: "Kycklinglårfilé, glasnudlar, sockerärtor, rödlök, tomat, picklad morot, koriander, chili & lime, sesamdressing",
      price: 175,
      category: "Sallader"
    },
    {
      name: "Halloumisallad",
      description: "Friterad halloumi, picklad rödlök, avokado, sockerärtor, cocktailtomat, rostade pumpakärnor, balsamicodressing",
      price: 175,
      category: "Sallader"
    },
    {
      name: "Burratasallad",
      description: "Avokado, pesto, cocktailtomat, picklad rödlök, picklad morot, balsamicodressing",
      price: 165,
      category: "Sallader"
    }
  ],
  pasta: [
    {
      name: "Bucatini Bolognese",
      description: "Köttfärssås (nötfärs), basilika, parmesan",
      price: 140,
      category: "Pasta"
    },
    {
      name: "Bucatini Carbonara",
      description: "Bacon, grädde, svartpeppar, äggula, parmesan",
      price: 140,
      category: "Pasta"
    },
    {
      name: "Bucatini Arrabiata",
      description: "Tomatsås, chili, vitlök, basilika, burrata",
      price: 140,
      category: "Pasta"
    },
    {
      name: "Bucatini Scampi",
      description: "Tomatsås, scampi, chili, vitlök, vitt vin, persilja",
      price: 150,
      category: "Pasta"
    },
    {
      name: "Casarecce Pesto",
      description: "Basilika, vitlök, tomat, parmesan, burrata",
      price: 140,
      category: "Pasta"
    },
    {
      name: "Casarecce Tartufo",
      description: "Tärnad biff, tryffel, grädde, babyspenat, parmesan",
      price: 150,
      category: "Pasta"
    }
  ],
  lunchIncluded: [
    {
      name: "Dagens soppa",
      icon: "Soup"
    },
    {
      name: "Salladsbuffé",
      icon: "Salad"
    },
    {
      name: "Nybakat bröd",
      icon: "Cookie"
    },
    {
      name: "Kaffe",
      icon: "Coffee"
    },
    {
      name: "En liten godbit",
      icon: "Heart"
    }
  ],
  lunchPricing: {
    onSite: 155,
    takeaway: 140
  }
};

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuData, setMenuData] = useState<MenuData>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('nollettan-menu');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Merge with defaults to ensure all new fields exist
        return {
          ...DEFAULT_MENU,
          ...parsedData,
          // Ensure new fields exist
          lunchIncluded: parsedData.lunchIncluded || DEFAULT_MENU.lunchIncluded,
          lunchPricing: parsedData.lunchPricing || DEFAULT_MENU.lunchPricing,
          alwaysOnMenu: parsedData.alwaysOnMenu || DEFAULT_MENU.alwaysOnMenu,
          pinsaPizza: parsedData.pinsaPizza || DEFAULT_MENU.pinsaPizza,
          salads: parsedData.salads || DEFAULT_MENU.salads,
          pasta: parsedData.pasta || DEFAULT_MENU.pasta,
          categoryTexts: parsedData.categoryTexts || DEFAULT_MENU.categoryTexts
        };
      } catch (error) {
        console.error('Error parsing saved menu data:', error);
        return DEFAULT_MENU;
      }
    }
    return DEFAULT_MENU;
  });

  const updateMenuData = (data: MenuData) => {
    setMenuData(data);
    localStorage.setItem('nollettan-menu', JSON.stringify(data));
  };

  const updateDayMenu = (dayIndex: number, meals: WeeklyMeal[]) => {
    const updatedData = {
      ...menuData,
      weeklyLunch: menuData.weeklyLunch.map((day, index) => 
        index === dayIndex ? { ...day, meals } : day
      )
    };
    updateMenuData(updatedData);
  };


  // Always On Menu handlers
  const updateAlwaysOnMenu = (index: number, item: MenuItem) => {
    const updatedItems = menuData.alwaysOnMenu.map((menuItem, i) => 
      i === index ? item : menuItem
    );
    const updatedData = { ...menuData, alwaysOnMenu: updatedItems };
    updateMenuData(updatedData);
  };

  const addAlwaysOnMenuItem = (item: MenuItem) => {
    const updatedData = {
      ...menuData,
      alwaysOnMenu: [...menuData.alwaysOnMenu, item]
    };
    updateMenuData(updatedData);
  };

  const deleteAlwaysOnMenuItem = (index: number) => {
    const updatedItems = menuData.alwaysOnMenu.filter((_, i) => i !== index);
    const updatedData = { ...menuData, alwaysOnMenu: updatedItems };
    updateMenuData(updatedData);
  };

  // Pinsa Pizza handlers
  const updatePinsaPizza = (index: number, item: MenuItem) => {
    const updatedItems = menuData.pinsaPizza.map((menuItem, i) => 
      i === index ? item : menuItem
    );
    const updatedData = { ...menuData, pinsaPizza: updatedItems };
    updateMenuData(updatedData);
  };

  const addPinsaPizza = (item: MenuItem) => {
    const updatedData = {
      ...menuData,
      pinsaPizza: [...menuData.pinsaPizza, item]
    };
    updateMenuData(updatedData);
  };

  const deletePinsaPizza = (index: number) => {
    const updatedItems = menuData.pinsaPizza.filter((_, i) => i !== index);
    const updatedData = { ...menuData, pinsaPizza: updatedItems };
    updateMenuData(updatedData);
  };

  // Salads handlers
  const updateSalad = (index: number, item: MenuItem) => {
    const updatedItems = menuData.salads.map((menuItem, i) => 
      i === index ? item : menuItem
    );
    const updatedData = { ...menuData, salads: updatedItems };
    updateMenuData(updatedData);
  };

  const addSalad = (item: MenuItem) => {
    const updatedData = {
      ...menuData,
      salads: [...menuData.salads, item]
    };
    updateMenuData(updatedData);
  };

  const deleteSalad = (index: number) => {
    const updatedItems = menuData.salads.filter((_, i) => i !== index);
    const updatedData = { ...menuData, salads: updatedItems };
    updateMenuData(updatedData);
  };

  // Pasta handlers
  const updatePasta = (index: number, item: MenuItem) => {
    const updatedItems = menuData.pasta.map((menuItem, i) => 
      i === index ? item : menuItem
    );
    const updatedData = { ...menuData, pasta: updatedItems };
    updateMenuData(updatedData);
  };

  const addPasta = (item: MenuItem) => {
    const updatedData = {
      ...menuData,
      pasta: [...menuData.pasta, item]
    };
    updateMenuData(updatedData);
  };

  const deletePasta = (index: number) => {
    const updatedItems = menuData.pasta.filter((_, i) => i !== index);
    const updatedData = { ...menuData, pasta: updatedItems };
    updateMenuData(updatedData);
  };

  // Lunch Included handlers
  const updateLunchIncluded = (index: number, item: LunchIncludedItem) => {
    const updatedItems = menuData.lunchIncluded.map((includedItem, i) => 
      i === index ? item : includedItem
    );
    const updatedData = { ...menuData, lunchIncluded: updatedItems };
    updateMenuData(updatedData);
  };

  const addLunchIncluded = (item: LunchIncludedItem) => {
    const updatedData = {
      ...menuData,
      lunchIncluded: [...menuData.lunchIncluded, item]
    };
    updateMenuData(updatedData);
  };

  const deleteLunchIncluded = (index: number) => {
    const updatedItems = menuData.lunchIncluded.filter((_, i) => i !== index);
    const updatedData = { ...menuData, lunchIncluded: updatedItems };
    updateMenuData(updatedData);
  };

  // Lunch Pricing handlers
  const updateLunchPricing = (pricing: LunchPricing) => {
    const updatedData = { ...menuData, lunchPricing: pricing };
    updateMenuData(updatedData);
  };

  // Week handlers
  const updateWeek = (week: number) => {
    const updatedData = { ...menuData, week };
    updateMenuData(updatedData);
  };

  // Category Texts handlers
  const updateCategoryTexts = (texts: CategoryTexts) => {
    const updatedData = { ...menuData, categoryTexts: texts };
    updateMenuData(updatedData);
  };

  return (
    <MenuContext.Provider value={{ 
      menuData, 
      updateMenuData, 
      updateDayMenu, 
      updateAlwaysOnMenu,
      addAlwaysOnMenuItem,
      deleteAlwaysOnMenuItem,
      updatePinsaPizza,
      addPinsaPizza,
      deletePinsaPizza,
      updateSalad,
      addSalad,
      deleteSalad,
      updatePasta,
      addPasta,
      deletePasta,
      updateLunchIncluded,
      addLunchIncludedItem: addLunchIncluded,
      deleteLunchIncludedItem: deleteLunchIncluded,
      updateLunchPricing,
      updateWeek,
      updateCategoryTexts
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};