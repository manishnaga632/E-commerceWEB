

'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserContext } from '@/context/UserContext';

export default function UpdatePasswordPage() {
  const { userInfo, token, loading } = useContext(UserContext);
  const router = useRouter();

  const [mobile, setMobile] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({
    mobile: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!loading && !userInfo) {
      router.push('/login');
    }
  }, [userInfo, loading, router]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      mobile: '',
      newPassword: '',
      confirmPassword: ''
    };

    const registeredMobile = userInfo?.mobile || userInfo?.mobile_number;

    if (!mobile) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (mobile !== registeredMobile) {
      newErrors.mobile = 'Mobile number does not match your profile';
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
      isValid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateForm()) return;
    if (!userInfo) return;
    setIsUpdating(true);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile_update`,
        {
          name: null,
          mobile: null,
          new_password: newPassword,
          confirm_password: confirmPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({ text: '✅ Password updated successfully! Redirecting...', type: 'success' });
      setMobile('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => router.push('/profile'), 2000);
    } catch (error) {
      setMessage({
        text: '❌ Failed to update password. Please try again.',
        type: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="text-center">
      <div className="loading-spinner"></div>
      <p>Loading user data...</p>
    </div>
  );

  return (
    <div className="password-update-container">
      <h2 className="title">🔐 Change Password</h2>
      <p className="auth-header">For security, please verify your mobile number</p>

      <form onSubmit={handlePasswordUpdate} className="password-form">
        <div className="form-group">
          <label>Enter Mobile Number (for verification)</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              setErrors({ ...errors, mobile: '' });
            }}
            className={errors.mobile ? 'error' : ''}
            placeholder="Enter your registered mobile number"
          />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>

        <div className="form-group">
          <label>New Password (min 6 characters)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors({ ...errors, newPassword: '' });
            }}
            className={errors.newPassword ? 'error' : ''}
            placeholder="At least 6 characters"
            minLength={6}
          />
          {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors({ ...errors, confirmPassword: '' });
            }}
            className={errors.confirmPassword ? 'error' : ''}
            placeholder="Re-enter your new password"
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="btn-update" disabled={isUpdating}>
          {isUpdating ? <><span className="loading-spinner"></span> Updating...</> : 'Update Password'}
        </button>
      </form>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="auth-footer">
        Remember your password? <a href="/login" className="auth-link">login instead</a>
      </div>
    </div>
  );
}
