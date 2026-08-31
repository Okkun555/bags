export type BudgetItems = Array<BudgetItem & { operable: boolean }>;

export type BudgetItem = {
  id: number;
  name: string;
  type: "fixed" | "variable";
};
