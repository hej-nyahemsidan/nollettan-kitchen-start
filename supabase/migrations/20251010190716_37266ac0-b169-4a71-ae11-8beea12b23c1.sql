-- Fix search_path for the update function
DROP TRIGGER IF EXISTS update_menu_data_timestamp ON public.menu_data;
DROP FUNCTION IF EXISTS public.update_menu_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_menu_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_menu_data_timestamp
  BEFORE UPDATE ON public.menu_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_menu_updated_at();