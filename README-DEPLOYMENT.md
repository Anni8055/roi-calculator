# Vercel Deployment Guide

## 🚀 Deploy to Vercel

This project is now configured for easy deployment to Vercel with serverless API functions.

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub repository (optional but recommended)

### Deployment Steps

#### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: franchise-roi-generator
# - Directory: ./
# - Override settings? No
```

#### Option 2: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

### Configuration Files

#### `vercel.json`
- Configures build settings and routing
- Sets up API routes for serverless functions
- Defines environment variables

#### API Routes
- `/api/franchises.js` - Main franchise recommendation endpoint
- `/api/health.js` - Health check endpoint

### Environment Variables

The app automatically detects the environment:
- **Development**: Uses `http://localhost:3001/api/franchises`
- **Production**: Uses `/api/franchises` (relative path)

### Features Included

✅ **Serverless API Functions**
- Franchise recommendations with filtering
- Input validation and error handling
- CORS enabled for all origins

✅ **Static Site Generation**
- React app built with Vite
- Optimized for production
- Automatic routing

✅ **PDF Generation**
- Client-side PDF generation with jsPDF
- No server dependencies required
- Professional report formatting

### Post-Deployment

After deployment, your app will be available at:
- **Production URL**: `https://your-project.vercel.app`
- **API Health Check**: `https://your-project.vercel.app/api/health`
- **Franchise API**: `https://your-project.vercel.app/api/franchises`

### Testing the Deployment

1. Visit your deployed URL
2. Fill out the franchise form
3. Submit to test API integration
4. Download PDF to test client-side generation
5. Check browser console for any errors

### Troubleshooting

**Build Errors:**
- Ensure all dependencies are in `package.json`
- Check that `vercel.json` is in the root directory
- Verify API functions are in `/api` folder

**API Errors:**
- Check Vercel function logs in dashboard
- Verify CORS headers are set correctly
- Test API endpoints directly

**PDF Generation Issues:**
- Ensure `jspdf` and `jspdf-autotable` are installed
- Check browser compatibility
- Verify client-side JavaScript is working

### Custom Domain (Optional)

1. Go to Vercel dashboard → Project Settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Performance Optimization

The deployment includes:
- Automatic code splitting
- Static asset optimization
- CDN distribution
- Serverless function scaling

### Monitoring

Vercel provides built-in analytics:
- Page views and performance
- Function execution metrics
- Error tracking
- Real-time logs

## 🎯 Production Checklist

- [ ] All dependencies installed
- [ ] `vercel.json` configured
- [ ] API functions created
- [ ] Environment variables set
- [ ] Build script working
- [ ] Form validation working
- [ ] PDF generation working
- [ ] Mobile responsive
- [ ] Error handling tested
- [ ] Performance optimized
