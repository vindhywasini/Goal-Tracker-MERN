import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this';
export interface AuthRequest extends Request {
  user?: any;
}
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction){
  try{
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({ message: 'No authorization header' });
    const token = header.split(' ')[1];
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if(!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  }catch(err){
    next(err);
  }
}
