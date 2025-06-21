
'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Pencil, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/all_category`);
      const data = await res.json();
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [search, categories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const data = await res.json();
      toast.success('Category added!');
      setCategories(prev => [...prev, data]);
      setNewCategoryName('');
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add category');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
      toast.success('Category deleted!');
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat.id);
    setEditName(cat.name);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/update/${editingCategory}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          updated_at: new Date().toISOString(),
        }),
      });
      toast.success('Category updated!');
      setEditingCategory(null);
      setEditName('');
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Category List', 14, 16);
    const tableData = categories.map((cat, i) => [
      i + 1,
      cat.name,
      new Date(cat.created_at).toLocaleString(),
      new Date(cat.updated_at).toLocaleString(),
    ]);
    autoTable(doc, {
      head: [['#', 'Name', 'Created At', 'Updated At']],
      body: tableData,
      startY: 20,
    });
    doc.save('categories.pdf');
  };

  const exportToExcel = () => {
    const data = categories.map((cat, i) => ({
      '#': i + 1,
      Name: cat.name,
      'Created At': new Date(cat.created_at).toLocaleString(),
      'Updated At': new Date(cat.updated_at).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Categories');
    XLSX.writeFile(wb, 'categories.xlsx');
  };

  return (
    <div className="category-container">
      <h2 className="title">Category Manager</h2>

      <div className="actions-bar">
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
          {showAddForm ? 'Close Form' : 'Add Category'}
        </button>
        <button onClick={exportToPDF}>PDF</button>
        <button onClick={exportToExcel}>Excel</button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCategory} className="category-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}

      <table className="category-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((cat, i) => (
            <tr key={cat.id}>
              <td>{i + 1}</td>
              <td>
                {editingCategory === cat.id ? (
                  <form onSubmit={handleEditSubmit} className="edit-inline-form">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="inline-input"
                    />
                    <button type="submit" className="save-btn">Save</button>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  cat.name
                )}
              </td>
              <td>{new Date(cat.created_at).toLocaleString()}</td>
              <td>{new Date(cat.updated_at).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEditClick(cat)} className="edit-btn">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="delete-btn">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManager;
