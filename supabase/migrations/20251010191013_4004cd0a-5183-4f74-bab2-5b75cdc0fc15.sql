-- Remove dangerous public write policies
DROP POLICY IF EXISTS "Allow public write on menu_data" ON public.menu_data;
DROP POLICY IF EXISTS "Allow public write on weekly_lunch" ON public.weekly_lunch;
DROP POLICY IF EXISTS "Allow public write on menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Allow public write on lunch_included" ON public.lunch_included;
DROP POLICY IF EXISTS "Allow public write on lunch_pricing" ON public.lunch_pricing;
DROP POLICY IF EXISTS "Allow public write on category_texts" ON public.category_texts;

-- Create admin-only write policies (requires authentication)
CREATE POLICY "Authenticated users can write menu_data"
  ON public.menu_data
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can write weekly_lunch"
  ON public.weekly_lunch
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can write menu_items"
  ON public.menu_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can write lunch_included"
  ON public.lunch_included
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can write lunch_pricing"
  ON public.lunch_pricing
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can write category_texts"
  ON public.category_texts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);