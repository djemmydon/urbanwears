-- ============================================================
-- URBANLUXE — Seed Data
-- Run AFTER schema.sql
-- ============================================================

insert into products (id, name, type, price, original_price, rating, review_count, description, image, category, sizes, colors, trending)
values
(
  '1',
  'Essential Black Polo',
  'polo',
  85,
  110,
  4.8,
  124,
  'Premium cotton polo with perfect fit and luxurious feel. Crafted from 100% Pima cotton with reinforced stitching for lasting durability.',
  '/images/e1.png',
  'Polo',
  '[{"size":"M","inStock":true,"stockCount":12},{"size":"L","inStock":true,"stockCount":8},{"size":"XL","inStock":false,"stockCount":0},{"size":"XXL","inStock":true,"stockCount":5}]',
  '[{"name":"Black","hex":"#000000"},{"name":"Navy","hex":"#1E3A8A"},{"name":"White","hex":"#FFFFFF"}]',
  true
),
(
  '2',
  'Signa Orange Hoodie',
  'hoodie',
  125,
  160,
  4.9,
  89,
  'Ultra-soft fleece hoodie designed for comfort and street-ready style. Features a kangaroo pocket and adjustable drawstring hood.',
  '/images/e2.png',
  'Hoodie',
  '[{"size":"M","inStock":true,"stockCount":15},{"size":"L","inStock":true,"stockCount":10},{"size":"XL","inStock":true,"stockCount":7},{"size":"XXL","inStock":true,"stockCount":3}]',
  '[{"name":"Orange","hex":"#FF8C00"},{"name":"Black","hex":"#000000"},{"name":"Gray","hex":"#6B7280"}]',
  true
),
(
  '3',
  'Oversized White Tee',
  'tshirt',
  65,
  null,
  4.7,
  203,
  'Premium heavyweight cotton oversized t-shirt. Drop-shoulder cut with a boxy silhouette for that perfect streetwear look.',
  '/images/e3.png',
  'T-Shirt',
  '[{"size":"M","inStock":true,"stockCount":20},{"size":"L","inStock":true,"stockCount":18},{"size":"XL","inStock":true,"stockCount":12},{"size":"XXL","inStock":false,"stockCount":0}]',
  '[{"name":"White","hex":"#FFFFFF"},{"name":"Black","hex":"#000000"}]',
  false
),
(
  '4',
  'Ribbed Navy Polo',
  'polo',
  95,
  null,
  4.6,
  67,
  'Textured ribbed polo with premium detailing and a slim modern fit. Perfect for both casual and smart-casual occasions.',
  '/images/e4.png',
  'Polo',
  '[{"size":"M","inStock":true,"stockCount":9},{"size":"L","inStock":false,"stockCount":0},{"size":"XL","inStock":true,"stockCount":6},{"size":"XXL","inStock":true,"stockCount":4}]',
  '[{"name":"Navy","hex":"#1E3A8A"},{"name":"Black","hex":"#000000"}]',
  false
),
(
  '5',
  'Classic Gray Hoodie',
  'hoodie',
  110,
  140,
  4.5,
  45,
  'Timeless gray hoodie with a soft fleece interior. A wardrobe essential that pairs with everything.',
  '/images/e6.png',
  'Hoodie',
  '[{"size":"M","inStock":true,"stockCount":8},{"size":"L","inStock":true,"stockCount":5},{"size":"XL","inStock":false,"stockCount":0},{"size":"XXL","inStock":true,"stockCount":2}]',
  '[{"name":"Gray","hex":"#6B7280"},{"name":"Black","hex":"#000000"}]',
  false
),
(
  '6',
  'Relaxed Fit Black Tee',
  'tshirt',
  55,
  null,
  4.4,
  32,
  'Comfortable relaxed fit black t-shirt in premium 200gsm cotton. The perfect everyday essential.',
  '/images/e7.png',
  'T-Shirt',
  '[{"size":"M","inStock":true,"stockCount":14},{"size":"L","inStock":true,"stockCount":11},{"size":"XL","inStock":false,"stockCount":0},{"size":"XXL","inStock":true,"stockCount":3}]',
  '[{"name":"Black","hex":"#000000"}]',
  false
),
(
  '7',
  'Striped Navy Polo',
  'polo',
  90,
  null,
  4.7,
  78,
  'Classic striped polo with a modern fit and bold nautical detailing. Made from premium cotton pique.',
  '/images/e8.png',
  'Polo',
  '[{"size":"M","inStock":true,"stockCount":10},{"size":"L","inStock":true,"stockCount":8},{"size":"XL","inStock":true,"stockCount":6},{"size":"XXL","inStock":false,"stockCount":0}]',
  '[{"name":"Navy","hex":"#1E3A8A"},{"name":"White","hex":"#FFFFFF"}]',
  true
)
on conflict (id) do nothing;

-- Seed mock reviews
insert into reviews (product_id, user_name, rating, text, created_at) values
('1', 'Alex Chen',     5, 'The quality is insane. Best polo I''ve ever owned. Fits perfectly.',                    '2025-05-12'),
('1', 'Sarah Kim',     4, 'Very comfortable fabric. Only wish it had one more color option.',                       '2025-05-10'),
('1', 'Jordan W.',     5, 'Arrived in 2 days, packaging was excellent. Will order again.',                          '2025-04-28'),
('2', 'Marcus Okoro',  5, 'This orange hoodie is fire! Soft inside, looks premium.',                               '2025-05-08'),
('2', 'Priya S.',      5, 'Perfect weight — not too heavy, not too light. Wears great.',                           '2025-05-01'),
('3', 'Tyler Reeves',  4, 'Love the oversized fit. Goes with everything in my wardrobe.',                          '2025-05-15'),
('3', 'Amara N.',      5, 'Premium feel, exactly as described. My new favourite tee.',                             '2025-05-03'),
('5', 'Chris P.',      4, 'Classic and cozy. The fleece interior is incredibly soft.',                             '2025-04-20'),
('7', 'Derek M.',      5, 'Beautiful polo, the stripe pattern is subtle and elegant.',                             '2025-05-11')
on conflict do nothing;
