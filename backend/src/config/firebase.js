const admin = require('firebase-admin');

let initialized = false;

function initFirebase() {
  if (initialized || !process.env.FCM_PROJECT_ID) return;
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      clientEmail: process.env.FCM_CLIENT_EMAIL,
      privateKey: process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
  initialized = true;
}

module.exports = { admin, initFirebase };
