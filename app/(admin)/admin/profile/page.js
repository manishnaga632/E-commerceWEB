

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ProfileManager() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormFor, setShowFormFor] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setProfiles(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openForm = (profile) => {
    setShowFormFor(profile.id);
    setFormData({
      name: profile.name || '',
      password: '',
      mobile: profile.mobile || '',
    });
    setErrors({});
  };

  const handleProfileUpdate = async (e, profileId) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name ) {
      setErrors({
        name: !formData.name ? ' name is required' : '',
      });
      return;
    }

    // Check for unique mobile number excluding current user
    if (
      formData.mobile &&
      profiles.some(
        (p) => p.mobile === formData.mobile && p.id !== profileId
      )
    ) {
      setErrors({ mobile: 'Mobile number already used by another user' });
      toast.error('Mobile number already used by another user');
      return;
    }

    const updateData = {
      ...formData,
      email: null,
      role: profiles.find((p) => p.id === profileId)?.role || null,
    };
    // ❌ Remove password if it's empty
    if (!formData.password) {
      delete updateData.password;
    }


    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admin_update/${profileId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('✅ Profile updated successfully');
      setShowFormFor(null);
      await fetchProfiles();
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('❌ Failed to update profile');
    }
  };

  if (loading) return <p>Loading profile(s)...</p>;

  return (
    <div>
      <Toaster position="top-right" />
      <h1>Admin Profile</h1>
      <div className="profile-card-wrapper">
        {profiles.map((profile) => (
          <div className="profile-card" key={profile.id}>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Mobile:</strong> {profile.mobile}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            {/* <p><strong>Created At:</strong> {new Date(profile.created_at).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(profile.updated_at).toLocaleString()}</p> */}

            <button
              className="profile-toggle-btn"
              onClick={() => (showFormFor === profile.id ? setShowFormFor(null) : openForm(profile))}
              aria-expanded={showFormFor === profile.id}
              aria-controls={`profile-form-${profile.id}`}
            >
              {showFormFor === profile.id ? 'Close Update Form' : 'Update Profile'}
            </button>

            {showFormFor === profile.id && (
              <form
                onSubmit={(e) => handleProfileUpdate(e, profile.id)}
                className="profile-form"
                id={`profile-form-${profile.id}`}
                noValidate
              >
                <div className="form-group">
                  <label htmlFor={`name_${profile.id}`}> Name *</label>
                  <input
                    type="text"
                    id={`name_${profile.id}`}
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    aria-required="true"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                

                <div className="form-group">
                  <label htmlFor={`password_${profile.id}`}>Password (leave blank to keep unchanged)</label>
                  <input
                    type="password"
                    id={`password_${profile.id}`}
                    name="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`mobile_${profile.id}`}>Mobile</label>
                  <input
                    type="text"
                    id={`mobile_${profile.id}`}
                    name="mobile"
                    value={formData.mobile || ''}
                    onChange={handleChange}
                    maxLength={15}
                    className={errors.mobile ? 'error' : ''}
                  />
                  {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                </div>

                <div className="form-group">
                  <label>Role (uneditable)</label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    readOnly
                  />
                </div>

                <button type="submit" className="profile-submit-btn">
                  Save Changes
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
