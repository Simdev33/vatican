alter table public.orders
add column if not exists parent_product_id text,
add column if not exists parent_product_title text,
add column if not exists ticket_breakdown jsonb not null default '[]'::jsonb,
add column if not exists product_summary text,
add column if not exists order_total_price numeric(10, 2),
add column if not exists sent_out boolean not null default false,
add column if not exists written_out boolean not null default false,
add column if not exists stripe_checkout_session_id text;

comment on column public.orders.parent_product_id is
  'Combo parent product id when this order row is one component of a combo.';

comment on column public.orders.parent_product_title is
  'Combo parent product title when this order row is one component of a combo.';

comment on column public.orders.ticket_breakdown is
  'Ticket type quantities for this order row, e.g. Adult/Child age bands.';

comment on column public.orders.product_summary is
  'Human-readable product and ticket quantity summary for exports.';

comment on column public.orders.order_total_price is
  'Full customer-paid order total. For combo rows this repeats the fixed combo price.';

comment on column public.orders.sent_out is
  'Whether this order row has been sent out.';

comment on column public.orders.written_out is
  'Whether this order row has been written out.';

comment on column public.orders.stripe_checkout_session_id is
  'Stripe Checkout session id that created this order row.';
