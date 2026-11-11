import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import { deleteRequest, fetcher } from "@/libs/api/client";
import type { Income } from "@/types/income";

/**
 * 収入の一覧取得
 */
export const useFetchIncomes = (lifePlanId: number) => {
  const { data, isLoading } = useSWR<Array<Income>>(
    backendPaths.lifePlan.income.index(lifePlanId),
    fetcher,
  );

  return { incomes: data, isLoading };
};

/**
 * 収入の削除
 */
export const useDeleteIncome = (lifePlanId: number, id: number) => {
  const { trigger, isMutating } = useSWRMutation<Income, Error, string>(
    backendPaths.lifePlan.income.delete(lifePlanId, id),
    deleteRequest,
    {
      onSuccess: () => mutate(backendPaths.lifePlan.income.index(lifePlanId)),
    },
  );

  return { deleteIncome: trigger, isMutating };
};
