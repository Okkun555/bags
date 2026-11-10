import { isAxiosError } from "axios";
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
import { useDeleteIncome } from "@/repositories/life-plan/incomesRepository";
import { incomeTypeLabels, type Income } from "@/types/income";

type Props = {
  lifePlanId: number;
  income: Income;
  handleClose: () => void;
};

export const DeleteIncomeDialog: FC<Props> = ({
  lifePlanId,
  income,
  handleClose,
}) => {
  const { deleteIncome, isMutating } = useDeleteIncome(lifePlanId, income.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setErrorMessage(null);
    try {
      await deleteIncome();
      handleClose();
    } catch (e) {
      const message = isAxiosError<{ error?: { message?: string } }>(e)
        ? e.response?.data?.error?.message
        : undefined;
      setErrorMessage(message ?? "収入の削除に失敗しました");
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth>
      <DialogTitle>
        収入「{incomeTypeLabels[income.incomeType]}（
        {income.amount.toLocaleString()}円/年）」を削除しますか？
      </DialogTitle>
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
