# My Blog MVP

A minimal single-owner blog with Next.js App Router, Supabase, and a TipTap editor. Built to stay quiet: no feeds, no monetization, no engagement bait.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- TipTap editor (content stored as JSON)

## Setup
1) Create a Supabase project.
2) In Supabase SQL editor, run `supabase/schema.sql`.
3) Create a storage bucket named `media` (public or private both work).
4) Copy `.env.local.example` to `.env.local` and fill values.
5) Install deps and run dev server:

```bash
npm install
npm run dev
```

## Auth flow
- Register at `/register` with email + password.
- Verify your email once via the confirmation link.
- Log in at `/login` with email + password going forward.

## Notes
- Public pages only show public posts. Private posts are visible only in `/dashboard`.
- View counts are tracked for public posts but shown only in the dashboard.
- Theme settings are stored in `blogs.theme_json` and applied to public pages and the editor.
- Optional `BLOG_SLUG` lets you target a specific blog if you add more later.

## Required Env Vars
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BLOG_SLUG` (optional, defaults to `main`)
