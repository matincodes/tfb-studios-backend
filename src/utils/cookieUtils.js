const secure = true;
const sameSite = 'None';

/**
 * Sets secure, HttpOnly authentication cookies.
 */
export function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie('access_token', accessToken, {
    httpOnly: true, // This MUST be true for security
    secure: secure,
    sameSite: sameSite,
    path: '/',
    maxAge: 30 * 60 * 1000, // 30 minutes
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true, // This MUST be true for security
    secure: secure,
    sameSite: sameSite,
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

/**
 * Clears authentication cookies.
 */
export function clearAuthCookies(res) {
  const clearOptions = { path: '/', secure, sameSite, httpOnly: true };
  res.clearCookie('access_token', clearOptions);
  res.clearCookie('refresh_token', clearOptions);
}