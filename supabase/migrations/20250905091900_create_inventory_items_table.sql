CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  current_stock NUMERIC,
  min_stock NUMERIC,
  max_stock NUMERIC,
  unit TEXT,
  cost_per_unit NUMERIC,
  supplier TEXT,
  last_restocked DATE,
  expiry_date DATE,
  canteen_id UUID REFERENCES canteens(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
