// src/utils/cookieUtils.js
const isProduction = process.env.NODE_ENV === 'production';
const domain = isProduction ? '.tfbstudios.com' : undefined;
const secure = true;
const sameSite = isProduction ? 'Strict' : 'None';

export function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure,
    sameSite,
    domain,
    path: '/',
    maxAge: 30 * 60 * 1000, // 30 minutes
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    domain,
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export function clearAuthCookies(res) {
  res.clearCookie('access_token', { domain, path: '/' });
  res.clearCookie('refresh_token', { domain, path: '/' });
  }