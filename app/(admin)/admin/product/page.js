// 'use client';
// import React, { useEffect, useState ,useRef} from 'react';
// import { Pencil, Trash2, Plus, FileDown, Search } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import * as XLSX from 'xlsx';

// const ProductManager = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editProduct, setEditProduct] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [customCategory, setCustomCategory] = useState('');
//   const formRef = useRef(null);
//   const router = useRouter();

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/all_products`);
//       const data = await res.json();
//       const sorted = Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [];
//       setProducts(sorted);
//       setFilteredProducts(sorted);
//     } catch (err) {
//       console.error("Failed to fetch products", err);
//       toast.error("Failed to fetch products");
//     }
//   };

//   const fetchDropdowns = async () => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/all_category`);
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       console.error("Failed to fetch dropdown data", err);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchDropdowns();

//     const handleClickOutside = (e) => {
//       if (formRef.current && !formRef.current.contains(e.target)) {
//         setEditProduct(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = products.filter(product => 
//         product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.product_cat?.toLowerCase().includes(searchTerm.toLowerCase()));
//       setFilteredProducts(filtered);
//     } else {
//       setFilteredProducts(products);
//     }
//   }, [searchTerm, products]);

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;
//     try {
//       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/delete/id/${id}`, {
//         method: 'DELETE'
//       });
//       toast.success("Product deleted!");
//       fetchProducts();
//     } catch (err) {
//       toast.error("Error deleting product!");
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const updatedProduct = {
//         ...editProduct,
//         category: editProduct.category === "Other" ? customCategory : editProduct.category,
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/update/${editProduct.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedProduct)
//       });
//       const data = await res.json();

//       setProducts((prev) => {
//         const updatedProductList = prev.filter((p) => p.id !== editProduct.id);
//         return [data, ...updatedProductList];
//       });

//       toast.success("Product updated successfully!");
//       setEditProduct(null);
//     } catch (err) {
//       toast.error("Failed to update product!");
//     }
//   };

//   const handleEditClick = (product) => {
//     setEditProduct({
//       ...product,
//       category: typeof product.category === "object" ? product.category.name : product.category,
//       product_cat: product.product_cat || "",
//     });
//     setCustomCategory("");
//     setTimeout(() => {
//       formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
//     }, 100);
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Products Report", 14, 16);
//     const tableColumn = ["ID", "Name", "Price", "MRP", "Stock", "Category", "Catalogue"];
//     const tableRows = filteredProducts.map(p => [
//       p.id,
//       p.name,
//       `₹${p.net_price}`,
//       `₹${p.mrp}`,
//       p.quantity_in_stock,
//       typeof p.category === "object" ? p.category.name : p.category,
//       p.product_cat,
//     ]);
//     autoTable(doc, {
//       startY: 20,
//       head: [tableColumn],
//       body: tableRows,
//     });
//     doc.save("products.pdf");
//   };

//   const exportToExcel = () => {
//     const exportData = filteredProducts.map(p => ({
//       ID: p.id,
//       Name: p.name,
//       Price: p.net_price,
//       MRP: p.mrp,
//       Stock: p.quantity_in_stock,
//       Category: typeof p.category === "object" ? p.category.name : p.category,
//       Catalogue: p.product_cat,
//       Description: p.description,
//       Image: p.image,
//     }));
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
//     XLSX.writeFile(workbook, "products.xlsx");
//   };

//   return (
//     <div className="admin-dashboard">
//       <div className="dashboard-header">
//         <h1 className="dashboard-title">Product Manager</h1>

//         <div className="dashboard-actions">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="search-bar"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <button
//             onClick={() => router.push("/admin/product/add")}
//             className="action-btn action-btn-primary"
//           >
//             <Plus size={18} />
//             Add Product
//           </button>
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

//       {editProduct && (
//         <div ref={formRef} className="dashboard-form">
//           <h2 className="form-title">Edit Product</h2>
//           <div className="form-grid">
//             <input
//               name="name"
//               value={editProduct.name}
//               onChange={handleEditChange}
//               className="form-input"
//               placeholder="Product Name"
//             />
//             <input
//               name="net_price"
//               value={editProduct.net_price}
//               onChange={handleEditChange}
//               className="form-input"
//               placeholder="Selling Price (₹)"
//             />
//             <input
//               name="mrp"
//               value={editProduct.mrp}
//               onChange={handleEditChange}
//               className="form-input"
//               placeholder="MRP (₹)"
//             />
//             <input
//               name="quantity_in_stock"
//               value={editProduct.quantity_in_stock}
//               onChange={handleEditChange}
//               className="form-input"
//               placeholder="Stock Quantity"
//             />
//             <input
//               name="image"
//               value={editProduct.image}
//               onChange={handleEditChange}
//               className="form-input"
//               placeholder="Image URL"
//             />

//             <select
//               name="category"
//               value={editProduct.category}
//               onChange={handleEditChange}
//               className="form-input"
//             >
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.name}>{cat.name}</option>
//               ))}
//               <option value="Other">Other</option>
//             </select>

