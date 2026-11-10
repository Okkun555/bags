import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import {
  deleteRequest,
  fetcher,
  postRequest,
  putRequest,
} from "@/libs/api/client";
import type { AmountType } from "@/types/amountType";
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

/** 投資1件分のリクエスト。amountTypeがmonthlyの場合はAPI側で×12して保存する */
export type InvestmentParams = {
  familyMemberId: number;
  investmentType: InvestmentType;
  amount: number;
  amountType: AmountType;
  startFrom: number;
  endTo: number | null;
  memo: string | null;
};

/** 投資の一括作成APIのリクエスト */
export type CreateInvestmentsParams = {
  investments: Array<InvestmentParams>;
};

/** 投資の更新APIのリクエスト */
export type UpdateInvestmentParams = {
  investment: InvestmentParams;
};

/**
 * 投資の登録(複数件を一度に登録できる)
 */
export const usePostInvestments = (lifePlanId: number) => {
  const { trigger, isMutating } = useSWRMutation<
    Array<Investment>,
    Error,
    string,
    CreateInvestmentsParams
  >(backendPaths.lifePlan.investment.create(lifePlanId), postRequest, {
    onSuccess: () => mutate(backendPaths.lifePlan.investment.index(lifePlanId)),
  });

  return { createInvestments: trigger, isMutating };
};

/**
 * 投資の更新
 */
export const usePutInvestment = (lifePlanId: number, id: number) => {
  const { trigger, isMutating } = useSWRMutation<
    Investment,
    Error,
    string,
    UpdateInvestmentParams
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
      onSuccess: () =>
        mutate(backendPaths.lifePlan.investment.index(lifePlanId)),
    },
  );

  return { deleteInvestment: trigger, isMutating };
};
