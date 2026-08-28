-- Run in Supabase Dashboard -> SQL Editor for an existing database.
-- Keep order history when a product is deleted by detaching the line item
-- reference instead of preventing the product deletion.

alter table order_items
  alter column product_id drop not null;

do $$
declare
  existing_constraint text;
begin
  select constraint_name
    into existing_constraint
    from (
      select c.conname as constraint_name
        from pg_constraint c
       where c.conrelid = 'public.order_items'::regclass
         and c.confrelid = 'public.products'::regclass
         and c.contype = 'f'
         and pg_get_constraintdef(c.oid) like 'FOREIGN KEY (product_id)%'
    ) foreign_keys
   limit 1;

  if existing_constraint is not null then
    execute format(
      'alter table public.order_items drop constraint %I',
      existing_constraint
    );
  end if;
end $$;

alter table order_items
  add constraint order_items_product_id_fkey
  foreign key (product_id) references products(id) on delete set null;
