/** 収入種別(APIの値) */
export const incomeTypes = [
  "salary",
  "dividend",
  "side_job",
  "bonus",
  "windfall",
] as const;

export type IncomeType = (typeof incomeTypes)[number];

export const incomeTypeLabels: Record<IncomeType, string> = {
  salary: "給与",
  dividend: "配当金",
  side_job: "副業",
  bonus: "賞与",
  windfall: "臨時収入",
};

export type Income = {
  id: number;
  familyMemberId: number;
  incomeType: IncomeType;
  /** 年額 */
  amount: number;
  startFrom: number;
  /** nullは最後まで */
  endTo: number | null;
  memo: string | null;
};
