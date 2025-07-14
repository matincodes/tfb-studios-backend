// src/services/tokenService.js
import jwt from 'jsonwebtoken';
import { config as env } from '../config/env.js';


/**
 * Generates a pair of access and refresh tokens.
 */
export function generateTokenPair(payload) {
  // Ensure the payload passed has an 'id' property.
  if (!payload.id) {
    // This is a safeguard against creating invalid tokens.
    throw new Error('User ID is missing from token payload');
  }

  // The payload for the JWT should be a plain object.
  const tokenPayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role
  };


  // Add a safeguard to prevent signing a token without an ID.
  if (!tokenPayload.id) {
    throw new Error("Cannot generate token, user ID is missing from the payload.");
  }
  const accessToken = jwt.sign(tokenPayload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m', // Example: 30 minutes
  });

  const refreshToken = jwt.sign(tokenPayload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d', // Example: 30 days
  });

  return { accessToken, refreshToken };
}


/**
 * Verifies a refresh token and returns the payload.
 */
export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}
