export const investmentTypeLabels = {
  stock: "株式",
  insurance: "保険",
} as const;

export type InvestmentType = keyof typeof investmentTypeLabels;

export type Investment = {
  id: number;
  familyMemberId: number;
  investmentType: InvestmentType;
  /** 年額 */
  amount: number;
  startFrom: number;
  endTo: number | null;
  memo: string | null;
};
