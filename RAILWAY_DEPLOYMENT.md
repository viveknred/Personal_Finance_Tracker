# Railway Deployment Guide

This guide walks you through deploying your Personal Finance Tracker on Railway.

## Prerequisites

1. [Railway Account](https://railway.app) (free tier available)
2. Your project pushed to GitHub
3. Railway CLI (optional): `npm install -g @railway/cli`

## Deployment Steps

### Method 1: GitHub Integration (Recommended)

#### Step 1: Deploy Backend (Spring Boot)

1. Go to [Railway.app](https://railway.app) and sign in
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `Personal_Finance_Tracker` repository
5. Railway will detect the `back-end/Dockerfile` automatically
6. Set the root directory to `back-end`

**Environment Variables to set:**
```
PORT=8081
DATABASE_URL=jdbc:postgresql://ep-icy-river-ad9edq2t-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
DATABASE_USERNAME=neondb_owner
DATABASE_PASSWORD=npg_TRH1qIvk2NhX
SPRING_JPA_SHOW_SQL=false
CORS_ORIGINS=https://your-frontend-domain.railway.app,https://*.railway.app
```

#### Step 2: Deploy Frontend (React)

1. Create a new Railway service for the frontend
2. Connect the same GitHub repository
3. Set the root directory to `front-end`
4. Railway will detect the `front-end/Dockerfile`

**Environment Variables to set:**
```
VITE_API_URL=https://your-backend-service.railway.app
```

### Method 2: Railway CLI

#### Deploy Backend:
```bash
cd back-end
railway login
railway up
```

#### Deploy Frontend:
```bash
cd front-end
railway up
```

## Post-Deployment Configuration

### 1. Update CORS Origins
After deploying both services, update the backend's `CORS_ORIGINS` environment variable:
```
CORS_ORIGINS=https://your-frontend-domain.railway.app,https://*.railway.app
```

### 2. Update Frontend API URL
Update the frontend's `VITE_API_URL` environment variable:
```
VITE_API_URL=https://your-backend-service.railway.app
```

### 3. Database Setup
Your application is already configured to use your Neon PostgreSQL database. No additional setup needed.

## Verification

1. **Backend Health Check**: Visit `https://your-backend-service.railway.app/actuator/health`
2. **Frontend**: Visit `https://your-frontend-domain.railway.app`
3. **API Test**: Try adding an expense through the UI

## Environment Variables Reference

### Backend (.env or Railway Variables):
```
PORT=8081
DATABASE_URL=jdbc:postgresql://your-neon-db-url/neondb?sslmode=require
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
SPRING_JPA_SHOW_SQL=false
CORS_ORIGINS=https://your-frontend-domain.railway.app
LOG_LEVEL=INFO
```

### Frontend (.env or Railway Variables):
```
VITE_API_URL=https://your-backend-service.railway.app
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `CORS_ORIGINS` includes your frontend domain
2. **API Connection**: Check `VITE_API_URL` points to the correct backend URL
3. **Database Connection**: Verify database credentials in backend environment variables
4. **Build Failures**: Check Dockerfile syntax and ensure all dependencies are included

### Health Checks:
- Backend: `GET /actuator/health`
- Frontend: Should load the main page

### Logs:
- Access logs in Railway dashboard under each service
- Check for startup errors or connection issues

## Cost Optimization

- Railway free tier includes 500 hours/month
- Both services will consume this quota
- Consider using Railway's sleep mode for development

## Domain Configuration (Optional)

1. Go to Railway service settings
2. Add custom domain under "Domains"
3. Update environment variables with new domain
4. Configure DNS records as shown in Railway dashboard