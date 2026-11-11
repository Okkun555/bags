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
import { useDeleteFamilyMember } from "@/repositories/life-plan/familyMembersRepository";
import type { FamilyMember } from "@/types/familyMember";

type Props = {
  lifePlanId: number;
  familyMember: FamilyMember;
  handleClose: () => void;
};

export const DeleteFamilyMemberDialog: FC<Props> = ({
  lifePlanId,
  familyMember,
  handleClose,
}) => {
  const { deleteFamilyMember, isMutating } = useDeleteFamilyMember(
    lifePlanId,
    familyMember.id,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setErrorMessage(null);
    try {
      await deleteFamilyMember();
      handleClose();
    } catch (e) {
      // MEMO: 収入・投資が紐づく場合はAPIが409と理由を返すので、そのまま表示する
      const message = isAxiosError<{ error?: { message?: string } }>(e)
        ? e.response?.data?.error?.message
        : undefined;
      setErrorMessage(message ?? "家族メンバーの削除に失敗しました");
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth>
      <DialogTitle>家族メンバー「{familyMember.name}」を削除しますか？</DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <DialogContentText>
          一度削除すると、データは復元できません。
          <br />
          収入・投資が紐づいているメンバーは削除できません。
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
