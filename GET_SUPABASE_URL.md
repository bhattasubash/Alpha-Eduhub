# How to Get Your Supabase Connection String

## Step 1: Go to Supabase Dashboard
Visit: https://supabase.com/dashboard

## Step 2: Select Your Project
Click on your project (the one with db.reyigjmzdwxquvpsgxpq.supabase.co)

## Step 3: Get Connection String
1. Go to **Settings** → **Database**
2. Scroll down to **Connection String**
3. Select **URI** tab
4. Choose **Connection pooling** (recommended for Vercel)
5. Copy the connection string

## Step 4: Update Vercel Environment Variable
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Edit `DATABASE_URL`
3. Paste the connection pooling URL
4. Save and redeploy

## Example Connection Pooling URL Format:
```
postgresql://postgres:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Alternative: Direct Connection URL
If pooling doesn't work, use the direct connection:
```
postgresql://postgres:Zv3umfQzQSkXsyWg@db.reyigjmzdwxquvpsgxpq.supabase.co:5432/postgres
```

## Important Notes:
- Make sure your Supabase project is NOT paused
- Check if there are any IP restrictions in Supabase settings
- Connection pooling is recommended for serverless environments like Vercel