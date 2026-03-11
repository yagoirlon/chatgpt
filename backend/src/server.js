require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { initFirebase } = require('./config/firebase');
const User = require('./models/User');
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

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API running on :${port}`));
})();
