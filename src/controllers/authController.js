// src/controllers/authController.js
import { registerUser, validateUserCredentials, createVerificationToken, verifyUserByToken } from '../services/authService.js';
import { generateTokenPair, verifyRefreshToken } from '../services/tokenService.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookieUtils.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { sendVerificationEmail } from '../services/emailServices.js';

/**
 * @desc    Sign up a new user
 */
export const signUp = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!email || !password || !name) {
    return sendError(res, 400, 'Name, email and password are required');
  }

  try {
    const user = await registerUser({ name, email, password, role });

    const token = await createVerificationToken(user.id);

    await sendVerificationEmail(user.email, token);

    return sendSuccess(res, 201, 'User registered successfully! Please check your email to verify your account.', { user });
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Signup failed');
  }
};

/**
 * @desc    Verify user's email using a token
 */
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return sendError(res, 400, 'Verification token is missing.');
        }

        const user = await verifyUserByToken(token);

        const tokens = generateTokenPair({ id: user.id, email: user.email, role: user.role });

        setAuthCookies(res, tokens);

        return sendSuccess(res, 200, 'Email verified successfully! You can now log in.');
    } catch (error) {
        return sendError(res, error.status || 500, error.message || 'Email verification failed.');
    }
}

/**
 * @desc    Log in an existing user
 */
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required');
  }

  try {
    const user = await validateUserCredentials(email, password);

    console.log('--- AuthController: User object before token generation ---');
    console.log(user);

    // if (!user.isVerified) {
    //     return sendError(res, 403, 'Your account has not been verified. Please check your email.');
    // }

    const tokens = generateTokenPair({ id: user.id, email: user.email, role: user.role });

    setAuthCookies(res, tokens);

    return sendSuccess(res, 200, 'Login successful', { user });
  } catch (error) {
    return sendError(res, error.status || 401, error.message || 'Login failed');
  }
};

/**
 * @desc    Refresh access token using cookie-based refresh token
 */
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return sendError(res, 401, 'Refresh token missing');

    const user = verifyRefreshToken(refreshToken);

    const tokens = generateTokenPair({ id: user.id, email: user.email, role: user.role });

    setAuthCookies(res, tokens);

    return sendSuccess(res, 200, 'Access token refreshed');
  } catch (err) {
    return sendError(res, 403, 'Invalid or expired refresh token');
  }
};

/**
 * @desc    Log out the user
 */
export const signOut = async (req, res) => {
  clearAuthCookies(res);
  return sendSuccess(res, 200, 'Logged out successfully');
};
