# 🌶️ Qureshi's Masala & Spices — Full Deployment Guide
# From zero to live website in ~45 minutes

## WHAT YOU'RE BUILDING
- Public website with cinematic hero, product showcase, order form
- Admin panel to manage products, view orders, update order status
- Supabase backend (PostgreSQL database + auth + file storage)
- Deployed on Vercel (free tier) with auto SSL + CDN

---

## STEP 1 — Set up Supabase (10 mins)

1. Go to https://supabase.com and create a free account
2. Click "New Project" → name it `qureshis-masala`
3. Choose a region close to India (Singapore works well)
4. Wait ~2 minutes for the project to spin up

### Run the database migration
5. In your Supabase project → click "SQL Editor" in the left sidebar
6. Click "New query"
7. Copy the ENTIRE contents of `supabase/migrations/001_schema.sql`
8. Paste it and click "Run" (green button)
9. You should see: "Success. No rows returned"

### Create your admin user
10. In Supabase → Authentication → Users → "Invite user"
11. Enter your email and a strong password
12. This is your admin login for the panel

### Create the storage bucket
13. In Supabase → Storage → "New bucket"
14. Name: `product-images`  |  Public: YES
15. This is where your product photos will live

### Get your API keys
16. In Supabase → Settings → API
17. Copy:
    - "Project URL" → this is your NEXT_PUBLIC_SUPABASE_URL
    - "anon public" key → this is your NEXT_PUBLIC_SUPABASE_ANON_KEY

---

## STEP 2 — Deploy to Vercel (10 mins)

### Push to GitHub first
```bash
cd qureshis-masala
git init
git add .
git commit -m "Initial commit"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/qureshis-masala.git
git push -u origin main
```

### Deploy
1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project" → import your `qureshis-masala` repo
3. Framework Preset: Next.js (auto-detected)
4. Before clicking Deploy, click "Environment Variables" and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
5. Click "Deploy"
6. Wait ~2 minutes → you'll get a URL like `qureshis-masala.vercel.app`

---

## STEP 3 — Upload Product Images (5 mins)

1. In Supabase → Storage → product-images bucket
2. Upload your 4 product photos:
   - kebab-masala.jpg
   - fish-fry-masala.jpg
   - fish-curry-masala.jpg
   - biryani-masala.jpg
3. After uploading each, click the file → copy the public URL
4. Go to Supabase → Table Editor → products table
5. Update the `image_url` column for each product

---

## STEP 4 — Connect a Custom Domain (optional, 5 mins)

1. Buy `qureshismasala.com` on GoDaddy/Namecheap (~₹1000/year)
2. In Vercel → your project → Settings → Domains
3. Add your domain
4. Follow the DNS instructions Vercel shows you
5. SSL is automatic — done in ~10 minutes

---

## STEP 5 — Admin Panel Access

Your admin panel is at: `https://qureshismasala.vercel.app/admin`
- Login with the email/password you created in Supabase Auth
- From there you can: add products, update stock, view + update orders

---

## STEP 6 — Test the Full Flow

1. Go to your website
2. Add products to cart
3. Fill in the order form and submit
4. Go to /admin/orders → you should see the order
5. Update status from "pending" to "confirmed"

---

## ONGOING — How to update things

### Add a new product
→ /admin/products → click "+ Add Product" → fill the form

### Update stock
→ /admin/products → change the number in the stock input → Save

### Mark an order delivered
→ /admin/orders → change dropdown → Update

### Deploy code changes
→ Just `git push` → Vercel auto-deploys in ~2 minutes

---

## FUTURE UPGRADES (when you're ready)

| Feature | Tool | Cost |
|---|---|---|
| WhatsApp order alerts | Twilio / Meta Cloud API | ~₹500/month |
| Email order confirmation | Resend.com | Free up to 3k/month |
| Online payment | Razorpay | 2% per transaction |
| Analytics | Google Analytics | Free |
| Better images | Cloudinary | Free tier |

---

## SUPPORT
If you get stuck on any step, come back and ask — I'll help debug!
