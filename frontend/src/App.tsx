import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Todos from './pages/Todos';
import { useAuthStore } from './store';

export default function App(){
  const { user, logout } = useAuthStore();
  return (
    <div style={{ maxWidth:800, margin:'20px auto', padding:20 }}>
      <header style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
        <h1>Todo App</h1>
        <nav>
          {user ? <>
            <button onClick={logout}>Logout</button>
            <Link to="/todos" style={{ marginLeft:10 }}>My Todos</Link>
          </> : <>
            <Link to="/signin">Sign in</Link> | <Link to="/signup" style={{ marginLeft:8 }}>Sign up</Link>
          </>}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to={user?'/todos':'/signin'} />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/todos" element={ user ? <Todos/> : <Navigate to="/signin" />} />
      </Routes>
    </div>
  );
}
