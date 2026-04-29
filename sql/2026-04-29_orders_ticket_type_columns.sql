alter table public.orders
add column if not exists adult_count int4 not null default 0,
add column if not exists child_count int4 not null default 0,
add column if not exists adult_18_count int4 not null default 0,
add column if not exists child_under_18_count int4 not null default 0,
add column if not exists adult_25_count int4 not null default 0,
add column if not exists young_12_24_count int4 not null default 0,
add column if not exists children_4_11_count int4 not null default 0,
add column if not exists small_children_under_4_count int4 not null default 0;

comment on column public.orders.adult_count is
  'Total adult tickets across the whole order.';

comment on column public.orders.child_count is
  'Total child tickets across the whole order.';

comment on column public.orders.adult_18_count is
  'Adult (18+) ticket count.';

comment on column public.orders.child_under_18_count is
  'Child (Under 18yrs) ticket count.';

comment on column public.orders.adult_25_count is
  'Eiffel Adult (25+) ticket count.';

comment on column public.orders.young_12_24_count is
  'Eiffel Young (12-24 years old) ticket count.';

comment on column public.orders.children_4_11_count is
  'Eiffel Children (4-11 years old) ticket count.';

comment on column public.orders.small_children_under_4_count is
  'Eiffel Small children (Younger than 4 years old) ticket count.';
