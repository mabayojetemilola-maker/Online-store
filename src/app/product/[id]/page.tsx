"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() } as Product);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">Loading...</div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p>Product not found</p>
        <Link href="/" className="text-primary-700 underline mt-2 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  const outOfStock = product.quantity <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      imageUrl: product.imageUrl,
      maxQuantity: product.quantity,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 mb-6"
      >
        <ArrowLeft size={16} /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-primary-600 font-medium mb-1">
            {product.categoryName}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>
          <p className="text-3xl font-extrabold text-primary-800 mb-4">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mb-6">
            {outOfStock ? (
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 font-medium rounded-full text-sm">
                Out of Stock
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full text-sm">
                In Stock ({product.quantity} available)
              </span>
            )}
          </div>

          {!outOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 hover:bg-gray-50"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 font-medium">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.quantity, qty + 1))}
                  className="p-2 hover:bg-gray-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 ${
              outOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary-700 hover:bg-primary-800 text-white"
            }`}
          >
            <ShoppingCart size={20} />
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
