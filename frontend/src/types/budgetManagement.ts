type HouseholdBudget = {
  id: number;
  relationship: Relationship;
  income: number;
};

type Relationship = "me" | "spouse" | "father" | "mother" | "child" | "other";

export type MonthlyPlan = {
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MonthlyPlanDetail = MonthlyPlan & {
  householdBudgets: Array<HouseholdBudget>;
};
