import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import { useCreateLifePlanDialog } from "./useCreateLifePlanDialog";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

export const CreateLifePlanDialog: FC<Props> = ({ isOpen, handleClose }) => {
  const { control, errors, errorMessage, isMutating, close, onSubmit } =
    useCreateLifePlanDialog(handleClose);

  return (
    <Dialog open={isOpen} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>ライフプランの新規作成</DialogTitle>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="タイトル"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="startFrom"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="開始年"
                  slotProps={{ htmlInput: { inputMode: "numeric" } }}
                  error={!!errors.startFrom}
                  helperText={errors.startFrom?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="endTo"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="終了年(任意)"
                  slotProps={{ htmlInput: { inputMode: "numeric" } }}
                  error={!!errors.endTo}
                  helperText={errors.endTo?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={close}>
            キャンセル
          </Button>
          <Button type="submit" variant="contained" disabled={isMutating}>
            作成する
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
