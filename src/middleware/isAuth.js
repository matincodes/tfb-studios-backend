import passport from 'passport';

/**
 * Middleware to protect routes using JWT strategy via cookies.
 * Attaches authenticated user to req.user if token is valid.
 */
export function isAuth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized access',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
}
