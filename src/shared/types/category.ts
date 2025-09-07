export interface CategoryDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  image: string;
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
