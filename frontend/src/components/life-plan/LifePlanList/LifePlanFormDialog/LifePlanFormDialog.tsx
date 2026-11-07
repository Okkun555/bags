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
import type { LifePlan } from "@/types/lifePlan";
import { useLifePlanFormDialog } from "./useLifePlanFormDialog";

type Props = {
  /** 指定した場合は編集ダイアログ、未指定の場合は新規作成ダイアログになる */
  lifePlan?: LifePlan;
  handleClose: () => void;
};

// MEMO: フォームの初期値はマウント時に決まるため、開くたびにマウントし直す前提で使う
export const LifePlanFormDialog: FC<Props> = ({ lifePlan, handleClose }) => {
  const { control, errors, errorMessage, isMutating, close, onSubmit } =
    useLifePlanFormDialog(handleClose, lifePlan);

  return (
    <Dialog open onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>
        {lifePlan ? "ライフプランの編集" : "ライフプランの新規作成"}
      </DialogTitle>
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
            {lifePlan ? "更新する" : "作成する"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
