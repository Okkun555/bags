/** 投資種別(APIの値) */
export const investmentTypes = ["stock", "insurance"] as const;

export type InvestmentType = (typeof investmentTypes)[number];

export const investmentTypeLabels: Record<InvestmentType, string> = {
  stock: "株式",
  insurance: "保険",
};

export type Investment = {
  id: number;
  familyMemberId: number;
  investmentType: InvestmentType;
  /** 年額 */
  amount: number;
  startFrom: number;
  /** nullは最後まで */
  endTo: number | null;
  memo: string | null;
};
