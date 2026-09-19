import { useForm } from "react-hook-form";
import z from "zod";

export type AddMonthlyPlanForm = z.infer<typeof schema>;

export const useAddMonthlyPlan = () => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddMonthlyPlanForm>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  return {
    reset,
    control,
    handleSubmit,
    errors,
  };
};

const schema = z.object({
  title: z
    .string()
    .min(1, { message: "計画名を入力してください" })
    .max(100, { message: "計画名は100文字以内で入力してください" }),
  description: z
    .string()
    .max(100, { message: "説明文は500文字以内で入力してください" })
    .nullable(),
});
