alter table public.order_items
add column if not exists ticket_breakdown jsonb not null default '[]'::jsonb;

comment on column public.order_items.ticket_breakdown is
  'Ticket type quantities for this order item, e.g. Adult/Child age bands.';
