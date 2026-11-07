import { Stack } from "@mui/material";
import { SectionFrame } from "../SectionFrame";

/** 予算計画シート(家族メンバー・収入・投資の枠のみ。中身は後続チケットで実装) */
export const BudgetPlanSheet = () => {
  return (
    <Stack spacing={3}>
      <SectionFrame title="家族メンバー" />
      <SectionFrame title="収入" />
      <SectionFrame title="投資" />
    </Stack>
  );
};
