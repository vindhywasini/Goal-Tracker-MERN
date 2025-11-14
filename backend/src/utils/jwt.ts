import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this';
export function sign(payload: any, expiresIn='7d'){
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
export function verify(token: string){
  return jwt.verify(token, JWT_SECRET);
}
