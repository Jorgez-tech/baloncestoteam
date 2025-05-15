import React, { useState } from 'react';
import client from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const handle = async e => {
    e.preventDefault();
    const { data } = await client.post('/auth/login', { email, contraseña: pass });
    // guardamos accessToken en memoria (ej. state/global store)
    // refreshToken viene como cookie httpOnly
    console.log(data.accessToken);
  };

  return (
    <form onSubmit={handle}>
      <input type="email" onChange={e=>setEmail(e.target.value)} required/>
      <input type="password" onChange={e=>setPass(e.target.value)} required/>
      <button>Entrar</button>
    </form>
  );
}