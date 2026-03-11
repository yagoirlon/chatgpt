require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { initFirebase } = require('./config/firebase');
const User = require('./models/User');
const Mission = require('./models/Mission');
const bcrypt = require('bcrypt');

(async () => {
  await connectDB();
  initFirebase();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12),
        referralCode: 'ADMIN01',
        role: 'admin'
      });
      console.log('Seeded admin user');
    }
  }

  const missionCount = await Mission.countDocuments();
  if (!missionCount) {
    await Mission.insertMany([
      { title: '2000 steps', stepsRequired: 2000, rewardCoins: 2, type: 'steps', active: true },
      { title: '5000 steps', stepsRequired: 5000, rewardCoins: 4, type: 'steps', active: true },
      { title: '10000 steps', stepsRequired: 10000, rewardCoins: 8, type: 'steps', active: true },
      { title: 'Invite a friend', stepsRequired: 0, rewardCoins: 2, type: 'invite', active: true }
    ]);
    console.log('Seeded default missions');
  }

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API running on :${port}`));
})();
