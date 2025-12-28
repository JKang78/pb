create extension if not exists pgcrypto;

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  title text not null,
  slug text unique not null,
  theme_json jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid references blogs(id) on delete cascade,
  slug text unique not null,
  title text not null,
  content_json jsonb not null default '{}'::jsonb,
  visibility text not null check (visibility in ('private','public')),
  published_at timestamptz null,
  view_count int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
before update on posts
for each row execute procedure set_updated_at();

alter table blogs enable row level security;
alter table posts enable row level security;

-- Blogs policies
create policy "Blogs owner select"
  on blogs for select
  using (auth.uid() = owner_user_id);

create policy "Blogs owner insert"
  on blogs for insert
  with check (auth.uid() = owner_user_id);

create policy "Blogs owner update"
  on blogs for update
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

create policy "Blogs owner delete"
  on blogs for delete
  using (auth.uid() = owner_user_id);

-- Posts policies
create policy "Posts public select"
  on posts for select
  using (visibility = 'public');

create policy "Posts owner select"
  on posts for select
  using (exists (
    select 1 from blogs b
    where b.id = posts.blog_id and b.owner_user_id = auth.uid()
  ));

create policy "Posts owner insert"
  on posts for insert
  with check (exists (
    select 1 from blogs b
    where b.id = posts.blog_id and b.owner_user_id = auth.uid()
  ));

create policy "Posts owner update"
  on posts for update
  using (exists (
    select 1 from blogs b
    where b.id = posts.blog_id and b.owner_user_id = auth.uid()
  ))
  with check (exists (
    select 1 from blogs b
    where b.id = posts.blog_id and b.owner_user_id = auth.uid()
  ));

create policy "Posts owner delete"
  on posts for delete
  using (exists (
    select 1 from blogs b
    where b.id = posts.blog_id and b.owner_user_id = auth.uid()
  ));
