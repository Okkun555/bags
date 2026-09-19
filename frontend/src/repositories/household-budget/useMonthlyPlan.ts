import type { AddMonthlyPlanForm } from "@/components/household-budget/MonthlyPlanList/AddMonthlyPlanDialog/useAddMonthlyPlan";
import type { MonthlyPlan } from "@/types/monthlyPlan";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import { postRequest } from "@/libs/api/client";

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
