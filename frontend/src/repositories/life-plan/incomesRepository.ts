import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import {
  deleteRequest,
  fetcher,
  postRequest,
  putRequest,
} from "@/libs/api/client";
import type { AmountType, Income, IncomeType } from "@/types/income";

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

/** 収入1件分のリクエスト。amountTypeがmonthlyの場合はAPI側で×12して保存する */
export type IncomeParams = {
  familyMemberId: number;
  incomeType: IncomeType;
  amount: number;
  amountType: AmountType;
  startFrom: number;
  endTo: number | null;
  memo: string | null;
};

/** 収入の一括作成APIのリクエスト */
export type CreateIncomesParams = {
  incomes: Array<IncomeParams>;
};

/** 収入の更新APIのリクエスト */
export type UpdateIncomeParams = {
  income: IncomeParams;
};

/**
 * 収入の登録(複数件を一度に登録できる)
 */
export const usePostIncomes = (lifePlanId: number) => {
  const { trigger, isMutating } = useSWRMutation<
    Array<Income>,
    Error,
    string,
    CreateIncomesParams
  >(backendPaths.lifePlan.income.create(lifePlanId), postRequest, {
    onSuccess: () => mutate(backendPaths.lifePlan.income.index(lifePlanId)),
  });

  return { createIncomes: trigger, isMutating };
};

/**
 * 収入の更新
 */
export const usePutIncome = (lifePlanId: number, id: number) => {
  const { trigger, isMutating } = useSWRMutation<
    Income,
    Error,
    string,
    UpdateIncomeParams
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
