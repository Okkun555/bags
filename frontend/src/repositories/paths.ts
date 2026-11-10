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
      delete: (id: number) => `/monthly_plans/${id}`,
    },
    budgetItem: {
      index: "/budget_items",
      create: "/budget_items",
      delete: (id: number) => `/budget_items/${id}`,
    },
    householdBudget: {
      put: (id: number) => `monthly_plans/${id}/household_budgets`,
    },
  },
  assetManagement: {
    account: {
      index: "/asset_accounts",
      create: "/asset_accounts",
    },
  },
  lifePlan: {
    index: "/life_plans",
    show: (id: number) => `/life_plans/${id}`,
    create: "/life_plans",
    update: (id: number) => `/life_plans/${id}`,
    delete: (id: number) => `/life_plans/${id}`,
    familyMember: {
      index: (lifePlanId: number) => `/life_plans/${lifePlanId}/family_members`,
      create: (lifePlanId: number) => `/life_plans/${lifePlanId}/family_members`,
      update: (lifePlanId: number, id: number) =>
        `/life_plans/${lifePlanId}/family_members/${id}`,
      delete: (lifePlanId: number, id: number) =>
        `/life_plans/${lifePlanId}/family_members/${id}`,
    },
    income: {
      index: (lifePlanId: number) => `/life_plans/${lifePlanId}/incomes`,
      create: (lifePlanId: number) => `/life_plans/${lifePlanId}/incomes`,
      update: (lifePlanId: number, id: number) =>
        `/life_plans/${lifePlanId}/incomes/${id}`,
      delete: (lifePlanId: number, id: number) =>
        `/life_plans/${lifePlanId}/incomes/${id}`,
    },
    investment: {
      index: (lifePlanId: number) => `/life_plans/${lifePlanId}/investments`,
      create: (lifePlanId: number) => `/life_plans/${lifePlanId}/investments`,
      update: (lifePlanId: number, id: number) =>
        `/life_plans/${lifePlanId}/investments/${id}`,
      delete: (lifePlanId: number, id: number) =>
        `/life_plans/${lifePlanId}/investments/${id}`,
    },
  },
};
