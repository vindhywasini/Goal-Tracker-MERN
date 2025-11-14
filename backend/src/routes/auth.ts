import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User';
import { sign } from '../utils/jwt';
import { logErrorToDb } from '../utils/logger';

const router = express.Router();

// signup
router.post('/signup', async (req,res,next)=>{
  try{
    const { email, password, name } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'email and password required' });
    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });
    const token = sign({ id: user._id });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  }catch(err){ logErrorToDb(err); next(err); }
});

// signin
router.post('/signin', async (req,res,next)=>{
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'email and password required' });
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = sign({ id: user._id });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  }catch(err){ logErrorToDb(err); next(err); }
});

// forgot - generate token and (in prod) email it
router.post('/forgot', async (req,res,next)=>{
  try{
    const { email } = req.body;
    if(!email) return res.status(400).json({ message: 'email required' });
    const user = await User.findOne({ email });
    if(!user) return res.status(200).json({ message: 'If that email exists, a reset link was sent' });
    const token = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(Date.now() + (Number(process.env.RESET_TOKEN_EXPIRES_MIN || 60) * 60000));
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();
    // In production you'd send an email. For this assignment we return the token in response for testing.
    res.json({ message: 'Reset token generated (copy it and use /reset)', resetToken: token, expiresAt: expiry });
  }catch(err){ logErrorToDb(err); next(err); }
});

// reset password
router.post('/reset', async (req,res,next)=>{
  try{
    const { token, password } = req.body;
    if(!token || !password) return res.status(400).json({ message: 'token and password required' });
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });
    if(!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  }catch(err){ logErrorToDb(err); next(err); }
});

export default router;
