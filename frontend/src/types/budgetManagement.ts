export type HouseholdBudget = {
  id: number;
  relationship: Relationship;
  income: number;
};

export const RELATIONSHIP_OPTIONS = [
  "me",
  "spouse",
  "father",
  "mother",
  "child",
  "other",
] as const;

type Relationship = (typeof RELATIONSHIP_OPTIONS)[number];

export const RELATIONSHIP_LABEL: Record<Relationship, string> = {
  me: "本人",
  spouse: "配偶者",
  father: "父",
  mother: "母",
  child: "子",
  other: "その他",
};

export type MonthlyPlan = {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MonthlyPlanShow = MonthlyPlan & {
  householdBudgets: Array<HouseholdBudget>;
  monthlyPlanDetails: Array<MonthlyPlanDetail>;
};

type MonthlyPlanDetail = {
  id: number;
  budgetItem: BudgetItem & { operable: boolean };
  amount: number;
};

export type BudgetItems = Array<BudgetItem & { operable: boolean }>;

export type BudgetItem = {
  id: number;
  name: string;
  type: "fixed" | "variable";
};
