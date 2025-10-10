-- Remove duplicate menu items, keeping only the one with the lowest order_index for each unique item
DELETE FROM public.menu_items a
USING public.menu_items b
WHERE a.id > b.id
  AND a.menu_data_id = b.menu_data_id
  AND a.category = b.category
  AND a.name = b.name
  AND a.description = b.description
  AND a.price = b.price;