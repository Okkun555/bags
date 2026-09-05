import { backendPaths } from "@/repositories/paths";
import { deleteRequest, fetcher, postRequest } from "@/libs/api/client";
import useSWR, { mutate } from "swr";
import type { BudgetItem, BudgetItems } from "@/types/budgetItem";
import useSWRMutation from "swr/mutation";
import type { AddBudgetItemForm } from "@/components/household-budget/AddBudgetItemDialog/useAddBudgetItem";

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

export const usePostBudgetItem = () => {
  const { trigger, isMutating } = useSWRMutation<
    BudgetItem,
    Error,
    string,
    AddBudgetItemForm
  >(backendPaths.householdBudget.budgetItem.create, postRequest, {
    onSuccess: async () => {
      await mutate(backendPaths.householdBudget.budgetItem.index);
    },
  });

  return {
    postBudgetItem: trigger,
    isMutating,
  };
};

export const useDeleteBudgetItem = (id: number) => {
  const { trigger, isMutating } = useSWRMutation(
    backendPaths.householdBudget.budgetItem.delete(id),
    deleteRequest,
    {
      onSuccess: () => {
        mutate(backendPaths.householdBudget.budgetItem.index);
      },
    },
  );

  return { deleteBudgetItem: trigger, isMutating };
};
