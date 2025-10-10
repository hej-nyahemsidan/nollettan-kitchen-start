-- Delete duplicate menu items, keeping only one per unique item
DELETE FROM public.menu_items
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY menu_data_id, category, name, description, price 
        ORDER BY order_index
      ) as rn
    FROM public.menu_items
    WHERE menu_data_id = '4ecc523a-3df8-4d45-8a15-ff9c71076c93'
  ) t
  WHERE rn > 1
);