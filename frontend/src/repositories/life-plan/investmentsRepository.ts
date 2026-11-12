import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import {
  deleteRequest,
  fetcher,
  postRequest,
  putRequest,
} from "@/libs/api/client";
import type { Investment, InvestmentType } from "@/types/investment";

/**
 * 投資の一覧取得
 */
export const useFetchInvestments = (lifePlanId: number) => {
  const { data, isLoading } = useSWR<Array<Investment>>(
    backendPaths.lifePlan.investment.index(lifePlanId),
    fetcher,
  );

  return { investments: data, isLoading };
};

/** 投資の登録・更新APIのリクエスト(amountは年額) */
export type InvestmentParams = {
  investment: {
    familyMemberId: number;
    investmentType: InvestmentType;
    amount: number;
    startFrom: number;
    endTo: number | null;
    memo: string | null;
  };
};

/**
 * 投資の登録
 */
export const usePostInvestment = (lifePlanId: number) => {
  const { trigger, isMutating } = useSWRMutation<
    Investment,
    Error,
    string,
    InvestmentParams
  >(backendPaths.lifePlan.investment.create(lifePlanId), postRequest, {
    onSuccess: () => mutate(backendPaths.lifePlan.investment.index(lifePlanId)),
  });

  return { createInvestment: trigger, isMutating };
};

/**
 * 投資の更新
 */
export const usePutInvestment = (lifePlanId: number, id: number) => {
  const { trigger, isMutating } = useSWRMutation<
    Investment,
    Error,
    string,
    InvestmentParams
  >(backendPaths.lifePlan.investment.update(lifePlanId, id), putRequest, {
    onSuccess: () => mutate(backendPaths.lifePlan.investment.index(lifePlanId)),
  });

  return { updateInvestment: trigger, isMutating };
};

/**
 * 投資の削除
 */
export const useDeleteInvestment = (lifePlanId: number, id: number) => {
  const { trigger, isMutating } = useSWRMutation<Investment, Error, string>(
    backendPaths.lifePlan.investment.delete(lifePlanId, id),
    deleteRequest,
    {
      onSuccess: () => mutate(backendPaths.lifePlan.investment.index(lifePlanId)),
    },
  );

  return { deleteInvestment: trigger, isMutating };
};
