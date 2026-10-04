import useSWR, { mutate } from "swr";
import { backendPaths } from "../paths";
import { deleteRequest, fetcher, postRequest } from "@/libs/api/client";
import type { BudgetItem, BudgetItems } from "@/types/budgetManagement";
import useSWRMutation from "swr/mutation";
import type { AddBudgetItemForm } from "@/components/budget-management/BudgetItemSetting/AddBudgetItemDialog/useAddBudgetItem";

/**
 * 予算項目の一覧取得
 */
export const useFetchBudgetItems = () => {
  const { data, isLoading } = useSWR<BudgetItems>(
    backendPaths.budgetManagement.budgetItem.index,
    fetcher,
  );

  return { budgetItems: data, isLoading };
};

/**
 * 予算項目の追加
 */
export const usePostBudgetItem = () => {
  const { trigger, isMutating } = useSWRMutation<
    BudgetItem,
    Error,
    string,
    AddBudgetItemForm
  >(backendPaths.budgetManagement.budgetItem.create, postRequest, {
    onSuccess: () => mutate(backendPaths.budgetManagement.budgetItem.index),
  });

  return { createBudgetItem: trigger, isMutating };
};

/**
 * 予算項目の削除
 */
export const useDeleteBudgetItem = (id: number) => {
  const { trigger, isMutating } = useSWRMutation(
    backendPaths.budgetManagement.budgetItem.delete(id),
    deleteRequest,
    {
      onSuccess: () => mutate(backendPaths.budgetManagement.budgetItem.index),
    },
  );

  return { deleteBudgetItem: trigger, isMutating };
};
