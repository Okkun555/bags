export const incomeTypeLabels = {
  salary: "給与",
  dividend: "配当金",
  sideJob: "副業",
  bonus: "賞与",
  windfall: "臨時収入",
} as const;

export type IncomeType = keyof typeof incomeTypeLabels;

export type Income = {
  id: number;
  familyMemberId: number;
  incomeType: IncomeType;
  /** 年額 */
  amount: number;
  startFrom: number;
  endTo: number | null;
  memo: string | null;
};
