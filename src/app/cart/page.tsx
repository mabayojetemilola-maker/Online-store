"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Shopping Cart ({totalItems} items)
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
          >
            <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  No img
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="text-primary-700 font-bold mt-1">
                {formatPrice(item.price)}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1.5 hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1.5 hover:bg-gray-50"
                    disabled={item.quantity >= item.maxQuantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="text-right font-bold text-gray-900">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total</span>
          <span className="text-primary-800">{formatPrice(totalPrice)}</span>
        </div>

        {user ? (
          <Link
            href="/checkout"
            className="block w-full py-3 bg-primary-700 hover:bg-primary-800 text-white text-center font-semibold rounded-lg"
          >
            Proceed to Checkout
          </Link>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Please login to continue to checkout
            </p>
            <Link
              href="/login"
              className="block w-full py-3 bg-primary-700 hover:bg-primary-800 text-white text-center font-semibold rounded-lg"
            >
              Login to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
