import { Stack } from "@mui/material";
import type { FC } from "react";
import type { LifePlan } from "@/types/lifePlan";
import { SectionFrame } from "../SectionFrame";
import { FamilyMemberSection } from "./FamilyMemberSection";
import { IncomeSection } from "./IncomeSection";

type Props = {
  lifePlan: LifePlan;
};

/** 予算計画シート(家族メンバー・収入・投資。投資の中身は後続チケットで実装) */
export const BudgetPlanSheet: FC<Props> = ({ lifePlan }) => {
  return (
    <Stack spacing={3}>
      <FamilyMemberSection lifePlanId={lifePlan.id} />
      <IncomeSection lifePlan={lifePlan} />
      <SectionFrame title="投資" />
    </Stack>
  );
};
