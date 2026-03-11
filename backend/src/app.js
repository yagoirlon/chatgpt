const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(apiLimiter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/steps', require('./routes/stepsRoutes'));
app.use('/missions', require('./routes/missionsRoutes'));
app.use('/tasks', require('./routes/tasksRoutes'));
app.use('/referral', require('./routes/referralRoutes'));
app.use('/referrals', require('./routes/referralRoutes'));
app.use('/wallet', require('./routes/walletRoutes'));
app.use('/rewards', require('./routes/rewardsRoutes'));
app.use('/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

module.exports = app;
