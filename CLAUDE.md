# BaShchuna - Neighborhood Supplier Recommendations

## Goal
Simple platform for neighborhood community to share and rate local suppliers/workers (plumbers, electricians, contractors, etc.) with Google authentication.

## Key Features
- Google OAuth only (no passwords)
- Browse/search/filter suppliers by trade
- Multi-dimensional ratings (Quality, Price, Reliability, Communication - all optional)
- Create supplier profiles (live immediately)
- Share individual profiles with WhatsApp preview
- Admin panel to review recent additions and delete spam

## Tech Stack
- Next.js 14+ (App Router), TypeScript, Tailwind
- Supabase (Auth + Postgres + Storage)
- Deployment: Vercel

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=https://fqdqevvksiqysymwjydz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxZHFldnZrc2lxeXN5bXdqeWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjU4NjIsImV4cCI6MjA3ODAwMTg2Mn0.9_tzAPZef5h7F5QjfRZMFFRI_gZZNZPy7XWWXf58GDs
```

## Database Schema
- **users**: id, email, name, avatar_url, is_admin
- **suppliers**: id, name, trade, phone, description, image_url, created_by, created_at
- **ratings**: id, supplier_id, user_id, quality, price, reliability, communication, comment, created_at

## User Flow
1. Sign in with Google
2. Browse suppliers (filter by trade, search by name)
3. Click supplier → see full profile with ratings breakdown
4. Rate supplier (optional 1-5 stars on 4 dimensions + comment)
5. Create new supplier profile
6. Share profile link (includes WhatsApp preview)
7. Admin: review recent additions, delete if needed
