export interface CategoryDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  image: any;
  status: boolean;
}

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  images: string[];
  status: boolean;
  categoryDetails: CategoryDetail[];
}

export interface ProductCategory {
  categoryId: string;
  productId: string;
}
