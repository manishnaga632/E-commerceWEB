'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/context/AdminContext';

export default function LoginPage() {
  const { login, admin, loading, authChecked } = useAdminContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (authChecked && admin) {
      router.replace('/admin/profile');
    }
  }, [admin, authChecked, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      router.replace('/admin/profile');
    } else {
      setError(result.message || 'Only admin access');
    }
  };

  if (!authChecked || loading) return null;

  return (
    <div className="login-container">
      {/* Floating bubbles */}
      {[...Array(10)].map((_, i) => (
        <div 
          key={i}
          className="bubble"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDelay: `${Math.random() * 10}s`
          }}
        />
      ))}
      
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Admin Login</h2>

        {error && <div className="error-message">{error}</div>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="login-input"
        />

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}