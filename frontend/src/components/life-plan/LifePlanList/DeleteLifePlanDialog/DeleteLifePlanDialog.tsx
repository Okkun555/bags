import { useDeleteLifePlan } from "@/repositories/life-plan/lifePlansRepository";
import type { LifePlan } from "@/types/lifePlan";
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
  lifePlan: LifePlan;
  handleClose: () => void;
};

export const DeleteLifePlanDialog: FC<Props> = ({ lifePlan, handleClose }) => {
  const { deleteLifePlan, isMutating } = useDeleteLifePlan(lifePlan.id);
  const [hasError, setHasError] = useState(false);

  const handleDelete = async () => {
    setHasError(false);
    try {
      await deleteLifePlan();
      handleClose();
    } catch {
      setHasError(true);
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth>
      <DialogTitle>ライフプラン「{lifePlan.name}」を削除しますか？</DialogTitle>
      <DialogContent>
        {hasError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            ライフプランの削除に失敗しました
          </Alert>
        )}
        <DialogContentText>
          一度削除すると、データは復元できません。
          <br />
          登録済みの家族メンバー・収入・投資もすべて削除されます。
        </DialogContentText>
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
