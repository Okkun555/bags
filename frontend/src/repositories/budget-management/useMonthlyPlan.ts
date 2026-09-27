import type { AddMonthlyPlanForm } from "@/components/budget_management/MonthlyPlanList/AddMonthlyPlanDialog/useAddMonthlyPlan";
import type { MonthlyPlan } from "@/types/monthlyPlan";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import { fetcher, postRequest } from "@/libs/api/client";
import useSWR from "swr";
import type { GetMonthlyPlansResponse } from "@/types/apiResponse";
import type { MonthlyPlanDetail } from "@/types/budgetManagement";

export const useGetMonthlyPlans = () => {
  const { data, isLoading } = useSWR<GetMonthlyPlansResponse>(
    backendPaths.budgetManagement.monthlyPlan.index,
    fetcher,
  );

  return {
    monthlyPlans: data?.data,
    isLoading,
  };
};

export const useGetMonthlyPlan = (id: number) => {
  const { data, isLoading } = useSWR<MonthlyPlanDetail>(
    backendPaths.budgetManagement.monthlyPlan.show(id),
    fetcher,
  );

  return {
    monthlyPlan: data,
    isLoading,
  };
};

export const usePostMonthlyPlan = () => {
  const { trigger, isMutating } = useSWRMutation<
    MonthlyPlan,
    Error,
    string,
    AddMonthlyPlanForm
  >(backendPaths.budgetManagement.monthlyPlan.create, postRequest, {
    onSuccess: async () => {},
  });

  return {
    postMonthlyPlan: trigger,
    isMutating,
  };
};
