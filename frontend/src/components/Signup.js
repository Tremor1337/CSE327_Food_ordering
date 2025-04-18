// src/components/Signup.js
import React, { useState } from 'react';

function Signup() {
  const [form, setForm] = useState({ username: '', password: '', role: 'customer' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMessage(data.message || JSON.stringify(data));
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" onChange={handleChange} placeholder="Username" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <select name="role" onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
          <option value="delivery">Delivery</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;
