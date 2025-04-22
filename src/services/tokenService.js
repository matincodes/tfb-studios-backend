// src/services/tokenService.js
import jwt from 'jsonwebtoken';
import { config as env } from '../config/env.js';

const ACCESS_EXPIRY = '30m';
const REFRESH_EXPIRY = '30d';

/**
 * Generates a pair of access and refresh tokens.
 */
export function generateTokenPair(payload) {
  const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  });

  return { accessToken, refreshToken };
}

/**
 * Verifies a refresh token and returns the payload.
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
}
