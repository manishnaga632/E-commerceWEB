

'use client';

import React, { useContext, useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { userInfo, token, loading, setUserInfo } = useUser();
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [errors, setErrors] = useState({
    name: ''
  });
  const [message, setMessage] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading && !userInfo && authChecked) {
      router.push('/login');
    }
    if (!loading) {
      setAuthChecked(true);
    }
  }, [userInfo, loading, router, authChecked]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || ''
      });
    }
  }, [userInfo]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        name: formData.name,
        mobile: userInfo.mobile || null,
        new_password: null,
        confirm_password: null
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile_update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserInfo(response.data);
      setMessage('✅ Profile updated successfully!');
      setShowForm(false);
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to update profile';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (loading || !authChecked) {
    return (
      <div className="loading-screen">
        <div className="skeleton-loader">
          <div className="skeleton-header"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
        </div>
      </div>
    );
  }

  if (!userInfo) return null;

  return (
    <div className="profile-container">
      <h2 className="profile-heading">👤 User Profile</h2>

      <div className="profile-info">
        <p><strong>Name:</strong> {userInfo.name || 'Not provided'}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Mobile:</strong> {userInfo.mobile || 'Not provided'}</p>
      </div>

      <button
        className="profile-toggle-btn"
        onClick={() => setShowForm(!showForm)}
        aria-expanded={showForm}
        aria-controls="profile-form"
      >
        {showForm ? 'Close Update Form' : 'Update Profile'}
      </button>

      {showForm && (
        <form onSubmit={handleProfileUpdate} className="profile-form" id="profile-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
              aria-required="true"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <button type="submit" className="profile-submit-btn">
            Save Changes
          </button>
        </form>
      )}

      {message && (
        <p className={`profile-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
