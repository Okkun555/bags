import type { FC } from "react";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
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

  return (
    <ConfirmDeleteDialog
      title={`収入「${incomeTypeLabels[income.incomeType]}」を削除しますか？`}
      errorText="収入の削除に失敗しました"
      isMutating={isMutating}
      onDelete={deleteIncome}
      handleClose={handleClose}
    />
  );
};
