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

/** 入力額の区分。月額の場合はAPI側で×12して年額で保存される */
export const amountTypes = ["monthly", "annual"] as const;

export type AmountType = (typeof amountTypes)[number];

export const amountTypeLabels: Record<AmountType, string> = {
  monthly: "月額",
  annual: "年額",
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
