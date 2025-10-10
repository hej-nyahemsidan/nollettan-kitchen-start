-- Create menu_data table
CREATE TABLE public.menu_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create weekly_lunch table
CREATE TABLE public.weekly_lunch (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_data_id uuid NOT NULL REFERENCES public.menu_data(id) ON DELETE CASCADE,
  day text NOT NULL,
  meals jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_index integer NOT NULL,
  UNIQUE(menu_data_id, day)
);

-- Create menu_items table
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_data_id uuid NOT NULL REFERENCES public.menu_data(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  order_index integer NOT NULL
);

-- Create lunch_included table
CREATE TABLE public.lunch_included (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_data_id uuid NOT NULL REFERENCES public.menu_data(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL,
  order_index integer NOT NULL
);

-- Create lunch_pricing table
CREATE TABLE public.lunch_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_data_id uuid NOT NULL REFERENCES public.menu_data(id) ON DELETE CASCADE,
  on_site integer NOT NULL,
  takeaway integer NOT NULL,
  UNIQUE(menu_data_id)
);

-- Create category_texts table
CREATE TABLE public.category_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_data_id uuid NOT NULL REFERENCES public.menu_data(id) ON DELETE CASCADE,
  always_on_title text,
  always_on_description text,
  pinsa_pizza_title text,
  pinsa_pizza_description text,
  salads_title text,
  salads_description text,
  pasta_title text,
  pasta_description text,
  UNIQUE(menu_data_id)
);

-- Enable Row Level Security
ALTER TABLE public.menu_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_lunch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lunch_included ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lunch_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_texts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on menu_data"
  ON public.menu_data FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on weekly_lunch"
  ON public.weekly_lunch FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on menu_items"
  ON public.menu_items FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on lunch_included"
  ON public.lunch_included FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on lunch_pricing"
  ON public.lunch_pricing FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on category_texts"
  ON public.category_texts FOR SELECT
  USING (true);

-- Create policies for public write access (TEMPORARY - should be replaced with proper auth)
CREATE POLICY "Allow public write on menu_data"
  ON public.menu_data FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public write on weekly_lunch"
  ON public.weekly_lunch FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public write on menu_items"
  ON public.menu_items FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public write on lunch_included"
  ON public.lunch_included FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public write on lunch_pricing"
  ON public.lunch_pricing FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public write on category_texts"
  ON public.category_texts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_menu_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_menu_data_timestamp
  BEFORE UPDATE ON public.menu_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_menu_updated_at();

-- Enable realtime for all menu tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.weekly_lunch;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lunch_included;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lunch_pricing;
ALTER PUBLICATION supabase_realtime ADD TABLE public.category_texts;

-- Create indexes for better performance
CREATE INDEX idx_weekly_lunch_menu_data ON public.weekly_lunch(menu_data_id);
CREATE INDEX idx_menu_items_menu_data ON public.menu_items(menu_data_id);
CREATE INDEX idx_menu_items_category ON public.menu_items(category);
CREATE INDEX idx_lunch_included_menu_data ON public.lunch_included(menu_data_id);
CREATE INDEX idx_lunch_pricing_menu_data ON public.lunch_pricing(menu_data_id);
CREATE INDEX idx_category_texts_menu_data ON public.category_texts(menu_data_id);