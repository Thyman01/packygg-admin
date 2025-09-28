# Vercel Deployment Guide

This guide will help you deploy your PackyGG Admin Dashboard to Vercel.

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [GitHub account](https://github.com) (recommended)
- [Supabase project](https://supabase.com)

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/packygg-admin.git
   git push -u origin main
   ```

2. **Verify your project structure**:
   - ✅ `package.json` with correct dependencies
   - ✅ `next.config.ts` with Vercel optimizations
   - ✅ `vercel.json` configuration file
   - ✅ `env.example` for environment variables reference

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "New Project"**

3. **Import your GitHub repository**:
   - Connect your GitHub account if not already connected
   - Select your `packygg-admin` repository
   - Click "Import"

4. **Configure your project**:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     ```
   - Get these values from your Supabase project settings

6. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new one
   - Set up environment variables when prompted

## Step 3: Configure Supabase

1. **Go to your Supabase project dashboard**

2. **Navigate to Settings > API**

3. **Copy your project URL and anon key**:
   - Project URL: `https://your-project-id.supabase.co`
   - Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Add these to your Vercel environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Set Up Database

1. **Go to your Supabase project dashboard**

2. **Navigate to SQL Editor**

3. **Run the following SQL to create the tables**:
   ```sql
   -- Create sets table
   CREATE TABLE sets (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     set_name TEXT NOT NULL,
     card_amount INTEGER NOT NULL,
     release_date TEXT NOT NULL,
     logo_url TEXT,
     background_url TEXT,
     series TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create cards table (matching actual database schema)
   CREATE TABLE cards (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     card_id TEXT NOT NULL,
     set_id UUID NOT NULL REFERENCES sets(id) ON DELETE CASCADE,
     card_name TEXT NOT NULL,
     card_number TEXT NOT NULL,
     rarity TEXT NOT NULL,
     image_url TEXT NOT NULL,
     tcgplayer_url TEXT,
     cardmarket_url TEXT,
     usd_price TEXT,
     eur_price TEXT,
     hp TEXT,
     player TEXT,
     card_model TEXT,
     number TEXT,
     euro_price TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create indexes for better performance
   CREATE INDEX idx_cards_set_id ON cards(set_id);
   CREATE INDEX idx_cards_card_id ON cards(card_id);
   CREATE INDEX idx_cards_card_name ON cards(card_name);
   ```

4. **Enable Row Level Security (RLS) if needed**:
   ```sql
   ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
   ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
   ```

## Step 5: Configure Custom Domain (Optional)

1. **Go to your Vercel project dashboard**

2. **Navigate to Settings > Domains**

3. **Add your custom domain**:
   - Enter your domain name
   - Follow DNS configuration instructions
   - Wait for SSL certificate to be issued

## Step 6: Set Up Automatic Deployments

Your project is already configured for automatic deployments:

- **Push to main branch** → Triggers production deployment
- **Create pull request** → Triggers preview deployment
- **Environment variables** are automatically used in all deployments

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (if needed) | ❌ No |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for redirects) | ❌ No |

## Troubleshooting

### Build Failures

1. **Check build logs** in Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Run locally** with `npm run build` to test

### Database Connection Issues

1. **Verify Supabase URL and key** are correct
2. **Check RLS policies** in Supabase
3. **Ensure database is accessible** from Vercel

### Performance Issues

1. **Enable Vercel Analytics** in project settings
2. **Check Core Web Vitals** in Vercel dashboard
3. **Optimize images** and assets

## Post-Deployment Checklist

- [ ] ✅ Application loads without errors
- [ ] ✅ Database connection works
- [ ] ✅ All pages are accessible
- [ ] ✅ Forms submit successfully
- [ ] ✅ Dark/light theme toggle works
- [ ] ✅ Mobile responsive design
- [ ] ✅ Custom domain configured (if applicable)
- [ ] ✅ Analytics enabled (optional)

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

## Security Best Practices

1. **Never commit** `.env.local` or `.env` files
2. **Use environment variables** for all sensitive data
3. **Enable RLS** in Supabase for data protection
4. **Regular security updates** for dependencies
5. **Monitor** your application for unusual activity

Your PackyGG Admin Dashboard is now ready for production! 🚀
