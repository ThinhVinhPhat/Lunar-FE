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
