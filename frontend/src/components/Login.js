// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.token) {
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setMessage(`Welcome ${data.user.username} (${data.user.role})!`);

        
        switch (data.user.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'owner':
            navigate('/owner-dashboard');
            break;
          case 'delivery':
            navigate('/delivery-dashboard');
            break;
          default:
            navigate('/customer-dashboard');
        }
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setMessage('Login failed: Server error or network issue.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" onChange={handleChange} placeholder="Username" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
