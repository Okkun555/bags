import { Stack } from "@mui/material";
import type { FC } from "react";
import { SectionFrame } from "../SectionFrame";
import { FamilyMemberSection } from "./FamilyMemberSection";

type Props = {
  lifePlanId: number;
};

/** 予算計画シート(家族メンバー・収入・投資。収入・投資の中身は後続チケットで実装) */
export const BudgetPlanSheet: FC<Props> = ({ lifePlanId }) => {
  return (
    <Stack spacing={3}>
      <FamilyMemberSection lifePlanId={lifePlanId} />
      <SectionFrame title="収入" />
      <SectionFrame title="投資" />
    </Stack>
  );
};
