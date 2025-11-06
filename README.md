# BaShchuna - Neighborhood Supplier Recommendations

A Next.js application for sharing and rating local suppliers in your neighborhood.

## UX Behavior Summary

**Homepage (Mobile-First):** Grid of supplier cards. Click card → opens slide-in modal (desktop: from right, mobile: full screen). Browse suppliers without page navigation.

**Sharing:** Modal has "שתף" button that copies `/supplier/[id]` URL. Dedicated page at `/supplier/[id]` exists for direct links & Open Graph previews.

**Key Flow:** Browse in modal on homepage. Share direct URLs for WhatsApp. Both views coexist (Option 1 approach).

## Features

- **Google OAuth Authentication** - Secure sign-in with Google
- **Browse Suppliers** - View all suppliers with ratings and filters
- **Search & Filter** - Find suppliers by name or trade
- **Rate Suppliers** - Multi-dimensional ratings (Quality, Price, Reliability, Communication)
- **Create Supplier Profiles** - Add new suppliers with images
- **Social Sharing** - Share supplier profiles with WhatsApp preview
- **Admin Panel** - Review recent additions and remove spam

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres + Storage)
- React Server Components

## Prerequisites

- Node.js 18+ installed
- Supabase account with project setup
- Environment variables configured

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   The `.env.local` file is already configured with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Database Setup**

   Make sure your Supabase database has the following tables:

   **users**
   - id (uuid, primary key)
   - email (text)
   - name (text)
   - avatar_url (text)
   - is_admin (boolean, default: false)

   **suppliers**
   - id (uuid, primary key)
   - name (text)
   - trade (text)
   - phone (text)
   - description (text)
   - image_url (text, nullable)
   - created_by (uuid, foreign key to users)
   - created_at (timestamp)

   **ratings**
   - id (uuid, primary key)
   - supplier_id (uuid, foreign key to suppliers)
   - user_id (uuid, foreign key to users)
   - quality (integer 1-5, nullable)
   - price (integer 1-5, nullable)
   - reliability (integer 1-5, nullable)
   - communication (integer 1-5, nullable)
   - comment (text, nullable)
   - created_at (timestamp)
   - UNIQUE constraint on (supplier_id, user_id)

4. **Storage Setup**

   Create a Supabase Storage bucket named `supplier-images` with public access.

5. **Google OAuth Setup**

   Configure Google OAuth in your Supabase project settings:
   - Add authorized redirect URIs
   - Enable Google provider in Authentication settings

## Running the Application

**Development Mode**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

**Production Build**
```bash
npm run build
npm start
```

## Project Structure

```
/app
  layout.tsx              # Root layout with header
  page.tsx                # Main page - browse suppliers
  globals.css             # Global styles
  /supplier/[id]
    page.tsx              # Supplier profile page
    SupplierProfileClient.tsx
  /admin
    page.tsx              # Admin panel
    AdminClient.tsx
  /api/auth/callback
    route.ts              # OAuth callback

/components
  Header.tsx              # Header with auth and navigation
  AuthButton.tsx          # Sign in/out button
  SupplierCard.tsx        # Supplier card for grid view
  SupplierList.tsx        # Main supplier list with filters
  CreateSupplierModal.tsx # Modal for creating suppliers
  RatingModal.tsx         # Modal for rating suppliers
  RatingDisplay.tsx       # Rating stars display

/lib
  supabase.ts             # Supabase client setup
  utils.ts                # Utility functions

/types
  index.ts                # TypeScript types

middleware.ts             # Session refresh middleware
```

## Usage

### For Users

1. **Sign In** - Click "Sign In with Google" in the header
2. **Browse Suppliers** - View all suppliers on the home page
3. **Filter & Search** - Use the trade dropdown and search bar
4. **View Supplier** - Click any supplier card to see full details
5. **Rate Supplier** - Click "Rate This Supplier" on a profile page
6. **Add Supplier** - Click "Add Supplier" button (requires sign-in)
7. **Share** - Use the "Share" button to copy profile link

### For Admins

1. **Access Admin Panel** - Click "Admin" link in header (only visible to admins)
2. **Review Recent Suppliers** - See all suppliers added in last 30 days
3. **Delete Spam** - Click "Delete" button (requires double-click confirmation)

## Database Policies

Make sure to set up Row Level Security (RLS) policies in Supabase:

- **users**: Read access for authenticated users
- **suppliers**: Read access for everyone, insert/update/delete based on user permissions
- **ratings**: Read access for everyone, insert/update for authenticated users (own ratings only)

## Deployment

Deploy to Vercel:

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## License

ISC
