import { NextFunction } from 'express';
import { Request, Response } from 'express';

export default function AuthenticationValidator(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() || req.path.includes('/login') || (req.path.includes('/usuario') && (req.method === "POST" || req.method === "PUT"))) {
    return next();
  }
  res.sendStatus(403);
}

