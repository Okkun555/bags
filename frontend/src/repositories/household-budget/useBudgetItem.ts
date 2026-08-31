import { backendPaths } from "@/repositories/paths";
import { fetcher } from "@/libs/api/client";
import useSWR from "swr";
import type { BudgetItems } from "@/types/budgetItem";

export const useBudgetItems = () => {
  const { data, isLoading, error } = useSWR<BudgetItems>(
    backendPaths.householdBudget.budgetItem.index,
    fetcher,
  );

  return {
    budgetItems: data,
    isLoading,
    error,
  };
};
