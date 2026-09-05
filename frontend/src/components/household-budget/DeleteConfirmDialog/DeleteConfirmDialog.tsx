import { useDeleteBudgetItem } from "@/repositories/household-budget/useBudgetItem";
import type { BudgetItem } from "@/types/budgetItem";
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
  target: BudgetItem | null;
  isOpen: boolean;
  handleClose: () => void;
};

export const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({
  target,
  isOpen,
  handleClose,
}) => {
  if (!target) {
    return undefined;
  }

  const { deleteBudgetItem } = useDeleteBudgetItem(target.id);
  const handleDelete = async () => {
    await deleteBudgetItem();
    handleClose();
  };

  return (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle>
        カスタム予算項目「{target.name}」を削除しますか？
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          一度削除すると、データは復元できません。
          <br />
          登録済みの予算データは、項目なしとして表示されます。
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
