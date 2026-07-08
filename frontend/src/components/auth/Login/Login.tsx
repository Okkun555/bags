import { HeaderLessLayout } from "@/components/layouts/HeaderLessLayout";
import { Box, TextField } from "@mui/material";
import { useLogin } from "./useLogin";

export const Login = () => {
  const { register } = useLogin();

  return (
    <HeaderLessLayout pageTitle="ログイン">
      <Box component="form" sx={{ mt: 2 }}></Box>
    </HeaderLessLayout>
  );
};
