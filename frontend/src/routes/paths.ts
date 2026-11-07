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
    monthlyPlanShow: (id: number) => `/budget-management/monthly-plans/${id}`,
    monthlyPlanShowPattern: "/budget-management/monthly-plans/:id",
    budgetItem: "/budget-management/items",
  },
  assetManagement: {
    dashboard: "/asset-management/dashboard",
    accountMaster: "/asset-management/accounts",
    dataImport: "/asset-management/import",
  },
  lifePlans: {
    index: "/life-plans",
    show: (id: number) => `/life-plans/${id}`,
    showPattern: "/life-plans/:id",
  },
} as const;
