export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  maxQuantity: number;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  createdAt: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userPhone: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentReference?: string;
  createdAt: number;
  updatedAt: number;
}
