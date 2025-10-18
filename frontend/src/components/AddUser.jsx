import React, { useState } from 'react';
import axios from 'axios';

export default function AddUser({ onAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // await axios.post('http://localhost:3000/api/users', { name, email });
    await axios.post('http://localhost:3000/api/users', { name, email });
    setName(''); setEmail('');
    onAdded && onAdded();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Add</button>
    </form>
  )
}
