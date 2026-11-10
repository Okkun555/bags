import type { FC } from "react";
import { MemberCardList } from "./MemberCardList";

type Props = {
  lifePlanId: number;
};

/** 予算計画シート(家族メンバーごとのカードに収入・投資をまとめて表示) */
export const BudgetPlanSheet: FC<Props> = ({ lifePlanId }) => {
  return <MemberCardList lifePlanId={lifePlanId} />;
};
