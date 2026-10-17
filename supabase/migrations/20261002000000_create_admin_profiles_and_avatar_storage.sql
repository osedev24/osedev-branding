create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null,
  email text not null,
  photo_path text,
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

grant select, insert, update on public.admin_profiles to authenticated;

drop policy if exists "Admins can read their own profile" on public.admin_profiles;
create policy "Admins can read their own profile"
on public.admin_profiles for select
to authenticated
using (user_id = auth.uid() and public.is_admin());

drop policy if exists "Admins can create their own profile" on public.admin_profiles;
create policy "Admins can create their own profile"
on public.admin_profiles for insert
to authenticated
with check (user_id = auth.uid() and public.is_admin());

drop policy if exists "Admins can update their own profile" on public.admin_profiles;
create policy "Admins can update their own profile"
on public.admin_profiles for update
to authenticated
using (user_id = auth.uid() and public.is_admin())
with check (user_id = auth.uid() and public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('admin-avatars', 'admin-avatars', false, 1048576, array['image/jpeg'])
on conflict (id) do update
set public = false,
    file_size_limit = 1048576,
    allowed_mime_types = array['image/jpeg'];

drop policy if exists "Admins can read their own profile photo" on storage.objects;
create policy "Admins can read their own profile photo"
on storage.objects for select
to authenticated
using (
  bucket_id = 'admin-avatars'
  and public.is_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Admins can upload their own profile photo" on storage.objects;
create policy "Admins can upload their own profile photo"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'admin-avatars'
  and public.is_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Admins can update their own profile photo" on storage.objects;
create policy "Admins can update their own profile photo"
on storage.objects for update
to authenticated
using (
  bucket_id = 'admin-avatars'
  and public.is_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'admin-avatars'
  and public.is_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Admins can delete their own profile photo" on storage.objects;
create policy "Admins can delete their own profile photo"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'admin-avatars'
  and public.is_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);