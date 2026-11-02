/**
 * 口座管理
 */

export const ACCOUNT_TYPES = [
  "cash",
  "bank",
  "securities",
  "insurance",
  "pension",
  "other",
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export type Account = {
  id: number;
  name: string;
  code: string;
  accountType: AccountType;
  memo: string;
};
