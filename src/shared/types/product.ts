import { CategoryDetail } from "./category";
import { ProductVariantResponse } from "./product-varitant";

export interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  description: string;
  status: boolean;
  video: string | null;
  isFreeShip: boolean;
  isNew: boolean;
  images: string[];
  isFeatured: boolean;
  categories?: string;
  isFavorite?: boolean;
  variants?: ProductVariantResponse[];
}

export interface ProductCategory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  quantity: number;
  categoryDetail: CategoryDetail;
}

export interface ProductType {
  images: string[];
  name: string;
  price: number;
  products: Product[];
  productCount: number;
}

export interface ProductsType {
  data: ProductType[];
}

export interface FavoriteProductInterface {
  product: Product;
  productVariant?: ProductVariantResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductColorInterface {
  id: string;
  slug: string;
  color: string;
  image: string;
}