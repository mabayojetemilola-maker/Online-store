"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, Category } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodSnap, catSnap] = await Promise.all([
          getDocs(query(collection(db, "products"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "categories"), orderBy("name"))),
        ]);

        const prods = prodSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
        const cats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));

        setProducts(prods);
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-6 md:p-10 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Welcome to Pratika
        </h1>
        <p className="text-primary-100 text-lg max-w-xl">
          Quality watches, accessories, organic spices, essences and more —
          delivered to your door.
        </p>
      </div>

      {/* Search + Categories */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-primary-700 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-primary-400"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === cat.id
                ? "bg-primary-700 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-primary-400"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl h-72 animate-pulse border border-gray-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
