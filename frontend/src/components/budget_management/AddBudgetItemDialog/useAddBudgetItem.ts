import { useForm } from "react-hook-form";
import z from "zod";

export type AddBudgetItemForm = z.infer<typeof schema>;

export const useAddBudgetItem = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddBudgetItemForm>({
    defaultValues: {
      name: "",
      type: "fixed",
    },
  });

  return {
    control,
    handleSubmit,
    errors,
  };
};

export const BUDGET_ITEM_TYPE = ["fixed", "variable"] as const;

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "項目名を入力してください" })
    .max(100, { message: "項目名は100文字以内で入力してください" }),
  type: z.enum(BUDGET_ITEM_TYPE, {
    message: "種別を選択してください",
  }),
});
