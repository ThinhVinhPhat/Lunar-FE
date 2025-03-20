export interface ProductType {
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
  video: string;
  images: string[];
  isFreeShip: boolean;
  isNew: boolean;
  isFeatured: boolean;
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
