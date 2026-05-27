import { Request, Response, NextFunction } from 'express';
import JwtTokenManager from '../utils/jwt';

export const authMiddleware = (req: Request | any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: 'error', message: 'Token não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = JwtTokenManager.verify(token);

    if (!decoded) {
      return res.status(401).json({ status: 'error', message: 'Token inválido ou expirado.' });
    }

    // Attach user to request
    req.user = decoded;
    
    return next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Token inválido.' });
  }
};
