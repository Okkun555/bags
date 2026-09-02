import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { FC } from "react";

type DeleteConfirmDialogProps = {
  isOpen: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  targetName: string;
};

export const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({
  isOpen,
  handleClose,
  handleDelete,
  targetName,
}) => {
  return (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle>{targetName}を削除しますか？</DialogTitle>
      <DialogContent>
        <DialogContentText>
          一度削除すると、データは復元できません。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="inherit" onClick={handleClose}>
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
};
