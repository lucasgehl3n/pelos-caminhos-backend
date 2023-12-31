import { NextFunction } from 'express';
import { Request, Response } from 'express';

export default function AuthenticationValidator(req: Request, res: Response, next: NextFunction) {
  const whiteListRoutes = [
    '/login',
    '/create-account',
    '/cities',
    '/create-account/save',
  ]
  if (req.isAuthenticated() || whiteListRoutes.includes(req.path) || req.path.startsWith('/public/')) {
    return next();
  }
  res.sendStatus(403);
}

