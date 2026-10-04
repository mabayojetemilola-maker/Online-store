"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.quantity <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      maxQuantity: product.quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <p className="text-xs text-primary-600 font-medium mb-1">
          {product.categoryName}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug hover:text-primary-700">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-800">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`p-2 rounded-full transition-colors ${
              outOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : added
                ? "bg-green-100 text-green-700"
                : "bg-primary-100 text-primary-700 hover:bg-primary-200"
            }`}
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
