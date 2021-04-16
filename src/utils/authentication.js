import jwt from 'jsonwebtoken';

export function generateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET, {
    expiresIn: '60s',
  });
}

export function generateRefreshToken(params = {}) {
  return jwt.sign(params, process.env.REFRESHSECRET, {
    expiresIn: '1y',
  });
}

export function verifyAuthentication(req, res, next) {
  if (!req.isAuth) {
    res.status(401).json({ error: 'Unauthenticated' });
  }
  next();
}

export function bigDawg(req, res, next) {
  const dawg = req.get('DAWG');
  if (!dawg || dawg !== 'BIG') {
    res.status(401).json({ error: 'Unauthenticated' });
  }
  next();
}
