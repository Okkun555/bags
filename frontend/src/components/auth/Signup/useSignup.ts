import { usePostAccount } from "@/repositories/auth/useSignupApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export type SignupForm = z.infer<typeof schema>;

export const useSignup = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { postCreateAccount } = usePostAccount();
  const onSubmit = (data: SignupForm) => {
    postCreateAccount(data);
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
};

const schema = z
  .object({
    email: z.email({ message: "正しいメールアドレスの形式で入力してください" }),
    password: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください" }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "パスワードが一致しません",
    path: ["passwordConfirmation"],
  });
