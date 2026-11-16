-- Supabase/PostgreSQL schema for restaurant private room bookings
create extension if not exists "pgcrypto";

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  long_description text,
  capacity_min int not null default 1,
  capacity_max int not null,
  base_price_cents int not null,
  price_per_guest_cents int not null default 0,
  deposit_cents int not null default 0,
  room_type text not null,
  facilities text[] not null default '{}',
  accessibility text[] not null default '{}',
  food_beverage_options text[] not null default '{}',
  image_urls text[] not null default '{}',
  preparation_minutes int not null default 30,
  cleaning_minutes int not null default 30,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create type reservation_status as enum ('pending_deposit','confirmed','modification_requested','cancelled');

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  room_id uuid not null references public.rooms(id) on delete restrict,
  reservation_date date not null,
  start_time time not null,
  end_time time not null,
  guests int not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  special_requests text,
  total_price_cents int not null,
  deposit_paid_cents int not null default 0,
  status reservation_status not null default 'confirmed',
  stripe_payment_intent_id text,
  manage_token_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reservations_room_date on public.reservations(room_id, reservation_date);
create index if not exists idx_reservations_reference on public.reservations(reference);

-- Prevent overlapping active reservations at DB level (same room/date/time window)
create or replace function public.prevent_overlapping_reservations()
returns trigger as 
begin
  if exists (
    select 1 from public.reservations r
    where r.room_id = new.room_id
      and r.reservation_date = new.reservation_date
      and r.status in ('pending_deposit','confirmed','modification_requested')
      and (new.start_time < r.end_time and new.end_time > r.start_time)
      and (tg_op = 'INSERT' or r.id <> new.id)
  ) then
    raise exception 'ROOM_NOT_AVAILABLE';
  end if;
  return new;
end;
 language plpgsql;

drop trigger if exists trg_prevent_overlap on public.reservations;
create trigger trg_prevent_overlap
before insert or update on public.reservations
for each row execute function public.prevent_overlapping_reservations();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Seed example rooms
insert into public.rooms (slug,name,description,long_description,capacity_min,capacity_max,base_price_cents,price_per_guest_cents,deposit_cents,room_type,facilities,accessibility,food_beverage_options,image_urls)
values
('ivy-salon','The Ivy Salon','An intimate salon for refined gatherings.','A warm ivory-toned private salon with bespoke oak table, ideal for family celebrations and discreet business dinners.',4,10,18000,2500,5000,'Intimate',
 array['Private entrance','Sound system','Adjustable lighting','Floral arrangement'],
 array['Step-free access','Accessible restroom nearby'],
 array['Seasonal tasting menu','Wine pairing','Vegetarian and vegan menus'],
 array['/images/rooms/ivy-1.jpg','/images/rooms/ivy-2.jpg']),
('forest-chamber','Forest Chamber','Our signature room framed in deep green tones.','A forest-green dining chamber with garden views, handcrafted tableware and dedicated service for memorable evenings.',8,18,32000,3000,10000,'Signature',
 array['Garden view','AV presentation screen','Private bar cart','Climate control'],
 array['Step-free access','Wide doorway'],
 array['Chef''s table menu','Canapés reception','Premium champagne selection'],
 array['/images/rooms/forest-1.jpg','/images/rooms/forest-2.jpg']),
('champagne-gallery','Champagne Gallery','A luminous gallery for elegant celebrations.','An ivory and champagne-gold gallery room designed for milestone occasions, with art-lined walls and flexible seating.',12,30,55000,3500,15000,'Celebration',
 array['Projection and microphone','Dance floor area','Dedicated service team','Custom table layouts'],
 array['Elevator access','Accessible restroom'],
 array['Bespoke banquet menu','Cocktail reception','Dessert station'],
 array['/images/rooms/champagne-1.jpg','/images/rooms/champagne-2.jpg'])
on conflict (slug) do nothing;
