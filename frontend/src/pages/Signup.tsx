import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../schemas';
import API from '../api';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
export default function Signup(){
  const { register, handleSubmit } = useForm({ resolver: zodResolver(signupSchema) });
  const setAuth = useAuthStore(s=>s.setAuth);
  const nav = useNavigate();
  const onSubmit = async (data:any)=>{
    const res = await API.post('/auth/signup', data);
    setAuth(res.data.user, res.data.token);
    nav('/todos');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign up</h2>
      <div><input placeholder="Name" {...register('name')} /></div>
      <div><input placeholder="Email" {...register('email')} /></div>
      <div><input placeholder="Password" type="password" {...register('password')} /></div>
      <button type="submit">Create account</button>
    </form>
  );
}
