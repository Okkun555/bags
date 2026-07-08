import { useForm } from "react-hook-form";

type LoginForm = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return {
    register,
    handleSubmit,
  };
};
