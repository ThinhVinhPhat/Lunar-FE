import instance from "../index";

export const getCommentByProduct = async (id: string, data: any) => {
  const response = await instance.get(`comment/get-by-product/${id}`, {
    params: data,
  });
  return response.data;
};

export const createComment = async (productId: string, data: any) => {
  const formData = new FormData();

  const { content, rate, images } = data.data;

  formData.append("comment", content);
  formData.append("rate", rate.toString());

  images?.forEach((image: File) => {
    formData.append("images", image);
  });

  formData.forEach((value, key) => {
    console.log(key, value);
  });

  const response = await instance.post(`comment/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getUserComment = async (data: any) => {
  const response = await instance.get(`comment/get-by-user`, {
    params: data,
  });
  return response.data;
};

export const deleteComment = async (id: string) => {
  const response = await instance.delete(`comment/${id}`);
  return response.data;
};
