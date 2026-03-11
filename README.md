# StepReward Monorepo

Production-ready walk-to-earn platform composed of:
- `frontend/` Expo React Native mobile app
- `backend/` Node.js + Express API + MongoDB
- `admin/` Next.js admin dashboard

## Features
- JWT authentication, referral system, wallet and withdrawals
- Step sync every 5 minutes using Expo Pedometer with anti-fraud validation
- Missions and offer wall tasks with admin CRUD
- Revenue tracking and push notification plumbing (FCM)
- PIX withdrawal simulation with admin approval workflow

## Quick start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npx expo start
```

### Admin
```bash
cd admin
npm install
npm run dev
```

## Environment
Each app includes `.env.example` with required variables.
