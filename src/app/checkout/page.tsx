"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/utils";
import { collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // For now we simulate order placement (Paystack will be added later)
  const placeOrder = async () => {
    if (!user || !profile) return;
    setLoading(true);
    setError("");
    try {
      // Create order
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: profile.email,
        userPhone: profile.phone,
        items,
        total: totalPrice,
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Reduce stock for each product
      for (const item of items) {
        const productRef = doc(db, "products", item.productId);
        await updateDoc(productRef, {
          quantity: increment(-item.quantity),
        });
      }

      clearCart();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="mb-4">Please login to checkout</p>
        <Link href="/login" className="text-primary-700 font-medium underline">
          Go to Login
        </Link>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="mb-4">Your cart is empty</p>
        <Link href="/" className="text-primary-700 font-medium underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-primary-800 mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We will contact you soon on {profile?.phone}.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-700 text-white font-medium rounded-lg"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between py-2 text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary-800">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-semibold mb-3">Delivery Info</h2>
        <p className="text-sm text-gray-600">Name: {profile?.username}</p>
        <p className="text-sm text-gray-600">Phone: {profile?.phone}</p>
        <p className="text-sm text-gray-600">Email: {profile?.email}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
        <strong>Note:</strong> Online payment (Paystack) will be activated soon.
        For now, orders are placed as &quot;Pending&quot; and we will contact you for payment.
      </div>

      <button
        onClick={placeOrder}
        disabled={loading}
        className="w-full py-3 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-lg disabled:opacity-50"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      <a
        href="https://wa.me/2340000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full mt-3 py-3 bg-green-600 hover:bg-green-500 text-white text-center font-semibold rounded-lg"
      >
        Or Order via WhatsApp
      </a>
    </div>
  );
}
