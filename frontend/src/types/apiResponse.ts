import type { MonthlyPlan } from "./monthlyPlan";
import type { Profile, User } from "./user";

// 認証
export type AccountCreateResponse = {
  token: string;
  user: User;
};

export type MeResponse = User & {
  profile: Profile;
};

// マスター
export type OccupationsResponse = {};

// プロフィール
export type ProfileCreateResponse = Profile;

// 月次計画
export type GetMonthlyPlansResponse = {
  data: Array<MonthlyPlan>;
  pagination: Pagination;
};

// 共通型
type Pagination = {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
};
