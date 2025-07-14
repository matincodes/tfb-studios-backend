import passport from 'passport';

/**
 * Middleware to protect routes using JWT strategy via cookies.
 * Attaches authenticated user to req.user if token is valid.
 */
export function isAuth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication error', error: err.message });
    }

    if (info) {
      return res.status(401).json({ message: info.message });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'You are not authorized to perform this action.' });
    }

    req.user = user;
    next();
  })(req, res, next);
}
