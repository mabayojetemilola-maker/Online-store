"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, profile, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight">
              Pratika
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-primary-200 font-medium">
              Shop
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 hover:text-primary-200 font-medium"
              >
                <LayoutDashboard size={18} />
                Admin
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-primary-700 rounded-full"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-primary-100">
                  Hi, {profile?.username || "User"}
                </span>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1 text-sm hover:text-primary-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium hover:bg-primary-700 rounded-md"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm font-medium bg-white text-primary-800 rounded-md hover:bg-primary-50"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block py-2 hover:text-primary-200"
              onClick={() => setMobileOpen(false)}
            >
              Shop
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block py-2 hover:text-primary-200"
                onClick={() => setMobileOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {user ? (
              <>
                <div className="py-2 text-primary-100">
                  Hi, {profile?.username || "User"}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="block py-2 hover:text-primary-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 hover:text-primary-200"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 hover:text-primary-200"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
