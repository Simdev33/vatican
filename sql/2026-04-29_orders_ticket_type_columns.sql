alter table public.orders
add column if not exists adult_count int4 not null default 0,
add column if not exists child_count int4 not null default 0,
add column if not exists infant_count int4 not null default 0;

comment on column public.orders.adult_count is
  'Adult tickets on this order row.';

comment on column public.orders.child_count is
  'Child tickets on this order row.';

comment on column public.orders.infant_count is
  'Infant tickets on this order row.';
