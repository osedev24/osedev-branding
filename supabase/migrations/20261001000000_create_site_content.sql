create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Users can read their own admin membership" on public.admin_users;
create policy "Users can read their own admin membership"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.site_content (
  id text primary key check (id = 'default'),
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read published content document" on public.site_content;
create policy "Public can read published content document"
on public.site_content for select
to anon, authenticated
using (id = 'default');

drop policy if exists "Admins can write content document" on public.site_content;
create policy "Admins can write content document"
on public.site_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.site_content (id, payload)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;

create or replace function public.get_public_content()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_set(
    payload,
    '{projects}',
    coalesce(
      (
        select jsonb_agg(project)
        from jsonb_array_elements(coalesce(payload->'projects', '[]'::jsonb)) as project
        where coalesce((project->>'published')::boolean, false)
      ),
      '[]'::jsonb
    )
  )
  from public.site_content
  where id = 'default';
$$;

revoke all on function public.get_public_content() from public;
grant execute on function public.get_public_content() to anon, authenticated;
