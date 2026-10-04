export const paths = {
  auth: {
    signup: "/signup",
    login: "/login",
  },
  dashboard: "/dashboard",
  profile: {
    new: "/profile/new",
  },
  budgetManagement: {
    monthlyPlans: "/budget-management/monthly-plans",
    monthlyPlanDetail: (id: number) => `/budget-management/monthly-plans/${id}`,
    monthlyPlanDetailPattern: "/budget-management/monthly-plans/:id",
    budgetItem: "/budget-management/items",
  },
} as const;
