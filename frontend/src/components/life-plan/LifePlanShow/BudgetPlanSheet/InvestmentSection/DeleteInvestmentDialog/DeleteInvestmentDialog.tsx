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
import { useDeleteInvestment } from "@/repositories/life-plan/investmentsRepository";
import { investmentTypeLabels, type Investment } from "@/types/investment";

type Props = {
  lifePlanId: number;
  investment: Investment;
  handleClose: () => void;
};

export const DeleteInvestmentDialog: FC<Props> = ({
  lifePlanId,
  investment,
  handleClose,
}) => {
  const { deleteInvestment, isMutating } = useDeleteInvestment(lifePlanId, investment.id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setErrorMessage(null);
    try {
      await deleteInvestment();
      handleClose();
    } catch (e) {
      const message = isAxiosError<{ error?: { message?: string } }>(e)
        ? e.response?.data?.error?.message
        : undefined;
      setErrorMessage(message ?? "投資の削除に失敗しました");
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth>
      <DialogTitle>
        投資「{investmentTypeLabels[investment.investmentType]}（
        {investment.amount.toLocaleString()}円/年）」を削除しますか？
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
