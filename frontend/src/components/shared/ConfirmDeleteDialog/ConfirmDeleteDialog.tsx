import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState, type FC } from "react";

type Props = {
  title: string;
  /** 削除失敗時に表示するメッセージ */
  errorText: string;
  isMutating: boolean;
  onDelete: () => Promise<unknown>;
  handleClose: () => void;
};

/** 削除確認ダイアログ */
export const ConfirmDeleteDialog: FC<Props> = ({
  title,
  errorText,
  isMutating,
  onDelete,
  handleClose,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setErrorMessage(null);
    try {
      await onDelete();
      handleClose();
    } catch {
      setErrorMessage(errorText);
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <DialogContentText>一度削除すると、データは復元できません。</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="inherit" onClick={handleClose}>
          キャンセル
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={isMutating}
          onClick={handleDelete}
        >
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
};
