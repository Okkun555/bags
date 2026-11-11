import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import {
  deleteRequest,
  fetcher,
  postRequest,
  putRequest,
} from "@/libs/api/client";
import type { Income, IncomeType } from "@/types/income";

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

/** 収入の登録・更新APIのリクエスト(amountは年額) */
export type IncomeParams = {
  income: {
    familyMemberId: number;
    incomeType: IncomeType;
    amount: number;
    startFrom: number;
    endTo: number | null;
    memo: string | null;
  };
};

/**
 * 収入の登録
 */
export const usePostIncome = (lifePlanId: number) => {
  const { trigger, isMutating } = useSWRMutation<
    Income,
    Error,
    string,
    IncomeParams
  >(backendPaths.lifePlan.income.create(lifePlanId), postRequest, {
    onSuccess: () => mutate(backendPaths.lifePlan.income.index(lifePlanId)),
  });

  return { createIncome: trigger, isMutating };
};

/**
 * 収入の更新
 */
export const usePutIncome = (lifePlanId: number, id: number) => {
  const { trigger, isMutating } = useSWRMutation<
    Income,
    Error,
    string,
    IncomeParams
  >(backendPaths.lifePlan.income.update(lifePlanId, id), putRequest, {
    onSuccess: () => mutate(backendPaths.lifePlan.income.index(lifePlanId)),
  });

  return { updateIncome: trigger, isMutating };
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
