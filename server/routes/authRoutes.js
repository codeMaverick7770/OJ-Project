import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { register, login } from '../controller/authController.js';
import { JWT_SECRET } from '../config/config.js';

const router = express.Router();

// Email/password routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        role: req.user.role || 'user',
        isNew: req.user.isNew || false,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const redirectUrl = `${clientUrl}/oauth-success?token=${token}`;

    console.log('✅ Google OAuth successful');
    console.log('🔁 Redirecting to:', redirectUrl);

    return res.redirect(redirectUrl);
  }
);

router.get('/test', (req, res) => {
  res.send('✅ /api/auth routes working');
});


export default router;