//             {editProduct.category === "Other" && (
//               <input
//                 value={customCategory}
//                 onChange={(e) => setCustomCategory(e.target.value)}
//                 placeholder="New Category"
//                 className="form-input"
//               />
//             )}

//             <select
//               name="product_cat"
//               value={editProduct.product_cat || ""}
//               onChange={handleEditChange}
//               className="form-input"
//             >
//               <option value="">Select Catalogue</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="kids">Kids</option>
//               <option value="other">Other</option>
//             </select>

//             <textarea
//               name="description"
//               value={editProduct.description}
//               onChange={handleEditChange}
//               className="form-input form-textarea"
//               placeholder="Description"
//               rows={3}
//             />
//           </div>
//           <div className="flex justify-center">
//             <button
//               onClick={handleUpdate}
//               className="action-btn action-btn-primary"
//             >
//               Update Product
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="dashboard-table-container">
//         <table className="dashboard-table">
//           <thead className="table-header">
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Price</th>
//               <th>MRP</th>
//               <th>Stock</th>
//               <th>Category</th>
//               <th>Catalogue</th>
//               <th>Image</th>
//               <th>Description</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map((product) => (
//                 <tr key={product.id} className="table-row">
//                   <td className="table-cell">{product.id}</td>
//                   <td className="table-cell">{product.name}</td>
//                   <td className="table-cell">₹{product.net_price}</td>
//                   <td className="table-cell">₹{product.mrp}</td>
//                   <td className="table-cell">{product.quantity_in_stock}</td>
//                   <td className="table-cell">
//                     {typeof product.category === "object" ? product.category.name : product.category}
//                   </td>
//                   <td className="table-cell capitalize">{product.product_cat}</td>
//                   <td className="table-cell">
//                     {product.image && (
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="h-12 w-12 object-cover rounded cursor-pointer"
//                         onClick={() => window.open(product.image, "_blank")}
//                       />
//                     )}
//                   </td>
//                   <td className="table-cell max-w-xs truncate">{product.description}</td>
//                   <td className="table-cell">
//                     <div className="action-cell">
//                       <button
//                         onClick={() => handleEditClick(product)}
//                         className="icon-btn edit-btn"
//                       >
//                         <Pencil size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.id)}
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
//                 <td colSpan="10" className="empty-state">
//                   {searchTerm ? 'No matching products found' : 'No products found'}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductManager;

