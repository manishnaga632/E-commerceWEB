
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddPromocode = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // Initialize error state

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    status: true,
    expiry_date: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const isValidForm = () => {
    const discount = parseFloat(formData.discount_value);
    const today = new Date().toISOString().split('T')[0];

    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (isNaN(discount)) {
      setError("Discount value must be a number");
      return false;
    }

    if (formData.discount_type === 'percentage' && (discount <= 0 || discount > 100)) {
      setError("Percentage discount must be between 0 and 100");
      return false;
    }

    if (formData.discount_type === 'fixed' && discount <= 0) {
      setError("Fixed discount must be greater than 0");
      return false;
    }

    if (!formData.expiry_date) {
      setError("Expiry date is required");
      return false;
    }

    if (formData.expiry_date < today) {
      setError("Expiry date cannot be in the past");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidForm()) return;

    setIsSubmitting(true);

    const payload = {
      ...formData,
      discount_value: parseFloat(formData.discount_value),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promocode/addpromocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add promocode');
      }

      const data = await response.json();
      router.push('/admin/promocode');
      router.refresh();
    } catch (err) {
      console.error('Error adding promocode:', err);
      setError(err.message || 'Failed to connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="promocode-add-container">
      <h1 className="promocode-add-title">Add Promocode</h1>

      {error && (
        <div className="promocode-add-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="promocode-add-form">
        <div className="promocode-add-form-group">
          <label className="promocode-add-label">Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Promo code name"
            value={formData.name}
            onChange={handleChange}
            required
            className="promocode-add-input"
          />
        </div>

        <div className="promocode-add-form-group">
          <label className="promocode-add-label">Description</label>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="promocode-add-input"
          />
        </div>

        <div className="promocode-add-form-group">
          <label className="promocode-add-label">Discount Type *</label>
          <select
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            className="promocode-add-select"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        <div className="promocode-add-form-group">
          <label className="promocode-add-label">
            Discount Value * ({formData.discount_type === 'percentage' ? '%' : '₹'})
          </label>
          <input
            type="number"
            name="discount_value"
            placeholder={formData.discount_type === 'percentage' ? '0-100' : 'Amount'}
            value={formData.discount_value}
            onChange={handleChange}
            required
            min="0"
            step={formData.discount_type === 'percentage' ? '1' : '0.01'}
            className="promocode-add-input"
          />
        </div>

        <div className="promocode-add-checkbox-group">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="promocode-add-checkbox"
          />
          <label className="promocode-add-checkbox-label">Active</label>
        </div>

        <div className="promocode-add-form-group">
          <label className="promocode-add-label">Expiry Date *</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="promocode-add-input"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`promocode-add-submit-btn ${isSubmitting ? 'promocode-add-submit-disabled' : ''}`}
        >
          {isSubmitting ? 'Adding...' : 'Add Promocode'}
        </button>
      </form>



    </div>
  );
};

export default AddPromocode;