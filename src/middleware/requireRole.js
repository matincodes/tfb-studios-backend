// src/middleware/requireRole.js

/**
 * Middleware to enforce role-based access control.
 * Example usage: requireRole('ADMIN')
 */
export function requireRole(requiredRole) {
    return function (req, res, next) {
      if (!req.user) {
        return res.status(403).json({ error: 'Access denied: no user context' });
      }
  
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ error: `Access denied: requires ${requiredRole} role` });
      }
  
      next();
    };
  }
  