// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Pencil, Trash2, Plus, FileDown, Search } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import * as XLSX from 'xlsx';

// const UsersManager = () => {
//   const router = useRouter();
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/all_users`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) throw new Error('Failed to fetch users');

//       const data = await response.json();
//       const usersArray = Array.isArray(data) ? data : [data];

//       const uniqueUsers = usersArray.reduce((acc, user) => {
//         if (!acc.some(u => u.email === user.email)) {
//           acc.push(user);
//         }
//         return acc;
//       }, []);

//       const sortedUsers = uniqueUsers.sort((a, b) => b.id - a.id);
//       setUsers(sortedUsers);
//       setFilteredUsers(sortedUsers);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = users.filter(user => 
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.mobile?.includes(searchTerm));
//       setFilteredUsers(filtered);
//     } else {
//       setFilteredUsers(users);
//     }
//   }, [searchTerm, users]);

//   const handleEdit = (user) => {
//     router.push(`/admin/users/add?id=${user.id}`);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this user?')) return;

//     setDeletingId(id);
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/delete_users/${id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) throw new Error('Failed to delete user');

//       toast.success('User deleted successfully!');
//       setUsers(prev => prev.filter(user => user.id !== id));
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Users List", 14, 16);

//     const tableData = filteredUsers.map((user) => [
//       user.id,
//       user.name || "N/A",
//       user.mobile || "N/A",
//       user.email || "N/A",
//       user.role || "user",
//     ]);

//     autoTable(doc, {
//       head: [["ID", "Name", "Mobile", "Email", "Role"]],
//       body: tableData,
//       startY: 20,
//     });

//     doc.save("users.pdf");
//   };

//   const exportToExcel = () => {
//     const data = filteredUsers.map((user) => ({
//       ID: user.id,
//       Name: user.name || "N/A",
//       Mobile: user.mobile || "N/A",
//       Email: user.email || "N/A",
//       Role: user.role || "user",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
//     XLSX.writeFile(workbook, "users.xlsx");
//   };

//   return (
//     <div className="admin-dashboard">
//       <div className="dashboard-header">
//         <h1 className="dashboard-title">Users Manager</h1>
        
//         <div className="dashboard-actions">
//           <input
//             type="text"
//             placeholder="Search users..."
//             className="search-bar"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
          
//           {/* <button
//             onClick={() => router.push("/admin/users/add")}
//             className="action-btn action-btn-primary"
//           >
//             <Plus size={18} />
//             Add User
//           </button> */}
//           <button
//             onClick={exportToPDF}
//             className="action-btn action-btn-secondary"
//           >
//             <FileDown size={16} />
//             PDF
//           </button>
//           <button
//             onClick={exportToExcel}
//             className="action-btn action-btn-tertiary"
//           >
//             <FileDown size={16} />
//             Excel
//           </button>
//         </div>
//       </div>

//       <div className="dashboard-table-container">
//         <table className="dashboard-table">
//           <thead className="table-header">
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Mobile</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className="loading-state">
//                   Loading users...
//                 </td>
//               </tr>
//             ) : filteredUsers.length > 0 ? (
//               filteredUsers.map((user) => (
//                 <tr key={user.id} className="table-row">
//                   <td className="table-cell">{user.id}</td>
//                   <td className="table-cell">{user.name || "N/A"}</td>
//                   <td className="table-cell">{user.mobile || "N/A"}</td>
//                   <td className="table-cell">{user.email}</td>
//                   <td className="table-cell">{user.role || "user"}</td>
//                   <td className="table-cell">
//                     <div className="action-cell">
//                       <button
//                         onClick={() => handleEdit(user)}
//                         className="icon-btn edit-btn"
//                       >
//                         <Pencil size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(user.id)}
//                         disabled={deletingId === user.id}
//                         className="icon-btn delete-btn"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="empty-state">
//                   {searchTerm ? 'No matching users found' : 'No users found'}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UsersManager;


'use client';
import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, FileDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const UsersManager = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/all_users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      const usersArray = Array.isArray(data) ? data : [data];

      const uniqueUsers = usersArray.reduce((acc, user) => {
        if (!acc.some(u => u.email === user.email)) {
          acc.push(user);
        }
        return acc;
      }, []);

      const sortedUsers = uniqueUsers.sort((a, b) => b.id - a.id);
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.includes(searchTerm));
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // Password is typically not shown in edit forms
      mobile: user.mobile || '',
      role: user.role || 'user'
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    setEditingId(editingUser.id);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admin_update/${editingUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            mobile: formData.mobile,
            role: formData.role
          })
        }
      );

      if (!response.ok) throw new Error('Failed to update user');

      toast.success('User updated successfully!');
      setShowEditModal(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/delete_users/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete user');

      toast.success('User deleted successfully!');
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Users List", 14, 16);

    const tableData = filteredUsers.map((user) => [
      user.id,
      user.name || "N/A",
      user.mobile || "N/A",
      user.email || "N/A",
      user.role || "user",
    ]);

    autoTable(doc, {
      head: [["ID", "Name", "Mobile", "Email", "Role"]],
      body: tableData,
      startY: 20,
    });

    doc.save("users.pdf");
  };

  const exportToExcel = () => {
    const data = filteredUsers.map((user) => ({
      ID: user.id,
      Name: user.name || "N/A",
      Mobile: user.mobile || "N/A",
      Email: user.email || "N/A",
      Role: user.role || "user",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="admin-dashboard">
      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit User</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={editingId === editingUser?.id}
                className="btn-confirm"
              >
                {editingId === editingUser?.id ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <h1 className="dashboard-title">Users Manager</h1>
        
        <div className="dashboard-actions">
          <input
            type="text"
            placeholder="Search users..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <button
            onClick={exportToPDF}
            className="action-btn action-btn-secondary"
          >
            <FileDown size={16} />
            PDF
          </button>
          <button
            onClick={exportToExcel}
            className="action-btn action-btn-tertiary"
          >
            <FileDown size={16} />
            Excel
          </button>
        </div>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-state">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">{user.id}</td>
                  <td className="table-cell">{user.name || "N/A"}</td>
                  <td className="table-cell">{user.mobile || "N/A"}</td>
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell">{user.role || "user"}</td>
                  <td className="table-cell">
                    <div className="action-cell">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="icon-btn edit-btn"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                        className="icon-btn delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  {searchTerm ? 'No matching users found' : 'No users found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManager;