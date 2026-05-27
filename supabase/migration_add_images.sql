-- Run in Supabase Dashboard → SQL Editor
-- Adds images array column to products table

ALTER TABLE products ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]';
