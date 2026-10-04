"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Product, Category } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Plus, Trash2, Edit2, X } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const load = async () => {
    const [pSnap, cSnap] = await Promise.all([
      getDocs(query(collection(db, "products"), orderBy("createdAt", "desc"))),
      getDocs(query(collection(db, "categories"), orderBy("name"))),
    ]);
    setProducts(pSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
    setCategories(cSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCategoryId("");
    setImageFile(null);
    setImagePreview("");
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setQuantity(String(product.quantity));
    setCategoryId(product.categoryId);
    setImagePreview(product.imageUrl);
    setShowForm(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !quantity || !categoryId) return;
    setSaving(true);

    try {
      let imageUrl = editing?.imageUrl || "";

      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const cat = categories.find((c) => c.id === categoryId);
      const data = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        quantity: Number(quantity),
        categoryId,
        categoryName: cat?.name || "",
        imageUrl,
        updatedAt: Date.now(),
      };

      if (editing) {
        await updateDoc(doc(db, "products", editing.id), data);
      } else {
        await addDoc(collection(db, "products"), {
          ...data,
          createdAt: Date.now(),
        });
      }

      resetForm();
      await load();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 flex items-center gap-2"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editing ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₦)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity (Stock)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="w-full text-sm"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-lg border"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-primary-700 text-white font-semibold rounded-lg hover:bg-primary-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Products list */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products yet. Add your first product.</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.categoryName}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        p.quantity <= 0
                          ? "bg-red-100 text-red-700"
                          : p.quantity <= 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.quantity <= 0 ? "Out of Stock" : p.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
