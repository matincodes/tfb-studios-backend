// src/utils/cookieExtractor.js
export default function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['access_token'];
    }
    return token;
  }
  