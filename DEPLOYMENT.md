# Deployment Guide

## Backend (Production)
1. `cd backend`
2. `cp .env.example .env`
3. Set MongoDB Atlas `MONGO_URI`, JWT secrets, and admin credentials.
4. `npm install`
5. `npm run start`

Recommended:
- Deploy behind HTTPS reverse proxy.
- Use PM2 or container orchestration.
- Restrict CORS to app/admin domains.

## Frontend (Expo / Android)
1. `cd frontend`
2. `cp .env.example .env`
3. `npm install`
4. `npx expo start`

Android production build:
- Configure EAS: `npx eas build:configure`
- Build APK/AAB: `npx eas build --platform android`

## Admin Dashboard
1. `cd admin`
2. `cp .env.example .env.local`
3. `npm install`
4. `npm run dev`

## Required Environment Variables
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `EXPO_PUBLIC_API_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_ADMIN_TOKEN`
