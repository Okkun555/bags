import type { BudgetItems } from "./budgetManagement";
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

/**
 * 予算管理（BudgetManagement）
 */
export type GetMonthlyPlansResponse = {
  data: Array<MonthlyPlan>;
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
  };
};

/**
 * ページネーション付きAPIの共通型
 */
export type GetListWithPagination<T> = {
  data: Array<T>;
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
  };
};
