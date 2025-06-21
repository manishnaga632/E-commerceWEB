'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mob_number: "",
    role: "customer",
    password: "",
  });
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = userId
      ? `http://127.0.0.1:8000/users/users/${userId}`
      : "http://127.0.0.1:8000/auth/register";

    const method = userId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      alert(`User ${userId ? "updated" : "added"} successfully!`);
      router.push("/admin/users");
    } catch (err) {
      console.error("Error:", err);
      alert(`Something went wrong: ${err.message}`);
    }
  };

  useEffect(() => {
    const userIdFromParams = searchParams.get("id");
    if (userIdFromParams) {
      setUserId(userIdFromParams);
      fetch(`http://127.0.0.1:8000/users/users/${userIdFromParams}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            mob_number: data.mob_number || "",
            role: data.role || "customer",
            password: "",
          });
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          alert("Error fetching user data.");
        });
    }
  }, [searchParams]);

  return (
    <div className="user-form-container">
      <h1 className="user-form-title">
        {userId ? "Edit User" : "Add New User"}
      </h1>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="user-form-group">
          <label className="user-form-label">Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className="user-form-input"
            required
          />
        </div>

        <div className="user-form-group">
          <label className="user-form-label">Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="user-form-input"
            required
          />
        </div>

        <div className="user-form-group">
          <label className="user-form-label">Mobile Number</label>
          <input
            type="text"
            name="mob_number"
            placeholder="Phone number"
            value={formData.mob_number}
            onChange={handleChange}
            className="user-form-input"
          />
        </div>

        {!userId && (
          <div className="user-form-group">
            <label className="user-form-label">Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              className="user-form-input"
              required
            />
          </div>
        )}

        <div className="user-form-group">
          <label className="user-form-label">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="user-form-select"
            required
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="user-form-submit-btn"
        >
          {userId ? "Update User" : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;