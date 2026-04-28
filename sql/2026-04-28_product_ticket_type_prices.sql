alter table public.products
add column if not exists ticket_type_prices jsonb not null default '{}'::jsonb;

comment on column public.products.ticket_type_prices is
  'Per ticket type prices keyed by stable ticket type id, e.g. adult-18 or young-12-24.';
