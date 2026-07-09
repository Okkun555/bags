import { HeaderLessLayout } from "@/components/layouts/HeaderLessLayout";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useLogin } from "./useLogin";
import { Controller } from "react-hook-form";
import { Link } from "react-router";

export const Login = () => {
  const { control, handleSubmit, onSubmit, errors } = useLogin();

  return (
    <HeaderLessLayout pageTitle="ログイン">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <Stack spacing={3}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="メールアドレス"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="パスワード"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            ログイン
          </Button>
          <Box sx={{ mt: 2 }}>
            アカウント未作成の場合は<Link to="/signup">こちら</Link>
          </Box>
        </Stack>
      </Box>
    </HeaderLessLayout>
  );
};
