import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMenu, WeeklyMeal, MenuItem, MenuData } from "@/contexts/MenuContext";
import { Lock, Save, Plus, Trash2, Eye, EyeOff, Utensils, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
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
    addLunchIncludedItem,
    deleteLunchIncludedItem,
    updateLunchPricing,
    updateWeek,
    updateCategoryTexts
  } = useMenu();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await saveMenuData();
      toast({
        title: "Sparat!",
        description: "Alla ändringar har sparats i databasen.",
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara ändringarna. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has admin role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();
        
        setIsAuthenticated(!!roles);
        if (!roles) {
          toast({
            title: "Åtkomst nekad",
            description: "Du har inte administratörsbehörighet.",
            variant: "destructive"
          });
          await supabase.auth.signOut();
        }
      }
      setIsLoading(false);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();
        setIsAuthenticated(!!roles);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If user doesn't exist, try to sign up and grant admin role
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) throw signUpError;

          if (signUpData.user) {
            // Grant admin role to new user
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: signUpData.user.id,
                role: 'admin'
              });

            if (roleError) {
              console.error('Error granting admin role:', roleError);
              throw new Error('Kunde inte tilldela administratörsrättigheter');
            }

            toast({
              title: "Konto skapat!",
              description: "Du är nu inloggad som administratör.",
            });
          }
        } else {
          throw error;
        }
      } else {
        // Check if existing user has admin role
        const { data: roles, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();

        if (roleError || !roles) {
          await supabase.auth.signOut();
          throw new Error('Du har inte administratörsbehörighet');
        }

        toast({
          title: "Inloggad!",
          description: "Välkommen till admin-panelen.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Inloggning misslyckades",
        description: error.message || "Kontrollera dina uppgifter och försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setEmail('');
    setPassword('');
    toast({
      title: "Utloggad",
      description: "Du har loggats ut från admin-panelen.",
    });
  };

  const handleAddMeal = (dayIndex: number) => {
    const newMeal: WeeklyMeal = {
      name: '',
      description: '',
      type: 'Kött'
    };
    const updatedMeals = [...menuData.weeklyLunch[dayIndex].meals, newMeal];
    updateDayMenu(dayIndex, updatedMeals);
  };

  const handleDeleteMeal = (dayIndex: number, mealIndex: number) => {
    const updatedMeals = menuData.weeklyLunch[dayIndex].meals.filter((_, index) => index !== mealIndex);
    updateDayMenu(dayIndex, updatedMeals);
  };

  const handleMealUpdate = (dayIndex: number, mealIndex: number, field: keyof WeeklyMeal, value: string) => {
    const updatedMeals = menuData.weeklyLunch[dayIndex].meals.map((meal, index) => {
      if (index === mealIndex) {
        return { ...meal, [field]: value };
      }
      return meal;
    });
    updateDayMenu(dayIndex, updatedMeals);
  };


  // Generic handlers for different menu sections
  const createMenuItemHandlers = (
    updateFn: (index: number, item: MenuItem) => void,
    addFn: (item: MenuItem) => void,
    deleteFn: (index: number) => void,
    menuProperty: keyof MenuData,
    categoryDisplayName: string
  ) => ({
    update: (index: number, field: keyof MenuItem, value: string | number) => {
      const items = menuData[menuProperty] as MenuItem[];
      const item = items[index];
      if (!item) return;
      const updatedItem = { ...item, [field]: value };
      updateFn(index, updatedItem);
    },
    add: () => {
      const newItem: MenuItem = {
        name: '',
        description: '',
        price: 0,
        category: categoryDisplayName
      };
      addFn(newItem);
    },
    delete: (index: number) => deleteFn(index)
  });

  const alwaysOnMenuHandlers = createMenuItemHandlers(
    updateAlwaysOnMenu, addAlwaysOnMenuItem, deleteAlwaysOnMenuItem, 'alwaysOnMenu', 'Alltid på Noll Ettan'
  );

  const pinsaPizzaHandlers = createMenuItemHandlers(
    updatePinsaPizza, addPinsaPizza, deletePinsaPizza, 'pinsaPizza', 'Pinsa Pizza'
  );

  const saladsHandlers = createMenuItemHandlers(
    updateSalad, addSalad, deleteSalad, 'salads', 'Sallader'
  );

  const pastaHandlers = createMenuItemHandlers(
    updatePasta, addPasta, deletePasta, 'pasta', 'Pasta'
  );

  const handleWeekUpdate = (week: number) => {
    const updatedData = { ...menuData, week };
    updateMenuData(updatedData);
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-restaurant-dark to-restaurant-darker flex items-center justify-center">
        <div className="text-restaurant-gold text-xl">Laddar...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-restaurant-dark to-restaurant-darker flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-restaurant-gold hover:text-restaurant-gold/80"
              >
                <ArrowLeft className="w-4 h-4" />
                Tillbaka
              </Button>
              <div className="flex-1" />
            </div>
            <CardTitle className="text-2xl text-restaurant-gold flex items-center justify-center gap-2">
              <Lock className="w-6 h-6" />
              Admin Inloggning
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Endast administratörer kan logga in här
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="E-postadress"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Lösenord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-restaurant-gold text-restaurant-dark hover:bg-restaurant-gold/90"
                disabled={isLoading}
              >
                {isLoading ? 'Loggar in...' : 'Logga in'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Första användaren som registrerar sig blir automatiskt administratör
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-restaurant-dark to-restaurant-darker p-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till hemsidan
            </Button>
            <h1 className="text-4xl font-heading text-restaurant-gold">Meny Administration</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
          >
            Logga ut
          </Button>
        </div>

        {/* Week Number */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Veckonummer</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={menuData.week}
              onChange={(e) => handleWeekUpdate(Number(e.target.value))}
              className="w-32"
            />
          </CardContent>
        </Card>

        {/* Category Texts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-restaurant-gold">Kategori Texter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Alltid på Nollettan - Titel</label>
                  <Input
                    value={menuData.categoryTexts?.alwaysOnTitle || ""}
                    onChange={(e) => updateCategoryTexts({
                      ...menuData.categoryTexts,
                      alwaysOnTitle: e.target.value
                    })}
                    placeholder="Alltid på Nollettan"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Alltid på Nollettan - Beskrivning</label>
                  <Textarea
                    value={menuData.categoryTexts?.alwaysOnDescription || ""}
                    onChange={(e) => updateCategoryTexts({
                      ...menuData.categoryTexts,
                      alwaysOnDescription: e.target.value
                    })}
                    placeholder="Beskrivning"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Pinsa Pizza - Titel</label>
                  <Input
                    value={menuData.categoryTexts?.pinsaPizzaTitle || ""}
                    onChange={(e) => updateCategoryTexts({
                      ...menuData.categoryTexts,
                      pinsaPizzaTitle: e.target.value
                    })}
                    placeholder="Pinsa Pizza"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Pinsa Pizza - Beskrivning</label>
                  <Textarea
                    value={menuData.categoryTexts?.pinsaPizzaDescription || ""}
                    onChange={(e) => updateCategoryTexts({
                      ...menuData.categoryTexts,
                      pinsaPizzaDescription: e.target.value
                    })}
                    placeholder="Beskrivning"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Sallader - Titel</label>
                  <Input
                    value={menuData.categoryTexts?.saladsTitle || ""}
                    onChange={(e) => updateCategoryTexts({
                      ...menuData.categoryTexts,
                      saladsTitle: e.target.value
                    })}
                    placeholder="Sallader"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Sallader - Beskrivning</label>
                  <Textarea
                    value={menuData.categoryTexts?.saladsDescription || ""}
                    onChange={(e) => updateCategoryTexts({
                      ...menuData.categoryTexts,
                      saladsDescription: e.target.value
                    })}
                    placeholder="Beskrivning"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Pasta - Titel</label>
                  <Input
                    value={menuData.categoryTexts?.pastaTitle || ""}
                    onChange={(e) => updateCategoryTexts({
                      ...menuData.categoryTexts,
                      pastaTitle: e.target.value
                    })}
                    placeholder="Pasta"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Pasta - Beskrivning</label>
                  <Textarea
                    value={menuData.categoryTexts?.pastaDescription || ""}
                    onChange={(e) => updateCategoryTexts({
                      ...menuData.categoryTexts,
                      pastaDescription: e.target.value
                    })}
                    placeholder="Beskrivning"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Menu - NO PRICES */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-restaurant-gold">Veckans Lunch (Inga priser)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {menuData.weeklyLunch.map((day, dayIndex) => (
                <Card key={dayIndex} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl text-restaurant-gold">{day.day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="border border-muted rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <Badge className={getMealTypeColor(meal.type)}>
                              {meal.type}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMeal(dayIndex, mealIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Typ</label>
                            <Select
                              value={meal.type}
                              onValueChange={(value) => handleMealUpdate(dayIndex, mealIndex, 'type', value as WeeklyMeal['type'])}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Kött">Kött</SelectItem>
                                <SelectItem value="Fisk">Fisk</SelectItem>
                                <SelectItem value="Veg">Veg</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Rätt</label>
                            <Input
                              value={meal.name}
                              onChange={(e) => handleMealUpdate(dayIndex, mealIndex, 'name', e.target.value)}
                              placeholder="Rätt namn"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Beskrivning</label>
                            <Textarea
                              value={meal.description}
                              onChange={(e) => handleMealUpdate(dayIndex, mealIndex, 'description', e.target.value)}
                              placeholder="Beskrivning av rätten"
                              rows={2}
                            />
                          </div>

                          {previewMode && (
                            <div className="bg-muted/10 p-3 rounded border-l-4 border-restaurant-gold">
                              <div className="font-medium text-restaurant-gold">
                                {meal.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {meal.description}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => handleAddMeal(dayIndex)}
                        className="w-full border-dashed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Lägg till rätt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Always On Menu */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-restaurant-gold flex items-center gap-2">
              <Utensils className="w-6 h-6" />
              {menuData.categoryTexts?.alwaysOnTitle || "Alltid på Noll Ettan"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuData.alwaysOnMenu.map((item, index) => (
                <div key={index} className="border border-muted rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-restaurant-gold/20 text-restaurant-gold border-restaurant-gold/30">
                      {item.category}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alwaysOnMenuHandlers.delete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Namn</label>
                      <Input
                        value={item.name}
                        onChange={(e) => alwaysOnMenuHandlers.update(index, 'name', e.target.value)}
                        placeholder="Rätt namn"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Pris (SEK)</label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => alwaysOnMenuHandlers.update(index, 'price', Number(e.target.value))}
                        placeholder="185"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Beskrivning</label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => alwaysOnMenuHandlers.update(index, 'description', e.target.value)}
                      placeholder="Beskrivning av rätten"
                      rows={2}
                    />
                  </div>

                  {previewMode && (
                    <div className="bg-muted/10 p-3 rounded border-l-4 border-restaurant-gold">
                      <div className="font-medium text-restaurant-gold">
                        {item.name} - {item.price} kr
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={alwaysOnMenuHandlers.add}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Lägg till rätt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pinsa Pizza */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-restaurant-gold flex items-center gap-2">
              <Utensils className="w-6 h-6" />
              {menuData.categoryTexts?.pinsaPizzaTitle || "Pinsa Pizza"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuData.pinsaPizza.map((item, index) => (
                <div key={index} className="border border-muted rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-restaurant-gold/20 text-restaurant-gold border-restaurant-gold/30">
                      {item.category}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pinsaPizzaHandlers.delete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Namn</label>
                      <Input
                        value={item.name}
                        onChange={(e) => pinsaPizzaHandlers.update(index, 'name', e.target.value)}
                        placeholder="Rätt namn"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Pris (SEK)</label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => pinsaPizzaHandlers.update(index, 'price', Number(e.target.value))}
                        placeholder="135"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Beskrivning</label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => pinsaPizzaHandlers.update(index, 'description', e.target.value)}
                      placeholder="Beskrivning av rätten"
                      rows={2}
                    />
                  </div>

                  {previewMode && (
                    <div className="bg-muted/10 p-3 rounded border-l-4 border-restaurant-gold">
                      <div className="font-medium text-restaurant-gold">
                        {item.name} - {item.price} kr
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={pinsaPizzaHandlers.add}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Lägg till pinsa pizza
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sallader */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-restaurant-gold flex items-center gap-2">
              <Utensils className="w-6 h-6" />
              {menuData.categoryTexts?.saladsTitle || "Sallader"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuData.salads.map((item, index) => (
                <div key={index} className="border border-muted rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-restaurant-gold/20 text-restaurant-gold border-restaurant-gold/30">
                      {item.category}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saladsHandlers.delete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Namn</label>
                      <Input
                        value={item.name}
                        onChange={(e) => saladsHandlers.update(index, 'name', e.target.value)}
                        placeholder="Rätt namn"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Pris (SEK)</label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => saladsHandlers.update(index, 'price', Number(e.target.value))}
                        placeholder="165"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Beskrivning</label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => saladsHandlers.update(index, 'description', e.target.value)}
                      placeholder="Beskrivning av rätten"
                      rows={2}
                    />
                  </div>

                  {previewMode && (
                    <div className="bg-muted/10 p-3 rounded border-l-4 border-restaurant-gold">
                      <div className="font-medium text-restaurant-gold">
                        {item.name} - {item.price} kr
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={saladsHandlers.add}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Lägg till sallad
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pasta */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-restaurant-gold flex items-center gap-2">
              <Utensils className="w-6 h-6" />
              {menuData.categoryTexts?.pastaTitle || "Pasta"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuData.pasta.map((item, index) => (
                <div key={index} className="border border-muted rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-restaurant-gold/20 text-restaurant-gold border-restaurant-gold/30">
                      {item.category}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pastaHandlers.delete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Namn</label>
                      <Input
                        value={item.name}
                        onChange={(e) => pastaHandlers.update(index, 'name', e.target.value)}
                        placeholder="Rätt namn"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Pris (SEK)</label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => pastaHandlers.update(index, 'price', Number(e.target.value))}
                        placeholder="140"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Beskrivning</label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => pastaHandlers.update(index, 'description', e.target.value)}
                      placeholder="Beskrivning av rätten"
                      rows={2}
                    />
                  </div>

                  {previewMode && (
                    <div className="bg-muted/10 p-3 rounded border-l-4 border-restaurant-gold">
                      <div className="font-medium text-restaurant-gold">
                        {item.name} - {item.price} kr
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={pastaHandlers.add}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Lägg till pasta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lunch Included Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-restaurant-gold">Till dagens lunch ingår alltid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuData.lunchIncluded.map((item, index) => (
                <div key={index} className="border border-muted rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Namn</label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateLunchIncluded(index, { ...item, name: e.target.value })}
                          placeholder="Vad ingår"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Ikon</label>
                        <Select
                          value={item.icon}
                          onValueChange={(value) => updateLunchIncluded(index, { ...item, icon: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Soup">Soup (soppa)</SelectItem>
                            <SelectItem value="Salad">Salad (sallad)</SelectItem>
                            <SelectItem value="Cookie">Cookie (bröd)</SelectItem>
                            <SelectItem value="Coffee">Coffee (kaffe)</SelectItem>
                            <SelectItem value="Heart">Heart (godbit)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteLunchIncludedItem(index)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {previewMode && (
                    <div className="bg-muted/10 p-3 rounded border-l-4 border-restaurant-gold">
                      <div className="font-medium text-restaurant-gold">
                        {item.name} ({item.icon})
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={() => addLunchIncludedItem({ name: '', icon: 'Soup' })}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Lägg till item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lunch Pricing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-restaurant-gold">Lunchpriser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">På plats (SEK)</label>
                <Input
                  type="number"
                  value={menuData.lunchPricing.onSite}
                  onChange={(e) => updateLunchPricing({ ...menuData.lunchPricing, onSite: Number(e.target.value) })}
                  placeholder="155"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Takeaway (SEK)</label>
                <Input
                  type="number"
                  value={menuData.lunchPricing.takeaway}
                  onChange={(e) => updateLunchPricing({ ...menuData.lunchPricing, takeaway: Number(e.target.value) })}
                  placeholder="140"
                />
              </div>
            </div>
            
            {previewMode && (
              <div className="bg-muted/10 p-3 rounded border-l-4 border-restaurant-gold mt-4">
                <div className="font-medium text-restaurant-gold">
                  På plats: {menuData.lunchPricing.onSite} kr • Takeaway: {menuData.lunchPricing.takeaway} kr
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => {
              toast({
                title: "Sparad!",
                description: "Menyn har uppdaterats och syns nu på webbplatsen.",
              });
            }}
            className="bg-restaurant-gold text-restaurant-dark hover:bg-restaurant-gold/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Spara ändringar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;