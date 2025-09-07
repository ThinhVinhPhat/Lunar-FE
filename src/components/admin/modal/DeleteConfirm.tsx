import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type DeleteConfirmModalsProps = {
  showDeleteModal: boolean;
  setShowDeleteModal: (showDeleteModal: boolean) => void;
  onDelete: () => void;
};

export const DeleteConfirmModal = ({
  showDeleteModal,
  setShowDeleteModal,
  onDelete,
}: DeleteConfirmModalsProps) => {
  return (
    <Dialog
      open={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <DeleteOutlineIcon sx={{ color: "red", mr: 1 }} />
        {"Delete Product"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowDeleteModal(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={onDelete} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};


