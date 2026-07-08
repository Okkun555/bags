import { Box, Button, TextField } from "@mui/material";
import { useSignup } from "./useSignup";
import { HeaderLessLayout } from "@/components/layouts/HeaderLessLayout";
import { Link } from "react-router";

export const Signup = () => {
  const { register, watch, errors } = useSignup();

  return (
    <HeaderLessLayout pageTitle="アカウント作成">
      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="メールアドレス"
          type="email"
          margin="normal"
          {...register("email", {
            required: "メールアドレスを入力してください",
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          fullWidth
          label="パスワード"
          type="password"
          margin="normal"
          {...register("password", {
            required: "パスワードを入力してください",
            minLength: {
              value: 6,
              message: "パスワードは6文字以上で入力してください",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          fullWidth
          label="パスワード（確認）"
          type="password"
          margin="normal"
          {...register("passwordConfirmation", {
            required: "パスワード（確認）を入力してください",
            validate: (value) =>
              value === watch("password") || "パスワードが一致しません",
          })}
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          新規作成
        </Button>
        <Box sx={{ mt: 2 }}>
          アカウント作成済みの場合は<Link to="/login">こちら</Link>
        </Box>
      </Box>
    </HeaderLessLayout>
  );
};
