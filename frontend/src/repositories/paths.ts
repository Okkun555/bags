export const backendPaths = {
  occupation: {
    index: "/occupations",
  },
  prefecture: {
    index: "/prefectures",
  },
  budgetManagement: {
    monthlyPlan: {
      index: "/monthly_plans",
      show: (id: number) => `/monthly_plans/${id}`,
      create: "/monthly_plans",
    },
    budgetItem: {
      index: "/budget_items",
      create: "/budget_items",
      delete: (id: number) => `/budget_items/${id}`,
    },
  },
};
