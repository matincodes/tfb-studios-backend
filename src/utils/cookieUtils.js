
const isProd = process.env.NODE_ENV === 'production';

console.log(isProd)
/**
 * Sets secure, HttpOnly authentication cookies.
 */
export function setAuthCookies(res, { accessToken, refreshToken }) {
console.log("Prod:", isProd)
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'Strict' : 'Lax',
    domain: isProd ? ".up.railway.app" : "localhost",
    path: '/',
    // maxAge: 30 * 60 * 1000,
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'Strict' : 'Lax',
    domain: isProd ? ".up.railway.app" : "localhost",
    path: '/',
    // maxAge: 30 * 24 * 60 * 60 * 1000,
  });

}

/**
 * Clears authentication cookies.
 */
export function clearAuthCookies(res) {
  const clearOptions = { path: '/', secure, sameSite, httpOnly: false };
  res.clearCookie('access_token', clearOptions);
  res.clearCookie('refresh_token', clearOptions);
}