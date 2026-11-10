/** 入力額の区分。月額の場合はAPI側で×12して年額で保存される */
export const amountTypes = ["monthly", "annual"] as const;

export type AmountType = (typeof amountTypes)[number];

export const amountTypeLabels: Record<AmountType, string> = {
  monthly: "月額",
  annual: "年額",
};
