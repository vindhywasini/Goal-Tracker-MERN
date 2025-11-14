import { Request, Response, NextFunction } from 'express';
import { logErrorToDb } from './logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction){
  console.error(err);
  logErrorToDb(err).catch(()=>{});
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
}
