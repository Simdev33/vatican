alter table public.orders
add column if not exists items jsonb not null default '[]'::jsonb;

comment on column public.orders.items is
  'Full order item snapshot for reading complete orders from the orders table only.';
