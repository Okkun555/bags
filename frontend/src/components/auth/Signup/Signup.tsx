import { Box, Button, Stack, TextField } from "@mui/material";
import { useSignup } from "./useSignup";
import { HeaderLessLayout } from "@/components/layouts/HeaderLessLayout";
import { Link } from "react-router";
import { Controller } from "react-hook-form";

export const Signup = () => {
  const { control, handleSubmit, onSubmit, errors } = useSignup();

  return (
    <HeaderLessLayout pageTitle="アカウント作成">
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

          <Controller
            name="passwordConfirmation"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="パスワード(確認)"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            新規作成
          </Button>
          <Box sx={{ mt: 2 }}>
            アカウント作成済みの場合は<Link to="/login">こちら</Link>
          </Box>
        </Stack>
      </Box>
    </HeaderLessLayout>
  );
};
