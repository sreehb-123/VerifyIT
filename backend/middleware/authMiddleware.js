import admin from '../config/firebase-admin.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decodedUser = await admin.auth().verifyIdToken(token).catch(async (error) => {
      // Check for revoked tokens
      const customTokenDecoded = await admin.auth().verifyIdToken(token, { checkRevoked: true }).catch(() => null);
      if (customTokenDecoded) return customTokenDecoded;

      throw new Error('Invalid Token');
    });

    req.user = decodedUser; // Attach decoded user info to the request object

    // Check if the user exists in the database
    const user = await User.findOne({ firebaseUID: decodedUser.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user.role = user.role; // Attach user role to request
    next();
  } catch (error) {
    console.error('Token verification error:', error.message); // Log the error message
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
