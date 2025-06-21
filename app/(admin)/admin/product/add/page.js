"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Utility function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, ""); // Remove non-alphanumeric characters
};

const AddProduct = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    netPrice: "",
    mrp: "",
    quantityInStock: "",
    image: "",
    category: "",
    customCategory: "",
    productCat: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [categories, setCategories] = useState([]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/all_category`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Validate form
  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.netPrice || isNaN(formData.netPrice)) errors.netPrice = "Valid selling price is required";
    if (!formData.mrp || isNaN(formData.mrp)) errors.mrp = "Valid MRP is required";
    if (!formData.quantityInStock || isNaN(formData.quantityInStock)) errors.quantityInStock = "Valid quantity is required";
    if (!formData.image.trim()) errors.image = "Image URL is required";
    if (!formData.category) errors.category = "Please select a category";
    if (formData.category === "Other" && !formData.customCategory.trim()) errors.customCategory = "Enter a custom category";
    if (!formData.productCat) errors.productCat = "Please select a catalogue";
    if (!formData.description.trim()) errors.description = "Description is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async () => {
    if (!validate()) {
      console.log("Validation failed", formErrors);
      return;
    }

    const slug = generateSlug(formData.name);

    const newProduct = {
      name: formData.name,
      description: formData.description,
      mrp: formData.mrp,
      net_price: formData.netPrice,
      quantity_in_stock: formData.quantityInStock,
      image: formData.image,
      product_cat: formData.productCat,
      category_id: formData.category === "Other" ? formData.customCategory : formData.category,
      slug: slug, // Generated slug
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      console.log("Sending POST request", newProduct);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/add`, newProduct);
      console.log("Response received", res.data);

      // Show both alert and toast
      alert("Product added successfully!");
      toast.success("✅ Product added successfully!");  // Success toast

      router.push("/admin/product");
    } catch (err) {
      console.error("Error adding product", err);

      // Show both alert and toast for error
      alert("Failed to add product!");
      toast.error("❌ Failed to add product!");  // Error toast
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">➕ Add New Product</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="Product Name"
          />
          {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
        </div>

        {/* Net Price */}
        <div>
          <input
            type="text"
            value={formData.netPrice}
            onChange={(e) => handleChange("netPrice", e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="Selling Price (₹)"
          />
          {formErrors.netPrice && <p className="text-red-500 text-sm">{formErrors.netPrice}</p>}
        </div>

        {/* MRP */}
        <div>
          <input
            type="text"
            value={formData.mrp}
            onChange={(e) => handleChange("mrp", e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="MRP (₹)"
          />
          {formErrors.mrp && <p className="text-red-500 text-sm">{formErrors.mrp}</p>}
        </div>

        {/* Quantity */}
        <div>
          <input
            type="text"
            value={formData.quantityInStock}
            onChange={(e) => handleChange("quantityInStock", e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="Stock Quantity"
          />
          {formErrors.quantityInStock && <p className="text-red-500 text-sm">{formErrors.quantityInStock}</p>}
        </div>

        {/* Image URL */}
        <div>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="Image URL"
          />
          {formErrors.image && <p className="text-red-500 text-sm">{formErrors.image}</p>}
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="border p-2 rounded-md w-full"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {formErrors.category && <p className="text-red-500 text-sm">{formErrors.category}</p>}
        </div>

        {/* Custom Category Input */}
        {formData.category === "Other" && (
          <div>
            <input
              type="text"
              value={formData.customCategory}
              onChange={(e) => handleChange("customCategory", e.target.value)}
              className="border p-2 rounded-md w-full"
              placeholder="Enter Custom Category"
            />
            {formErrors.customCategory && <p className="text-red-500 text-sm">{formErrors.customCategory}</p>}
          </div>
        )}

        {/* Catalogue Dropdown */}
        <div>
          <select
            value={formData.productCat}
            onChange={(e) => handleChange("productCat", e.target.value)}
            className="border p-2 rounded-md w-full"
          >
            <option value="">Select Catalogue</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="kids">Kids</option>
            <option value="other">Other</option>
          </select>
          {formErrors.productCat && <p className="text-red-500 text-sm">{formErrors.productCat}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="border p-2 rounded-md w-full"
          placeholder="Product Description"
          rows={4}
        />
        {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleAddProduct}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          ✅ Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