'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Pencil, Trash2, Plus, FileDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const formRef = useRef(null);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/all_products`);
      const data = await res.json();
      const sorted = Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [];
      setProducts(sorted);
      setFilteredProducts(sorted);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to fetch products");
    }
  };

  const fetchDropdowns = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/all_category`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDropdowns();

    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setEditProduct(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_cat?.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/delete/id/${id}`, {
        method: 'DELETE'
      });
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err) {
      toast.error("Error deleting product!");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedProduct = {
        ...editProduct,
        category: editProduct.category === "Other" ? customCategory : editProduct.category,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/update/${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      });
      const data = await res.json();

      setProducts((prev) => {
        const updatedProductList = prev.filter((p) => p.id !== editProduct.id);
        return [data, ...updatedProductList];
      });

      toast.success("Product updated successfully!");
      setEditProduct(null);
    } catch (err) {
      toast.error("Failed to update product!");
    }
  };

  const handleEditClick = (product) => {
    setEditProduct({
      ...product,
      category: typeof product.category === "object" ? product.category.name : product.category,
      product_cat: product.product_cat || "",
    });
    setCustomCategory("");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Products Report", 14, 16);
    const tableColumn = ["ID", "Name", "Price", "MRP", "Stock", "Category", "Catalogue"];
    const tableRows = filteredProducts.map(p => [
      p.id,
      p.name,
      `₹${p.net_price}`,
      `₹${p.mrp}`,
      p.quantity_in_stock,
      typeof p.category === "object" ? p.category.name : p.category,
      p.product_cat,
    ]);
    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });
    doc.save("products.pdf");
  };

  const exportToExcel = () => {
    const exportData = filteredProducts.map(p => ({
      ID: p.id,
      Name: p.name,
      Price: p.net_price,
      MRP: p.mrp,
      Stock: p.quantity_in_stock,
      Category: typeof p.category === "object" ? p.category.name : p.category,
      Catalogue: p.product_cat,
      Description: p.description,
      Image: p.image,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
  };






  return (
    <div className="product-manager-container">
      <div className="product-manager-header">
        <h1 className="product-manager-title">Product Manager</h1>

        <div className="product-manager-actions">
          <div className="product-manager-search-container">
            <Search className="product-manager-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="product-manager-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="product-manager-buttons">
            <button
              onClick={() => router.push("/admin/product/add")}
              className="product-manager-button product-manager-button-primary"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </button>
            <button
              onClick={exportToPDF}
              className="product-manager-button product-manager-button-secondary"
            >
              <FileDown size={16} />
              <span>PDF</span>
            </button>
            <button
              onClick={exportToExcel}
              className="product-manager-button product-manager-button-tertiary"
            >
              <FileDown size={16} />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {editProduct && (
        <div ref={formRef} className="product-manager-edit-form">
          <h2 className="product-manager-form-title">Edit Product</h2>
          <div className="product-manager-form-grid">
            <input
              name="name"
              value={editProduct.name}
              onChange={handleEditChange}
              className="product-manager-form-input"
              placeholder="Product Name"
            />
            <input
              name="net_price"
              value={editProduct.net_price}
              onChange={handleEditChange}
              className="product-manager-form-input"
              placeholder="Selling Price (₹)"
            />
            <input
              name="mrp"
              value={editProduct.mrp}
              onChange={handleEditChange}
              className="product-manager-form-input"
              placeholder="MRP (₹)"
            />
            <input
              name="quantity_in_stock"
              value={editProduct.quantity_in_stock}
              onChange={handleEditChange}
              className="product-manager-form-input"
              placeholder="Stock Quantity"
            />
            <input
              name="image"
              value={editProduct.image}
              onChange={handleEditChange}
              className="product-manager-form-input"
              placeholder="Image URL"
            />

            <select
              name="category"
              value={editProduct.category}
              onChange={handleEditChange}
              className="product-manager-form-input"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
              <option value="Other">Other</option>
            </select>

            {editProduct.category === "Other" && (
              <input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="New Category"
                className="product-manager-form-input"
              />
            )}

            <select
              name="product_cat"
              value={editProduct.product_cat || ""}
              onChange={handleEditChange}
              className="product-manager-form-input"
            >
              <option value="">Select Catalogue</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="kids">Kids</option>
              <option value="other">Other</option>
            </select>

            <textarea
              name="description"
              value={editProduct.description}
              onChange={handleEditChange}
              className="product-manager-form-input product-manager-form-textarea"
              placeholder="Description"
              rows={3}
            />
          </div>
          <div className="product-manager-form-actions">
            <button
              onClick={handleUpdate}
              className="product-manager-button product-manager-button-primary"
            >
              Update Product
            </button>
          </div>
        </div>
      )}

      <div className="product-manager-table-wrapper">
        <table className="product-manager-table">
          <thead className="product-manager-table-header">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>MRP</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Catalogue</th>
              <th>Image</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="product-manager-table-row">
                  <td className="product-manager-table-cell">{product.id}</td>
                  <td className="product-manager-table-cell">{product.name}</td>
                  <td className="product-manager-table-cell">₹{product.net_price}</td>
                  <td className="product-manager-table-cell">₹{product.mrp}</td>
                  <td className="product-manager-table-cell">{product.quantity_in_stock}</td>
                  <td className="product-manager-table-cell">
                    {typeof product.category === "object" ? product.category.name : product.category}
                  </td>
                  <td className="product-manager-table-cell capitalize">{product.product_cat}</td>
                  <td className="product-manager-table-cell">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-manager-image"
                        onClick={() => window.open(product.image, "_blank")}
                      />
                    )}
                  </td>
                  <td className="product-manager-table-cell product-manager-description">
                    {product.description}
                  </td>
                  <td className="product-manager-table-cell product-manager-action-cell">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="product-manager-action-button product-manager-edit-button"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="product-manager-action-button product-manager-delete-button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="product-manager-empty-message">
                  {searchTerm ? 'No matching products found' : 'No products found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default ProductManager;
