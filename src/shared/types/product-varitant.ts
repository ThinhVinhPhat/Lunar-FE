import { Product, ProductCategory } from "./product";
import { OrderDetail } from "./order";
import { DiscountProductInterface } from "./discount";

export type GlassesSize = Record<
  'lens' | 'bridge' | 'overallWidth' | 'temple',
  number
>;

export interface Favorite {
  id: string;
  userId: string;
  productVariantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariantResponse {
  id: string;
  product: Product;
  color: string;
  size: GlassesSize;
  price: number;
  views: number;
  stock: number;
  images: string[];
  discount_percentage: number;
  productCategories: ProductCategory[];
  orderDetails: OrderDetail[];
  favorites: Favorite[];
  discountProduct: DiscountProductInterface[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  isNew: boolean;
  productId?: string;
  isFavorite?: boolean;
}