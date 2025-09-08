-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  canteen_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  supplier TEXT,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  max_stock INTEGER NOT NULL DEFAULT 100,
  unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_value DECIMAL(10,2) GENERATED ALWAYS AS (current_stock * unit_cost) STORED,
  last_restocked DATE,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'good' CHECK (status IN ('good', 'low_stock', 'out_of_stock', 'expiring_soon', 'expired')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory items
CREATE POLICY "Canteen staff can manage inventory items" 
ON public.inventory_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  JOIN canteens c ON p.canteen_id = c.id 
  WHERE p.user_id = auth.uid() 
  AND c.id = inventory_items.canteen_id
));

-- Add stock_quantity to menu_items
ALTER TABLE public.menu_items 
ADD COLUMN stock_quantity INTEGER DEFAULT 0;

-- Create trigger for automatic timestamp updates on inventory_items
CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update inventory status
CREATE OR REPLACE FUNCTION public.update_inventory_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status based on stock levels and expiry
  IF NEW.current_stock = 0 THEN
    NEW.status = 'out_of_stock';
  ELSIF NEW.current_stock <= NEW.min_stock THEN
    NEW.status = 'low_stock';
  ELSIF NEW.expiry_date IS NOT NULL AND NEW.expiry_date <= CURRENT_DATE THEN
    NEW.status = 'expired';
  ELSIF NEW.expiry_date IS NOT NULL AND NEW.expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN
    NEW.status = 'expiring_soon';
  ELSE
    NEW.status = 'good';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update status
CREATE TRIGGER inventory_status_trigger
BEFORE INSERT OR UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_status();