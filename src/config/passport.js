// src/config/passport.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { config as env } from './env.js';
import { findUserById, findUserWithPassword } from '../models/authModel.js';

// ------------------
// ✅ Local Strategy
// ------------------
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await findUserWithPassword(email);
        if (!user)
          return done(null, false, { message: 'Invalid email or password' });

        const isValid = bcrypt.compare(password, user.password.hashed || user.password);
        if (!isValid)
          return done(null, false, { message: 'Invalid email or password' });

        // Refetch user without password before attaching to req.user
        const publicUser = await findUserById(user.id);
        return done(null, publicUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// ------------------
// ✅ JWT Strategy
// ------------------
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromExtractors([
      (req) => {
        let token = null;
        if (req && req.cookies){
          token = req.cookies['access_token'];
        }
        console.log('--- Passport: Trying to extract token ---');
        console.log('Token found:', !!token);
        return token;
      },
    ]),
    secretOrKey: env.ACCESS_TOKEN_SECRET,
  },
  async (jwtPayload, done) => {
    try {
      const user = await findUserById(jwtPayload.id);
       if (user) {
        // LOG 3: User was found in DB
        console.log('--- Passport: User found in database ---');
        return done(null, user); // Success, user is attached to req.user
      } else {
        // LOG 4: User NOT found in DB
        console.log('--- Passport: User NOT found in database ---');
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }
);

passport.use(jwtStrategy);

export default passport;
