import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export const useSignup = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = () => console.log("submit");

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
