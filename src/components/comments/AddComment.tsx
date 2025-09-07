import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Box, Typography, Rating } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import Text from "../../shared/components/wrapper/Text";


type CommentModalProps = {
  onSubmit: (data: CommentForm) => void;
  isOpen: boolean;
  onClose: () => void;
};

type CommentForm = {
  rate: number;
  content: string;
  images: File[];
};

type Image = {
  file: File;
  preview: string;
};

const CommentModal = ({ onSubmit, isOpen, onClose }: CommentModalProps) => {
  const [previewImages, setPreviewImages] = useState<Image[]>([]);
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
      content: "",
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

  const submitForm = async (data: CommentForm) => {
    onSubmit({
      ...data,
      images: previewImages.map((image) => image.file),
    });
    setPreviewImages([]);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Write a Review
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(submitForm)}>
          <Box mb={3}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(_, newValue) => {
                setValue("rate", newValue || 0);
              }}
              precision={1}
              size="large"
            />
            {errors.rate && (
              <Typography color="error" variant="body2">
                {errors.rate.message}
              </Typography>
            )}
          </Box>

          <Box mb={3}>
            <TextField
              {...register("content", {
                required: "Review comment is required",
              })}
              label="Your Review"
              multiline
              rows={5}
              fullWidth
              variant="outlined"
              error={!!errors.content}
              helperText={errors.content?.message}
            />
          </Box>

          <Box mb={3}>
            <Typography component="legend" sx={{ mb: 1 }}>
              Upload Images (Optional)
            </Typography>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadFileIcon />}
                fullWidth
              >
                Click to upload images
              </Button>
            </label>

            {previewImages.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {previewImages.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >
                    <img
                      src={item.preview}
                      alt={`Preview ${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(255,255,255,0.7)",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit(submitForm)}
          variant="contained"
          sx={{
            backgroundColor: "#C8A846",
            "&:hover": { backgroundColor: "#9e853c" },
          }}
          fullWidth
        >
          <Text id="add_comment.submit_review" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentModal;


