import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { usePostLogin } from "@/repositories/auth/useSignupApi";

export type LoginForm = z.infer<typeof schema>;

export const useLogin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { postLogin } = usePostLogin();
  const onSubmit = (data: LoginForm) => {
    postLogin(data);
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
};

const schema = z.object({
  email: z.email({ message: "正しいメールアドレスの形式で入力してください" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください" }),
});
