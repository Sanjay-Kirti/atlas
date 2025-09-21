# MovieHub Deployment Guide

## 🚀 Quick Deployment Steps

### Prerequisites
1. GitHub account with your MovieHub repository
2. Render account (free): [render.com](https://render.com)
3. Vercel account (free): [vercel.com](https://vercel.com)

---

## 📦 Backend Deployment (Render)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and login
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub account
4. Select your `moviehub` repository
5. Render will detect `moviehub-backend/render.yaml`
6. Click **"Apply"** to start deployment

### Step 3: Database Setup
After deployment completes:
1. Go to your Render dashboard
2. Click on your database service
3. Click **"Connect"** → **"External Connection"**
4. Copy the connection command and run:
```bash
# Connect to database
psql <your-database-url>

# Run schema
\i database/schema.sql

# Exit psql
\q
```

### Step 4: Seed Database (Optional)
```bash
# In your local backend directory
DATABASE_URL=<your-render-database-url> node seed.js
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and login
2. Click **"New Project"**
3. Import your GitHub repository
4. Select **"moviehub-frontend"** folder
5. Vercel auto-detects Vite framework
6. Click **"Deploy"**

### Step 2: Configure Environment Variables
1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-render-app.onrender.com/api`
4. Redeploy if needed

---

## 🔗 Final Steps

### Update URLs
1. **Backend URL**: Copy from Render dashboard
2. **Frontend URL**: Copy from Vercel dashboard
3. Update `vercel.json` with correct backend URL if needed
4. Update Render environment variable `FRONTEND_URL` with Vercel URL

### Test Deployment
1. Visit your Vercel frontend URL
2. Test login with: `admin@moviehub.com` / `admin123`
3. Try voting, commenting, and admin features

---

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check Render logs for errors
- Verify environment variables are set
- Ensure database connection is working

**Frontend API errors:**
- Check `VITE_API_URL` environment variable
- Verify backend is deployed and running
- Check CORS settings in backend

**Database connection issues:**
- Verify `DATABASE_URL` is correct
- Check if database schema was applied
- Ensure database is running

### Getting Help
1. Check deployment logs in Render/Vercel dashboards
2. Verify all environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Database schema applied
- [ ] Database seeded (optional)
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] URLs updated in configs
- [ ] Application tested end-to-end
- [ ] README updated with live links

---

## 🎉 Success!

Once deployed, your MovieHub application will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.onrender.com`

Update the README.md with your live links and share with the world! 🌟
