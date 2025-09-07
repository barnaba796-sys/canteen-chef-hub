INSERT INTO categories (name, description, canteen_id, is_active)
SELECT
    'Main Course',
    'The main dishes of your menu.',
    c.id,
    true
FROM canteens c
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Main Course' AND canteen_id = c.id
);

INSERT INTO categories (name, description, canteen_id, is_active)
SELECT
    'Beverages',
    'Drinks and other beverages.',
    c.id,
    true
FROM canteens c
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Beverages' AND canteen_id = c.id
);

INSERT INTO categories (name, description, canteen_id, is_active)
SELECT
    'Snacks',
    'Light meals and snacks.',
    c.id,
    true
FROM canteens c
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Snacks' AND canteen_id = c.id
);

INSERT INTO categories (name, description, canteen_id, is_active)
SELECT
    'Desserts',
    'Sweet dishes and desserts.',
    c.id,
    true
FROM canteens c
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Desserts' AND canteen_id = c.id
);
