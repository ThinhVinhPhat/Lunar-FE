import { CategoryDetail } from "./category";

export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  price: string;
  discount_percentage: number;
  description: string;
  status: boolean;
  stock: number;
  views: number;
  video: string;
  images: string[];
  isFreeShip: boolean;
  color: string;
  allColors: {
    id: string;
    slug: string;
    color: string;
    image: string;
  }[];
  isNew: boolean;
  isFeatured: boolean;
  isFavorite: boolean;
  productCategories: {
    id: string;
    createdAt: string;
    updatedAt: string;
    quantity: number;
    categoryDetails: {
      id: string;
      createdAt: string;
      updatedAt: string;
      name: string;
      description: string;
      image: string;
      status: boolean;
    };
  }[];
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
  createdAt: string;
  updatedAt: string;
}

export interface ProductColorInterface {
  id: string,
  slug: string,
  color: string,
  image: string,
}

export type ProductCategory = {
  id: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  categoryDetails: CategoryDetail;
};