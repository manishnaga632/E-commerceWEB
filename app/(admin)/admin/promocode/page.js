
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PromocodeManager = () => {
  const [promocodes, setPromocodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchPromocodes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promocode/all_promocode`);
      const data = await res.json();

      // Sort by latest updated_at or created_at
      data.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));

      setPromocodes(data);
    } catch (error) {
      console.error("Failed to fetch promocodes", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromocodes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this promocode?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promocode/delete_promocode/${id}`, {
        method: 'DELETE',
      });
      alert("Promocode deleted successfully");
      fetchPromocodes(); // Refresh list
    } catch (error) {
      alert("Error deleting promocode");
    }
  };

  const handleEdit = (id) => router.push(`/admin/promocode/edit/${id}`);
  const handleAdd = () => router.push('/admin/promocode/add');

  // Function to check if promocode is expired
  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="promocode-manager-container">
      <h1 className="promocode-manager-title">🎁 Promocode Manager</h1>

      <button
        className="promocode-manager-add-btn"
        onClick={handleAdd}
      >
        ➕ Add New Promocode
      </button>

      {isLoading ? (
        <p className="promocode-manager-loading">Loading...</p>
      ) : (
        <div className="promocode-manager-table-container">
          <table className="promocode-manager-table">
            <thead>
              <tr className="promocode-manager-table-header">
                <th className="promocode-manager-header-cell">#</th>
                <th className="promocode-manager-header-cell">🎟 Name</th>
                <th className="promocode-manager-header-cell">💰 Type</th>
                <th className="promocode-manager-header-cell">🔢 Value</th>
                <th className="promocode-manager-header-cell">📊 Status</th>
                <th className="promocode-manager-header-cell">📅 Expiry Date</th>
                <th className="promocode-manager-header-cell">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {promocodes.map((promo) => {
                const expired = isExpired(promo.expiry_date);
                return (
                  <tr
                    key={promo.id}
                    className={`promocode-manager-table-row ${expired ? 'promocode-manager-expired' : ''}`}
                  >
                    <td className="promocode-manager-cell">{promo.id}</td>
                    <td className="promocode-manager-cell">{promo.name}</td>
                    <td className="promocode-manager-cell capitalize">{promo.discount_type}</td>
                    <td className="promocode-manager-cell">{promo.discount_value}</td>
                    <td className="promocode-manager-cell">
                      <span className={`promocode-manager-status-${promo.status ? 'active' : 'inactive'}`}>
                        {promo.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="promocode-manager-cell">{promo.expiry_date}</td>
                    <td className="promocode-manager-cell">
                      <div className="promocode-manager-action-cell">
                        <button
                          className="promocode-manager-edit-btn"
                          onClick={() => handleEdit(promo.id)}
                          disabled={expired}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="promocode-manager-delete-btn"
                          onClick={() => handleDelete(promo.id)}
                          disabled={expired}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
};

export default PromocodeManager;