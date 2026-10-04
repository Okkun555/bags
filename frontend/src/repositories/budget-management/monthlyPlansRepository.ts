import useSWR from "swr";
import { backendPaths } from "../paths";
import { fetcher, postRequest } from "@/libs/api/client";
import type { GetListWithPagination } from "@/types/apiResponse";
import type { MonthlyPlanDetail, MonthlyPlan } from "@/types/budgetManagement";
import useSWRMutation from "swr/mutation";
import type { AddMonthlyPlanForm } from "@/components/budget-management/MonthlyPlanList/AddMonthlyPlanDialog";

/**
 * 月次予算計画の一覧取得API
 */
export const useFetchMonthlyPlans = () => {
  const { data, isLoading } = useSWR<GetListWithPagination<MonthlyPlan>>(
    backendPaths.budgetManagement.monthlyPlan.index,
    fetcher,
  );

  return { monthlyPlans: data?.data, isLoading };
};

/**
 * 月次予算計画の詳細取得API
 */
export const useFetchMonthPlanDetail = (id: number) => {
  const { data, isLoading } = useSWR<MonthlyPlanDetail>(
    backendPaths.budgetManagement.monthlyPlan.show(id),
    fetcher,
  );

  return { monthlyPlanDetail: data, isLoading };
};

/**
 * 月次予算計画の新規作成API
 */
export const usePostMonthlyPlan = () => {
  const { trigger, isMutating } = useSWRMutation<
    MonthlyPlan,
    Error,
    string,
    AddMonthlyPlanForm
  >(backendPaths.budgetManagement.monthlyPlan.create, postRequest);

  return { postMonthlyPlan: trigger, isMutating };
};
