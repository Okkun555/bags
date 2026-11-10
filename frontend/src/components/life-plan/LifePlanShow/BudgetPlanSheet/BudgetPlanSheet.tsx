import { Stack } from "@mui/material";
import type { FC } from "react";
import type { LifePlan } from "@/types/lifePlan";
import { FamilyMemberSection } from "./FamilyMemberSection";
import { IncomeSection } from "./IncomeSection";
import { InvestmentSection } from "./InvestmentSection";

type Props = {
  lifePlan: LifePlan;
};

/** 予算計画シート(家族メンバー・収入・投資) */
export const BudgetPlanSheet: FC<Props> = ({ lifePlan }) => {
  return (
    <Stack spacing={3}>
      <FamilyMemberSection lifePlanId={lifePlan.id} />
      <IncomeSection lifePlan={lifePlan} />
      <InvestmentSection lifePlan={lifePlan} />
    </Stack>
  );
};
