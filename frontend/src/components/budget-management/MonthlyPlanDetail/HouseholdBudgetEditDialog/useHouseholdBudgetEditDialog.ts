import {
  RELATIONSHIP_OPTIONS,
  type HouseholdBudget,
} from "@/types/budgetManagement";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

export type HouseholdBudgetFormValues = z.infer<
  typeof householdBudgetFormSchema
>;

export const useHouseholdBudgetEditDialog = (
  householdBudgets: HouseholdBudget[],
  isOpen: boolean,
) => {
  const buildDefaultValues = (
    householdBudgets: HouseholdBudget[],
  ): HouseholdBudgetFormValues => ({
    householdBudgets:
      householdBudgets.length > 0
        ? householdBudgets
        : [{ id: null, relationship: "me", income: 0 }],
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HouseholdBudgetFormValues>({
    defaultValues: buildDefaultValues(householdBudgets),
    resolver: zodResolver(householdBudgetFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "householdBudgets",
  });

  // ダイアログを開くたびに最新の値でフォームをリセットする
  useEffect(() => {
    if (isOpen) {
      reset(buildDefaultValues(householdBudgets));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addRow = () => append({ id: null, relationship: "me", income: 0 });

  return {
    control,
    register,
    handleSubmit,
    fields,
    errors,
    addRow,
    removeRow: remove,
  };
};

const householdBudgetRowSchema = z.object({
  id: z.number().nullable(),
  relationship: z.enum(RELATIONSHIP_OPTIONS),
  income: z
    .number({ error: "数値を入力してください" })
    .int("整数で入力してください")
    .min(0, "収入はマイナスの値を入力できません"),
});

export const householdBudgetFormSchema = z.object({
  householdBudgets: z
    .array(householdBudgetRowSchema)
    .min(1, "収入者を1人以上登録してください"),
});
