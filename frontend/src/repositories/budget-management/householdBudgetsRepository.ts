import type { HouseholdBudgetFormValues } from "@/components/budget-management/MonthlyPlanDetail/HouseholdBudgetEditDialog/useHouseholdBudgetEditDialog";
import type { MonthlyPlan } from "@/types/budgetManagement";
import useSWRMutation from "swr/mutation";
import { backendPaths } from "../paths";
import { putRequest } from "@/libs/api/client";

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
  );

  return { putHouseholdBudget: trigger, isMutating };
};
