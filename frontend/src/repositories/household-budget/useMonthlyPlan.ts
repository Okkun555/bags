import type { AddMonthlyPlanForm } from "@/components/household-budget/MonthlyPlanList/AddMonthlyPlanDialog/useAddMonthlyPlan";
import type { MonthlyPlan } from "@/types/monthlyPlan";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import { fetcher, postRequest } from "@/libs/api/client";
import useSWR from "swr";
import type { GetMonthlyPlansResponse } from "@/types/apiResponse";

export const useGetMonthlyPlans = () => {
  const { data, isLoading } = useSWR<GetMonthlyPlansResponse>(
    backendPaths.householdBudget.monthlyPlan.index,
    fetcher,
  );

  return {
    monthlyPlans: data?.data,
    isLoading,
  };
};

export const usePostMonthlyPlan = () => {
  const { trigger, isMutating } = useSWRMutation<
    MonthlyPlan,
    Error,
    string,
    AddMonthlyPlanForm
  >(backendPaths.householdBudget.monthlyPlan.create, postRequest, {
    onSuccess: async () => {},
  });

  return {
    postMonthlyPlan: trigger,
    isMutating,
  };
};
