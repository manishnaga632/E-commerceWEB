

'use client';
import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/context/AdminContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const UpdatePasswordPage = () => {
  const { admin, token, loading } = useAdminContext();
  const router = useRouter();

  const [inputMobile, setInputMobile] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storedMobile, setStoredMobile] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin');
    } else if (admin) {
      setStoredMobile(admin.mobile || '');
    }
  }, [admin, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputMobile !== storedMobile) {
      setMessage('❌ Mobile number does not match!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match!');
      return;
    }

    try {
      await axios.put(
        '${process.env.NEXT_PUBLIC_API_URL}/users/profile_update',
        {
          first_name: null,
          last_name: null,
          mobile: null,
          new_password: newPassword,
          confirm_password: confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('✅ Password updated successfully!');
      setInputMobile('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/admin/profile');
      }, 1500);

    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage('❌ Failed to update password. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="password-update-container">
      <h2 className="title">🔐 Change Password</h2>

      {/* Message Display Area */}
      <div className="message-container">
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label>Enter Mobile Number (for verification)</label>
          <input
            type="text"
            value={inputMobile}
            onChange={(e) => setInputMobile(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-update">Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePasswordPage;