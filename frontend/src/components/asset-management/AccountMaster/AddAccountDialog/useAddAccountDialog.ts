import { ACCOUNT_TYPES } from "@/types/assetManagement";
import { useForm } from "react-hook-form";
import z from "zod";

export type AddAccountForm = z.infer<typeof schema>;

export const useAddAccountDialog = () => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddAccountForm>({
    defaultValues: {
      name: "",
      code: "",
      accountType: "cash",
      memo: "",
    },
  });

  return { reset, control, handleSubmit, errors };
};

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "口座名を入力してください" })
    .max(100, { message: "口座名は100文字以内で入力してください" }),
  code: z
    .string()
    .min(1, { message: "コードを入力してください" })
    .max(100, { message: "コードは100文字以内で入力してください" }),
  accountType: z.enum(ACCOUNT_TYPES, {
    message: "口座種別を選択してください",
  }),
  memo: z.string().max(400, { message: "備考は400文字以内で入力してください" }),
});
