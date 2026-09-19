export const backendPaths = {
  occupation: {
    index: "/occupations",
  },
  prefecture: {
    index: "/prefectures",
  },
  householdBudget: {
    monthlyPlan: {
      create: "/monthly_plans",
    },
    budgetItem: {
      index: "/budget_items",
      create: "/budget_items",
      delete: (id: number) => `/budget_items/${id}`,
    },
  },
};
