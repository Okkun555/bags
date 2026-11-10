import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import { deleteRequest, fetcher } from "@/libs/api/client";
import type { Investment } from "@/types/investment";

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
