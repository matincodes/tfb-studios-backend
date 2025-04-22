// src/services/authService.js
import bcrypt from 'bcrypt';
import {
  createUser,
  findUserByEmail,
  findUserWithPassword,
} from '../models/authModel.js';

const SALT_ROUNDS = 12;

/**
 * Handles user registration flow.
 */
export async function registerUser({ fullName, email, password, role = 'USER' }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await createUser({ email, fullName, role, password: hashedPassword });
  return user;
}

/**
 * Validates login credentials.
 */
export async function validateUserCredentials(email, password) {
  const user = await findUserWithPassword(email);

  if (!user || !user.password) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
}
