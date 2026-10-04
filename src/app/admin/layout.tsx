"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, Package, FolderOpen, ShoppingBag, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg">
              Pratika Admin
            </Link>
            <nav className="hidden md:flex gap-4 text-sm">
              <Link href="/admin" className="hover:text-primary-200 flex items-center gap-1">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/admin/products" className="hover:text-primary-200 flex items-center gap-1">
                <Package size={16} /> Products
              </Link>
              <Link href="/admin/categories" className="hover:text-primary-200 flex items-center gap-1">
                <FolderOpen size={16} /> Categories
              </Link>
              <Link href="/admin/orders" className="hover:text-primary-200 flex items-center gap-1">
                <ShoppingBag size={16} /> Orders
              </Link>
            </nav>
          </div>
          <Link href="/" className="text-sm flex items-center gap-1 hover:text-primary-200">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
