import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema } from '../schemas';
import API from '../api';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Signin(){
  const { register, handleSubmit } = useForm({ resolver: zodResolver(signinSchema) });
  const setAuth = useAuthStore(s=>s.setAuth);
  const nav = useNavigate();
  const onSubmit = async (data:any)=>{
    const res = await API.post('/auth/signin', data);
    setAuth(res.data.user, res.data.token);
    nav('/todos');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign in</h2>
      <div><input placeholder="Email" {...register('email')} /></div>
      <div><input placeholder="Password" type="password" {...register('password')} /></div>
      <button type="submit">Sign in</button>
    </form>
  );
}
