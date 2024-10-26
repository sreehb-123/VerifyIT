import admin from 'firebase-admin';
import serviceAccount from '../serviceAccount.json' assert { type: 'json' }; // Adjust the path accordingly

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;