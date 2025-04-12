import instance from "..";

export const getProducts = async (
  category?: string[],
  offset: number = 0,
  limit: number = 20
) => {
  let query = `product?offset=${offset}&limit=${limit}`;

  if (category && category?.length > 0) {
    category.forEach((item) => {
      query += `&category=${item}`;
    });
  }
  console.log(query);

  const response = await instance.get(query);
  return response.data;
};

export const getProduct = async (slug: string | undefined) => {
  const response = await instance.get(`product/${slug}`);
  return response.data;
};

export const addProduct = async (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "images") {
      data[key].forEach((image: File) => {
        formData.append("images", image);
      });
    } else {
      formData.append(key, data[key]);
    }
  });

  const response = await instance.post("product", formData);
  return response.data;
};

export const deleteProduct = async (id: string | undefined) => {
  const response = await instance.delete(`product/${id}`);
  return response.data;
};
