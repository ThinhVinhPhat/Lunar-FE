import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Star } from "lucide-react";
import Text from "../components/wrapper/Text";
import { CreateCommentInterface } from "@/lib/api/service/comment.service";

type CommentModalProps = {
  onSubmit: (data: CreateCommentInterface) => void;
  isOpen: boolean;
  onClose: () => void;
};

type Image = {
  file: File;
  preview: string;
};

const CommentModal = ({ onSubmit, isOpen, onClose }: CommentModalProps) => {
  const [previewImages, setPreviewImages] = useState<Image[]>([]);
  const [hoveredRating, setHoveredRating] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      rate: 0,
      comment: "",
      images: [],
    },
  });
  const rating = watch("rate");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file as Blob),
      })) as Image[];
      setPreviewImages((prevImages) => [...prevImages, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setPreviewImages(
      previewImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const submitForm = async (data: CreateCommentInterface) => {
    onSubmit({
      ...data,
      images: previewImages.map((image) => image.file as unknown as string),
    });
    setPreviewImages([]);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Write a Review</h2>

        <form onSubmit={handleSubmit(submitForm)}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    {...register("rate")}
                    onClick={() => {
                      setValue("rate", star);
                      setHoveredRating(star);
                    }}
                    onMouseEnter={() => setHoveredRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={28}
                      fill={
                        (hoveredRating || rating) >= star ? "#D4AF37" : "none"
                      }
                      color={
                        (hoveredRating || rating) >= star
                          ? "#D4AF37"
                          : "#CBD5E0"
                      }
                    />
                  </button>
                ))}
              </div>

              {hoveredRating > 0 && (
                <span className="text-lg font-medium text-amber-500">
                  {hoveredRating} / 5
                </span>
              )}
            </div>
            {errors.rate && (
              <p className="text-red-500 text-sm mt-1">{errors.rate.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              {...register("comment", {
                required: "Review comment is required",
              })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">
                {errors.comment.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-amber-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="image-upload"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-gray-500">Click to upload images</span>
              </label>
            </div>

            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previewImages.map((item, index) => (
                  <div
                    key={index}
                    className="relative h-24 bg-gray-100 rounded overflow-hidden"
                  >
                    <img
                      src={item.preview}
                      alt={`Preview ${index}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#C8A846] hover:bg-[#9e853c] text-white font-medium rounded-md transition-colors"
          >
            <Text id="add_comment.submit_review" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
