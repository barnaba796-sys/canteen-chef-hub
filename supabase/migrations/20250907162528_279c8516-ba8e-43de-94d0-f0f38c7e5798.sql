-- Fix existing profiles without canteen_id
UPDATE public.profiles 
SET canteen_id = (
  SELECT id FROM public.canteens 
  WHERE owner_id = profiles.user_id 
  LIMIT 1
)
WHERE canteen_id IS NULL AND role = 'owner';

-- Create canteens for profiles that don't have them
INSERT INTO public.canteens (owner_id, name, description)
SELECT p.user_id, 'My Canteen', 'A modern canteen management system'
FROM public.profiles p
WHERE p.role = 'owner' 
  AND p.canteen_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.canteens c WHERE c.owner_id = p.user_id
  );

-- Update profiles again to set canteen_id for any remaining nulls
UPDATE public.profiles 
SET canteen_id = (
  SELECT id FROM public.canteens 
  WHERE owner_id = profiles.user_id 
  LIMIT 1
)
WHERE canteen_id IS NULL AND role = 'owner';