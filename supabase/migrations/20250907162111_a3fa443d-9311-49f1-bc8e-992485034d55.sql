-- Insert default categories for new canteens
INSERT INTO public.categories (canteen_id, name, description) 
SELECT c.id, 'Main Course', 'Primary dishes and entrees'
FROM public.canteens c
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories cat 
  WHERE cat.canteen_id = c.id AND cat.name = 'Main Course'
);

INSERT INTO public.categories (canteen_id, name, description) 
SELECT c.id, 'Beverages', 'Drinks and refreshments'
FROM public.canteens c
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories cat 
  WHERE cat.canteen_id = c.id AND cat.name = 'Beverages'
);

INSERT INTO public.categories (canteen_id, name, description) 
SELECT c.id, 'Desserts', 'Sweet treats and desserts'
FROM public.canteens c
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories cat 
  WHERE cat.canteen_id = c.id AND cat.name = 'Desserts'
);

INSERT INTO public.categories (canteen_id, name, description) 
SELECT c.id, 'Snacks', 'Light snacks and appetizers'
FROM public.canteens c
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories cat 
  WHERE cat.canteen_id = c.id AND cat.name = 'Snacks'
);