// TODO: keyのバッティング問題を解決する
export const paths = {
  login: "/login",
  dashboard: "/dashboard",
  profile: {
    new: "/profile/new",
  },
  // houseHoldBudget: "/household-budget",
  budgetManagement: {
    monthlyPlans: "/budget-management/monthly-plans",
    monthlyPlanDetail: (id: number) => `/budget-management/monthly-plans/${id}`,
    budgetItem: "/budget-management/items",
  },
} as const;
