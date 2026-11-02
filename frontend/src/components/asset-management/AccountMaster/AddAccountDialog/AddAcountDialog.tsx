import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { FC } from "react";
import {
  useAddAccountDialog,
  type AddAccountForm,
} from "./useAddAccountDialog";
import { Controller } from "react-hook-form";
import { usePostAccount } from "@/repositories/asset-management/accountRepository";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

export const AddAccountDialog: FC<Props> = ({ isOpen, handleClose }) => {
  const { reset, control, handleSubmit, errors } = useAddAccountDialog();
  const { postAccount } = usePostAccount();
  const onSubmit = async (data: AddAccountForm) => {
    await postAccount(data);
    reset();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>資産口座の追加</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <Controller
              control={control}
              name={"name"}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="口座名"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={"code"}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="口座コード"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="accountType"
              render={({ field }) => (
                <FormControl error={!!errors.accountType}>
                  <InputLabel id="account-type-label">口座種別</InputLabel>
                  <Select
                    {...field}
                    id="account<-type-label"
                    label="口座種別"
                  ></Select>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="memo"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="備考"
                  error={!!errors.memo}
                  helperText={errors.memo?.message}
                  multiline
                  rows={4}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            キャンセル
          </Button>
          <Button type="submit" variant="contained">
            追加
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
