-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users primary key,
  role text not null check (role in ('admin', 'masseur')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Create clients table
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.clients enable row level security;

-- Create formulas table
create table if not exists public.formulas (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price decimal(10,2) not null,
  duration integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.formulas enable row level security;

-- Create appointments table
create table if not exists public.appointments (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) not null,
  formula_id uuid references public.formulas(id) not null,
  date date not null,
  time time not null,
  status text not null check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')) default 'scheduled',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;

-- RLS Policies
create policy "Enable read access for all authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Enable update for users based on id"
  on public.profiles for update
  using (auth.uid() = id);

-- Clients policies
create policy "Enable read access for authenticated users"
  on public.clients for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users"
  on public.clients for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users"
  on public.clients for update
  using (auth.role() = 'authenticated');

-- Formulas policies
create policy "Enable read access for authenticated users"
  on public.formulas for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for admin users"
  on public.formulas for insert
  with check (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

create policy "Enable update for admin users"
  on public.formulas for update
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- Appointments policies
create policy "Enable read access for authenticated users"
  on public.appointments for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users"
  on public.appointments for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users"
  on public.appointments for update
  using (auth.role() = 'authenticated');

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'masseur');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sample Data (only if tables are empty)
insert into public.clients (name, email, phone)
select 'John Doe', 'john@example.com', '+1234567890'
where not exists (select 1 from public.clients);

insert into public.clients (name, email, phone)
select 'Jane Smith', 'jane@example.com', '+0987654321'
where not exists (select 1 from public.clients where email = 'jane@example.com');

insert into public.formulas (name, description, price, duration)
select 'Swedish Massage', 'Traditional relaxation massage', 80.00, 60
where not exists (select 1 from public.formulas);

insert into public.formulas (name, description, price, duration)
select 'Deep Tissue', 'Therapeutic deep pressure massage', 100.00, 60
where not exists (select 1 from public.formulas where name = 'Deep Tissue');

insert into public.formulas (name, description, price, duration)
select 'Hot Stone', 'Massage with heated stones', 120.00, 90
where not exists (select 1 from public.formulas where name = 'Hot Stone');