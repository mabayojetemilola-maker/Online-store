"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Package, FolderOpen, ShoppingBag, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    pending: 0,
  });

  useEffect(() => {
    async function load() {
      const [p, c, o] = await Promise.all([
        getDocs(collection(db, "products")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "orders")),
      ]);
      const pending = o.docs.filter((d) => d.data().status === "pending").length;
      setStats({
        products: p.size,
        categories: c.size,
        orders: o.size,
        pending,
      });
    }
    load();
  }, []);

  const cards = [
    { label: "Products", value: stats.products, icon: Package, href: "/admin/products", color: "bg-blue-500" },
    { label: "Categories", value: stats.categories, icon: FolderOpen, href: "/admin/categories", color: "bg-green-500" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, href: "/admin/orders", color: "bg-purple-500" },
    { label: "Pending Orders", value: stats.pending, icon: Users, href: "/admin/orders", color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white mb-3`}>
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
