# Deployment Guide

## 1) Backend (Express + MongoDB)
1. `cd backend`
2. `cp .env.example .env` and configure env vars.
3. `npm install`
4. `npm run dev`

For production:
- Build Docker image or deploy to ECS/EC2.
- Use MongoDB Atlas.
- Store uploads/static assets in AWS S3.
- Keep JWT secret in a secrets manager.

## 2) Mobile Frontend (Expo)
1. `cd frontend`
2. `cp .env.example .env`
3. `npm install`
4. `npx expo start`

Production:
- Configure EAS Build.
- Integrate Google Fit / Health Connect for Android.
- Add HealthKit entitlements for iOS.

## 3) Admin Dashboard (Next.js)
1. `cd admin`
2. `cp .env.example .env.local`
3. `npm install`
4. `npm run dev`

Production:
- Deploy on Vercel or AWS Amplify.
- Restrict with SSO/IP allowlist.

## Push Notifications
- Configure Firebase Admin in backend.
- Save device FCM token at login.
- Trigger campaign jobs with cron/queue workers.
