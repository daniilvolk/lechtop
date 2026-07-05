export type Role = "user" | "admin";
export type ProductType = "pc" | "laptop" | "component";
export type OrderStatus = "new" | "paid" | "assembling" | "shipped" | "completed" | "cancelled";

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: ProductType;
  brand: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  stock: number;
  barcode: string;
  badges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  blocked: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId?: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    comment: string;
  };
  delivery: string;
  payment: string;
  items: Array<{ productId: string; title: string; price: number; quantity: number }>;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
