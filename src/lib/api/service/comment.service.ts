import { API_URL } from "@/lib/config/api.config";
import instance from "../index";
import { CommentSort } from "@/types/review";

export interface CreateCommentInterface {
  comment: string;
  rate: number;
  images: string[];
}

export interface GetCommentByProductInterface {
  page: number;
  limit: number;
  sort: CommentSort;
}

export interface GetUserCommentInterface {
  page: number;
  limit: number;
  sort: CommentSort;
}

export const getCommentByProduct = async (
  id: string,
  data: GetCommentByProductInterface
) => {
  const response = await instance.get(API_URL.COMMENTS.GET_BY_PRODUCT(id), {
    params: data,
  });
  return response.data;
};

export const createComment = async (
  productId: string,
  data: CreateCommentInterface
) => {
  const formData = new FormData();

  const { comment, rate, images } = data;

  formData.append("comment", comment);
  formData.append("rate", rate.toString());

  images?.forEach((image: string) => {
    formData.append("images", image as unknown as File);
  });

  const response = await instance.post(
    API_URL.COMMENTS.CREATE(productId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getUserComment = async (data: GetUserCommentInterface) => {
  const response = await instance.get(API_URL.COMMENTS.GET_BY_USER, {
    params: data,
  });
  return response.data;
};

export const deleteComment = async (id: string) => {
  const response = await instance.delete(API_URL.COMMENTS.DELETE(id));
  return response.data;
};
