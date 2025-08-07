import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  createUser,
  findUserByEmail,
  findUserWithPassword,
  findUserByVerificationToken,
  activateUserAccount,
  updateUserWithToken
} from '../models/authModel.js';

const SALT_ROUNDS = 12;

/**
 * Handles user registration flow.
 */
export async function registerUser({ name, email, password, role = 'USER' }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.status = 409;
    throw error;
  }

  console.log("Register:" , name, email, password, role)
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  console.log("Hashed:", hashedPassword)
  const user = await createUser({ email, name, role, hashedPassword });
  return user;
}

/**
 * Validates login credentials.
 */
export async function validateUserCredentials(email, password) {
  const user = await findUserWithPassword(email);

  if (!user || !user.password || !user.password.hashed) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password.hashed);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
}


/**
 * Generates and saves a verification token for a user.
 */
export const createVerificationToken = async (userId) => {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Update the user with the verification token
    updateUserWithToken(userId, verificationToken);

    return verificationToken;
}

/**
 * Verifies a user's account using a token.
 */
export const verifyUserByToken = async (token) => {
    const user = await findUserByVerificationToken(token);

    // If no user is found with the provided token, throw an error
    if (!user) {
        const error = new Error('Invalid or expired verification token.');
        error.status = 404;
        throw error;
    }

    // Activate the user account
    return activateUserAccount(user.id);
};