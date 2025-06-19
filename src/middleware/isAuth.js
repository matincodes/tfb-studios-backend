import passport from 'passport';

/**
 * Middleware to protect routes using JWT strategy via cookies.
 * Attaches authenticated user to req.user if token is valid.
 */
export function isAuth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('--- Middleware: "isAuth" - Error from passport ---', err);
      return res.status(500).json({ message: 'Authentication error', error: err.message });
    }

    if (info) {
      console.log('--- Middleware: "isAuth" - Info from passport ---', info.message);
      return res.status(401).json({ message: info.message });
    }
    
    if (!user) {
      console.log('--- Middleware: "isAuth" - No user found, denying access ---');
      return res.status(401).json({ message: 'You are not authorized to perform this action.' });
    }

    console.log('--- Middleware: "isAuth" - Success! Attaching user to request. ---');

    req.user = user;
    next();
  })(req, res, next);
}
