import type { FC } from "react";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
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

  return (
    <ConfirmDeleteDialog
      title={`投資「${investmentTypeLabels[investment.investmentType]}」を削除しますか？`}
      errorText="投資の削除に失敗しました"
      isMutating={isMutating}
      onDelete={deleteInvestment}
      handleClose={handleClose}
    />
  );
};
