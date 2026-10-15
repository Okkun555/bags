import type { HouseholdBudgetFormValues } from "@/components/budget-management/MonthlyPlanShow/HouseholdBudgetEditDialog/useHouseholdBudgetEditDialog";
import type { MonthlyPlan } from "@/types/budgetManagement";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import { putRequest } from "@/libs/api/client";
import { mutate } from "swr";

/**
 * 世帯収入更新API
 */
export const usePutHouseholdBudgets = (monthlyPlanId: MonthlyPlan["id"]) => {
  const { trigger, isMutating } = useSWRMutation<
    null,
    Error,
    string,
    HouseholdBudgetFormValues
  >(
    backendPaths.budgetManagement.householdBudget.put(monthlyPlanId),
    putRequest,
    {
      onSuccess: () =>
        mutate(backendPaths.budgetManagement.monthlyPlan.show(monthlyPlanId)),
    },
  );

  return { putHouseholdBudget: trigger, isMutating };
};
