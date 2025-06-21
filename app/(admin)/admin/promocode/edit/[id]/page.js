'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const EditPromocode = () => {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    status: true,
    expiry_date: '',
  });

  useEffect(() => {
    const fetchPromocode = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promocode/all_promocode`);
        const data = await res.json();
        const promo = data.find(p => p.id === parseInt(id));
        if (promo) {
          setFormData({
            name: promo.name,
            description: promo.description,
            discount_type: promo.discount_type,
            discount_value: promo.discount_value,
            status: promo.status,
            expiry_date: promo.expiry_date,
          });
        } else {
          alert("Promocode not found");
        }
      } catch (error) {
        alert("Failed to fetch promocode");
      }
    };

    if (id) {
      fetchPromocode();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      discount_value: parseFloat(formData.discount_value),
      updated_at: new Date(),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promocode/update_promocode/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Promocode updated successfully");
        router.push('/admin/promocode');
        router.refresh();
      } else {
        alert("Failed to update promocode");
      }
    } catch (error) {
      alert("Error occurred while updating");
    }
  };

  return (
    <div className="promocode-edit-container">
      <h1 className="promocode-edit-title">Edit Promocode</h1>

      <form onSubmit={handleUpdate} className="promocode-edit-form">
        <div className="promocode-edit-form-group">
          <label className="promocode-edit-label">Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Promo code name"
            value={formData.name}
            onChange={handleChange}
            required
            className="promocode-edit-input"
          />
        </div>

        <div className="promocode-edit-form-group">
          <label className="promocode-edit-label">Description</label>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="promocode-edit-input"
          />
        </div>

        <div className="promocode-edit-form-group">
          <label className="promocode-edit-label">Discount Type *</label>
          <select
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            className="promocode-edit-select"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        <div className="promocode-edit-form-group">
          <label className="promocode-edit-label">
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
            className="promocode-edit-input"
          />
        </div>

        <div className="promocode-edit-checkbox-group">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="promocode-edit-checkbox"
          />
          <label className="promocode-edit-checkbox-label">Active</label>
        </div>

        <div className="promocode-edit-form-group">
          <label className="promocode-edit-label">Expiry Date *</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="promocode-edit-input"
          />
        </div>

        <button
          type="submit"
          className="promocode-edit-submit-btn"
        >
          Update Promocode
        </button>
      </form>



    </div>
  );
};

export default EditPromocode;