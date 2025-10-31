import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  saveMenuData: () => Promise<void>;
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
  isSaving: boolean;
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
  const [menuData, setMenuData] = useState<MenuData>(DEFAULT_MENU);
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimestampRef = useRef<number>(0);
  const { toast } = useToast();

  // Fetch menu data from Supabase
  useEffect(() => {
    loadMenuFromDatabase();
  }, []);

  // Set up real-time subscriptions with debouncing and save prevention
  useEffect(() => {
    if (!currentMenuId) return;

    let reloadTimer: NodeJS.Timeout;

    const handleDatabaseChange = () => {
      // Don't reload if we just saved (within 3 seconds)
      const timeSinceLastSave = Date.now() - saveTimestampRef.current;
      if (timeSinceLastSave < 3000) {
        console.log('Skipping reload - recent save detected');
        return;
      }

      // Don't reload if currently saving
      if (isSaving) {
        console.log('Skipping reload - save in progress');
        return;
      }

      clearTimeout(reloadTimer);
      // Wait 500ms after last change before reloading to avoid rapid reloads
      reloadTimer = setTimeout(() => {
        console.log('Database changed, reloading menu...');
        loadMenuFromDatabase();
      }, 500);
    };

    const channel = supabase
      .channel('menu-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'menu_data',
        filter: `id=eq.${currentMenuId}`
      }, handleDatabaseChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'weekly_lunch'
      }, handleDatabaseChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'menu_items'
      }, handleDatabaseChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lunch_included'
      }, handleDatabaseChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lunch_pricing'
      }, handleDatabaseChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'category_texts'
      }, handleDatabaseChange)
      .subscribe();

    return () => {
      clearTimeout(reloadTimer);
      supabase.removeChannel(channel);
    };
  }, [currentMenuId, isSaving]);

  const loadMenuFromDatabase = async () => {
    try {
      // Get the most recent menu_data
      const { data: menuDataRows, error: menuDataError } = await supabase
        .from('menu_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (menuDataError) throw menuDataError;

      if (!menuDataRows || menuDataRows.length === 0) {
        // No menu in database, initialize with default
        await initializeDefaultMenu();
        return;
      }

      const menuRecord = menuDataRows[0];
      setCurrentMenuId(menuRecord.id);

      // Fetch all related data
      const [weeklyLunchRes, menuItemsRes, lunchIncludedRes, lunchPricingRes, categoryTextsRes] = await Promise.all([
        supabase.from('weekly_lunch').select('*').eq('menu_data_id', menuRecord.id).order('order_index'),
        supabase.from('menu_items').select('*').eq('menu_data_id', menuRecord.id).order('order_index'),
        supabase.from('lunch_included').select('*').eq('menu_data_id', menuRecord.id).order('order_index'),
        supabase.from('lunch_pricing').select('*').eq('menu_data_id', menuRecord.id).single(),
        supabase.from('category_texts').select('*').eq('menu_data_id', menuRecord.id).single()
      ]);

      // Transform database data to MenuData format
      const weeklyLunch: DayMenu[] = (weeklyLunchRes.data || []).map(row => ({
        day: row.day,
        meals: (row.meals as unknown) as WeeklyMeal[]
      }));

      const alwaysOnMenu = (menuItemsRes.data || [])
        .filter(item => item.category === 'alwaysOnMenu')
        .map(item => ({
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: 'Alltid på Noll Ettan'
        }));

      const pinsaPizza = (menuItemsRes.data || [])
        .filter(item => item.category === 'pinsaPizza')
        .map(item => ({
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: 'Pinsa Pizza'
        }));

      const salads = (menuItemsRes.data || [])
        .filter(item => item.category === 'salads')
        .map(item => ({
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: 'Sallader'
        }));

      const pasta = (menuItemsRes.data || [])
        .filter(item => item.category === 'pasta')
        .map(item => ({
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: 'Pasta'
        }));

      const dbLunchIncluded = (lunchIncludedRes.data || []).map(row => ({
        name: row.name,
        icon: row.icon
      }));
      const lunchIncluded: LunchIncludedItem[] = dbLunchIncluded.length > 0 
        ? dbLunchIncluded 
        : DEFAULT_MENU.lunchIncluded;

      const lunchPricing: LunchPricing = lunchPricingRes.data ? {
        onSite: lunchPricingRes.data.on_site,
        takeaway: lunchPricingRes.data.takeaway
      } : DEFAULT_MENU.lunchPricing;

      const categoryTexts: CategoryTexts = categoryTextsRes.data ? {
        alwaysOnTitle: categoryTextsRes.data.always_on_title || '',
        alwaysOnDescription: categoryTextsRes.data.always_on_description || '',
        pinsaPizzaTitle: categoryTextsRes.data.pinsa_pizza_title || '',
        pinsaPizzaDescription: categoryTextsRes.data.pinsa_pizza_description || '',
        saladsTitle: categoryTextsRes.data.salads_title || '',
        saladsDescription: categoryTextsRes.data.salads_description || '',
        pastaTitle: categoryTextsRes.data.pasta_title || '',
        pastaDescription: categoryTextsRes.data.pasta_description || ''
      } : DEFAULT_MENU.categoryTexts;

      setMenuData({
        week: menuRecord.week,
        weeklyLunch,
        alwaysOnMenu,
        pinsaPizza,
        salads,
        pasta,
        lunchIncluded,
        lunchPricing,
        categoryTexts
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading menu from database:', error);
      toast({
        title: "Error",
        description: "Kunde inte ladda menyn från databasen",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const initializeDefaultMenu = async () => {
    try {
      // Create menu_data record
      const { data: menuRecord, error: menuError } = await supabase
        .from('menu_data')
        .insert({ week: DEFAULT_MENU.week })
        .select()
        .single();

      if (menuError) throw menuError;
      setCurrentMenuId(menuRecord.id);

      // Insert weekly lunch
      const weeklyLunchData = DEFAULT_MENU.weeklyLunch.map((day, index) => ({
        menu_data_id: menuRecord.id,
        day: day.day,
        meals: day.meals as unknown as any,
        order_index: index
      }));
      await supabase.from('weekly_lunch').insert(weeklyLunchData);

      // Insert menu items
      const menuItemsData = [
        ...DEFAULT_MENU.alwaysOnMenu.map((item, index) => ({
          menu_data_id: menuRecord.id,
          category: 'alwaysOnMenu',
          name: item.name,
          description: item.description,
          price: item.price,
          order_index: index
        })),
        ...DEFAULT_MENU.pinsaPizza.map((item, index) => ({
          menu_data_id: menuRecord.id,
          category: 'pinsaPizza',
          name: item.name,
          description: item.description,
          price: item.price,
          order_index: index
        })),
        ...DEFAULT_MENU.salads.map((item, index) => ({
          menu_data_id: menuRecord.id,
          category: 'salads',
          name: item.name,
          description: item.description,
          price: item.price,
          order_index: index
        })),
        ...DEFAULT_MENU.pasta.map((item, index) => ({
          menu_data_id: menuRecord.id,
          category: 'pasta',
          name: item.name,
          description: item.description,
          price: item.price,
          order_index: index
        }))
      ];
      await supabase.from('menu_items').insert(menuItemsData);

      // Insert lunch included
      const lunchIncludedData = DEFAULT_MENU.lunchIncluded.map((item, index) => ({
        menu_data_id: menuRecord.id,
        name: item.name,
        icon: item.icon,
        order_index: index
      }));
      await supabase.from('lunch_included').insert(lunchIncludedData);

      // Insert lunch pricing
      await supabase.from('lunch_pricing').insert({
        menu_data_id: menuRecord.id,
        on_site: DEFAULT_MENU.lunchPricing.onSite,
        takeaway: DEFAULT_MENU.lunchPricing.takeaway
      });

      // Insert category texts
      await supabase.from('category_texts').insert({
        menu_data_id: menuRecord.id,
        always_on_title: DEFAULT_MENU.categoryTexts.alwaysOnTitle,
        always_on_description: DEFAULT_MENU.categoryTexts.alwaysOnDescription,
        pinsa_pizza_title: DEFAULT_MENU.categoryTexts.pinsaPizzaTitle,
        pinsa_pizza_description: DEFAULT_MENU.categoryTexts.pinsaPizzaDescription,
        salads_title: DEFAULT_MENU.categoryTexts.saladsTitle,
        salads_description: DEFAULT_MENU.categoryTexts.saladsDescription,
        pasta_title: DEFAULT_MENU.categoryTexts.pastaTitle,
        pasta_description: DEFAULT_MENU.categoryTexts.pastaDescription
      });

      await loadMenuFromDatabase();
    } catch (error) {
      console.error('Error initializing default menu:', error);
      toast({
        title: "Error",
        description: "Kunde inte initiera menyn",
        variant: "destructive"
      });
    }
  };

  const saveToDatabase = async (data: MenuData, options?: { timeoutMs?: number; silent?: boolean }) => {
    if (!currentMenuId) {
      throw new Error('No menu ID found');
    }

    const { timeoutMs = 20000, silent = false } = options || {};
    const startTime = Date.now();
    setIsSaving(true);
    saveTimestampRef.current = Date.now();

    try {
      // PHASE 1 FIX: Explicit Permission Checking
      console.log('[SaveDB] Starting save operation...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('[SaveDB] No active session:', sessionError);
        throw new Error('SESSION_EXPIRED');
      }

      console.log('[SaveDB] Session valid, checking admin permissions...');
      
      const { data: adminRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError) {
        console.error('[SaveDB] Error checking admin role:', roleError);
        throw new Error('PERMISSION_CHECK_FAILED');
      }

      if (!adminRole) {
        console.error('[SaveDB] User is not admin');
        throw new Error('NOT_ADMIN');
      }

      console.log('[SaveDB] Permissions verified, proceeding with save...');

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
      });

      await Promise.race([
        (async () => {
          // Update week number
          console.log('[SaveDB] Updating week number...');
          const { error: weekError } = await supabase
            .from('menu_data')
            .update({ week: data.week })
            .eq('id', currentMenuId);
          
          if (weekError) {
            console.error('[SaveDB] Week update failed:', weekError);
            throw new Error(`WEEK_UPDATE_FAILED: ${weekError.message}`);
          }

          // PHASE 1 FIX: Transaction Safety - Delete old data
          console.log('[SaveDB] Deleting old data...');
          const deleteResults = await Promise.all([
            supabase.from('weekly_lunch').delete().eq('menu_data_id', currentMenuId),
            supabase.from('menu_items').delete().eq('menu_data_id', currentMenuId),
            supabase.from('lunch_included').delete().eq('menu_data_id', currentMenuId),
            supabase.from('lunch_pricing').delete().eq('menu_data_id', currentMenuId),
            supabase.from('category_texts').delete().eq('menu_data_id', currentMenuId)
          ]);

          // Check for delete errors
          const deleteErrors = deleteResults.filter(r => r.error);
          if (deleteErrors.length > 0) {
            console.error('[SaveDB] Delete operations failed:', deleteErrors);
            throw new Error(`DELETE_FAILED: ${deleteErrors.map(e => e.error?.message).join(', ')}`);
          }

          // Prepare insert data
          console.log('[SaveDB] Preparing insert data...');
          const weeklyLunchData = data.weeklyLunch.map((day, index) => ({
            menu_data_id: currentMenuId,
            day: day.day,
            meals: day.meals as unknown as any,
            order_index: index
          }));

          const menuItemsData = [
            ...data.alwaysOnMenu.map((item, index) => ({
              menu_data_id: currentMenuId,
              category: 'alwaysOnMenu',
              name: item.name,
              description: item.description,
              price: item.price,
              order_index: index
            })),
            ...data.pinsaPizza.map((item, index) => ({
              menu_data_id: currentMenuId,
              category: 'pinsaPizza',
              name: item.name,
              description: item.description,
              price: item.price,
              order_index: index
            })),
            ...data.salads.map((item, index) => ({
              menu_data_id: currentMenuId,
              category: 'salads',
              name: item.name,
              description: item.description,
              price: item.price,
              order_index: index
            })),
            ...data.pasta.map((item, index) => ({
              menu_data_id: currentMenuId,
              category: 'pasta',
              name: item.name,
              description: item.description,
              price: item.price,
              order_index: index
            }))
          ];

          const lunchIncludedData = data.lunchIncluded.map((item, index) => ({
            menu_data_id: currentMenuId,
            name: item.name,
            icon: item.icon,
            order_index: index
          }));

          // PHASE 1 FIX: Better Error Logging - Insert new data with detailed logging
          console.log('[SaveDB] Inserting weekly lunch...');
          const weeklyLunchResult = await supabase.from('weekly_lunch').insert(weeklyLunchData);
          if (weeklyLunchResult.error) {
            console.error('[SaveDB] Weekly lunch insert failed:', weeklyLunchResult.error);
            throw new Error(`WEEKLY_LUNCH_INSERT_FAILED: ${weeklyLunchResult.error.message}`);
          }

          console.log('[SaveDB] Inserting menu items...');
          const menuItemsResult = menuItemsData.length > 0 
            ? await supabase.from('menu_items').insert(menuItemsData)
            : { error: null };
          if (menuItemsResult.error) {
            console.error('[SaveDB] Menu items insert failed:', menuItemsResult.error);
            throw new Error(`MENU_ITEMS_INSERT_FAILED: ${menuItemsResult.error.message}`);
          }

          console.log('[SaveDB] Inserting lunch included...');
          const lunchIncludedResult = lunchIncludedData.length > 0
            ? await supabase.from('lunch_included').insert(lunchIncludedData)
            : { error: null };
          if (lunchIncludedResult.error) {
            console.error('[SaveDB] Lunch included insert failed:', lunchIncludedResult.error);
            throw new Error(`LUNCH_INCLUDED_INSERT_FAILED: ${lunchIncludedResult.error.message}`);
          }

          console.log('[SaveDB] Inserting lunch pricing...');
          const pricingResult = await supabase.from('lunch_pricing').insert({
            menu_data_id: currentMenuId,
            on_site: data.lunchPricing.onSite,
            takeaway: data.lunchPricing.takeaway
          });
          if (pricingResult.error) {
            console.error('[SaveDB] Lunch pricing insert failed:', pricingResult.error);
            throw new Error(`LUNCH_PRICING_INSERT_FAILED: ${pricingResult.error.message}`);
          }

          console.log('[SaveDB] Inserting category texts...');
          const categoryResult = await supabase.from('category_texts').insert({
            menu_data_id: currentMenuId,
            always_on_title: data.categoryTexts.alwaysOnTitle,
            always_on_description: data.categoryTexts.alwaysOnDescription,
            pinsa_pizza_title: data.categoryTexts.pinsaPizzaTitle,
            pinsa_pizza_description: data.categoryTexts.pinsaPizzaDescription,
            salads_title: data.categoryTexts.saladsTitle,
            salads_description: data.categoryTexts.saladsDescription,
            pasta_title: data.categoryTexts.pastaTitle,
            pasta_description: data.categoryTexts.pastaDescription
          });
          if (categoryResult.error) {
            console.error('[SaveDB] Category texts insert failed:', categoryResult.error);
            throw new Error(`CATEGORY_TEXTS_INSERT_FAILED: ${categoryResult.error.message}`);
          }

          const duration = Date.now() - startTime;
          console.log(`[SaveDB] ✓ Menu saved successfully in ${duration}ms`);
        })(),
        timeoutPromise
      ]);

      if (!silent) {
        toast({
          title: 'Sparad!',
          description: 'Menyn har uppdaterats.',
        });
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`[SaveDB] ✗ Error after ${duration}ms:`, error);

      if (!silent) {
        // PHASE 1 FIX: Better Error Messages
        let errorTitle = 'Fel';
        let errorDescription = 'Kunde inte spara menyn. Försök igen.';

        if (error.message === 'TIMEOUT') {
          errorTitle = 'Timeout';
          errorDescription = 'Sparningen tog för lång tid (>20s). Försök igen.';
        } else if (error.message === 'SESSION_EXPIRED') {
          errorTitle = 'Session utgången';
          errorDescription = 'Din session har löpt ut. Logga in igen.';
        } else if (error.message === 'NOT_ADMIN') {
          errorTitle = 'Åtkomst nekad';
          errorDescription = 'Du har inte administratörsbehörighet.';
        } else if (error.message === 'PERMISSION_CHECK_FAILED') {
          errorTitle = 'Behörighetskontroll misslyckades';
          errorDescription = 'Kunde inte verifiera behörigheter. Försök igen.';
        } else if (error.message?.includes('_FAILED:')) {
          const [operation, details] = error.message.split(': ');
          errorTitle = 'Databasfel';
          errorDescription = `${operation.replace(/_/g, ' ')}: ${details}`;
        }

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: 'destructive'
        });
      }
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateMenuData = (data: MenuData) => {
    setMenuData(data);
    // AUTO-SAVE REMOVED - Only save when saveMenuData() is called explicitly
  };

  const saveMenuData = async () => {
    // Show a persistent toast we can update
    const saving = toast({ title: 'Sparar...', description: 'Skickar ändringar' });
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await saveToDatabase(menuData, { timeoutMs: 20000, silent: true });
        saving.update({ id: saving.id, title: 'Sparat!', description: 'Menyn har uppdaterats.' });
        setTimeout(() => saving.dismiss(), 1500);
        return;
      } catch (err) {
        if (attempt < maxAttempts) {
          saving.update({ id: saving.id, title: 'Misslyckades - försöker igen', description: `Försök ${attempt + 1} av ${maxAttempts}...` });
          await new Promise((res) => setTimeout(res, attempt * 800));
        } else {
          saving.update({ id: saving.id, title: 'Misslyckades', description: 'Kunde inte spara. Försök igen.' });
          // Keep toast visible so user can see the result
          throw err as any;
        }
      }
    }
  };

  const updateDayMenu = (dayIndex: number, meals: WeeklyMeal[]) => {
    const updatedData = {
      ...menuData,
      weeklyLunch: menuData.weeklyLunch.map((day, index) => 
        index === dayIndex ? { ...day, meals } : day
      )
    };
    setMenuData(updatedData);
    // AUTO-SAVE REMOVED
  };


  // Always On Menu handlers
  const updateAlwaysOnMenu = (index: number, item: MenuItem) => {
    const updatedItems = menuData.alwaysOnMenu.map((menuItem, i) => 
      i === index ? item : menuItem
    );
    setMenuData({ ...menuData, alwaysOnMenu: updatedItems });
  };

  const addAlwaysOnMenuItem = (item: MenuItem) => {
    setMenuData({
      ...menuData,
      alwaysOnMenu: [...menuData.alwaysOnMenu, item]
    });
  };

  const deleteAlwaysOnMenuItem = (index: number) => {
    const updatedItems = menuData.alwaysOnMenu.filter((_, i) => i !== index);
    setMenuData({ ...menuData, alwaysOnMenu: updatedItems });
  };

  // Pinsa Pizza handlers
  const updatePinsaPizza = (index: number, item: MenuItem) => {
    const updatedItems = menuData.pinsaPizza.map((menuItem, i) => 
      i === index ? item : menuItem
    );
    setMenuData({ ...menuData, pinsaPizza: updatedItems });
  };

  const addPinsaPizza = (item: MenuItem) => {
    setMenuData({
      ...menuData,
      pinsaPizza: [...menuData.pinsaPizza, item]
    });
  };

  const deletePinsaPizza = (index: number) => {
    const updatedItems = menuData.pinsaPizza.filter((_, i) => i !== index);
    setMenuData({ ...menuData, pinsaPizza: updatedItems });
  };

  // Salads handlers
  const updateSalad = (index: number, item: MenuItem) => {
    const updatedItems = menuData.salads.map((menuItem, i) => 
      i === index ? item : menuItem
    );
    setMenuData({ ...menuData, salads: updatedItems });
  };

  const addSalad = (item: MenuItem) => {
    setMenuData({
      ...menuData,
      salads: [...menuData.salads, item]
    });
  };

  const deleteSalad = (index: number) => {
    const updatedItems = menuData.salads.filter((_, i) => i !== index);
    setMenuData({ ...menuData, salads: updatedItems });
  };

  // Pasta handlers
  const updatePasta = (index: number, item: MenuItem) => {
    const updatedItems = menuData.pasta.map((menuItem, i) => 
      i === index ? item : menuItem
    );
    setMenuData({ ...menuData, pasta: updatedItems });
  };

  const addPasta = (item: MenuItem) => {
    setMenuData({
      ...menuData,
      pasta: [...menuData.pasta, item]
    });
  };

  const deletePasta = (index: number) => {
    const updatedItems = menuData.pasta.filter((_, i) => i !== index);
    setMenuData({ ...menuData, pasta: updatedItems });
  };

  // Lunch Included handlers
  const updateLunchIncluded = (index: number, item: LunchIncludedItem) => {
    const updatedItems = menuData.lunchIncluded.map((includedItem, i) => 
      i === index ? item : includedItem
    );
    setMenuData({ ...menuData, lunchIncluded: updatedItems });
  };

  const addLunchIncluded = (item: LunchIncludedItem) => {
    setMenuData({
      ...menuData,
      lunchIncluded: [...menuData.lunchIncluded, item]
    });
  };

  const deleteLunchIncluded = (index: number) => {
    const updatedItems = menuData.lunchIncluded.filter((_, i) => i !== index);
    setMenuData({ ...menuData, lunchIncluded: updatedItems });
  };

  // Lunch Pricing handlers
  const updateLunchPricing = (pricing: LunchPricing) => {
    setMenuData({ ...menuData, lunchPricing: pricing });
  };

  // Week handlers
  const updateWeek = (week: number) => {
    setMenuData({ ...menuData, week });
  };

  // Category Texts handlers
  const updateCategoryTexts = (texts: CategoryTexts) => {
    setMenuData({ ...menuData, categoryTexts: texts });
  };

  return (
    <MenuContext.Provider value={{ 
      menuData, 
      updateMenuData, 
      saveMenuData,
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
      updateCategoryTexts,
      isSaving
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