import instance from "..";

export const getCategoriesDetail = async () => {
  const response = await instance.get(`/category-details`);
  return response.data;
};

export const addCategory = async (data: any) => {
  const response = await instance.post(`/category`, {
    name: data.name,
  });
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await instance.delete(`/category/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await instance.get(`/category`);
  return response.data;
};

export const getCategoriesDetailByCategoryName = async (name: string) => {
  const response = await instance.get(
    `/category-details/get-by-category/${name}`
  );
  return response.data;
};

export const deleteCategoryDetail = async (id: string) => {
  const response = await instance.delete(`/category-details/${id}`);
  return response.data;
};

export const addCategoryDetail = async (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "image") {
      data[key].forEach((image: File) => {
        formData.append("image", image);
      });
    } else {
      formData.append(key, data[key]);
    }
  });
  const response = await instance.post(
    `/category-details/${data.categoryId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateCategoryDetail = async (data: any) => {
  const response = await instance.patch(
    `/category-details/${data.categoryId}`,
    {
      name: data.name,
      description: data.description,
      image: data.image,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
