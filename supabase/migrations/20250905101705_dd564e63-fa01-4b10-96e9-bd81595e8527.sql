-- Fix the security issue by setting search_path for the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create canteen first
  INSERT INTO public.canteens (owner_id, name, description, address, phone)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'canteen_name', 'My Canteen'),
    'A modern canteen management system',
    COALESCE(NEW.raw_user_meta_data->>'canteen_address', ''),
    COALESCE(NEW.raw_user_meta_data->>'canteen_phone', '')
  );

  -- Create profile with canteen reference
  INSERT INTO public.profiles (user_id, email, full_name, phone, canteen_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    (SELECT id FROM public.canteens WHERE owner_id = NEW.id LIMIT 1),
    'owner'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;