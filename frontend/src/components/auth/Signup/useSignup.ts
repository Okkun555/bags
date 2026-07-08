import { useForm } from "react-hook-form";

export type SignupForm = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export const useSignup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  return {
    register,
    handleSubmit,
    watch,
    errors,
  };
};
