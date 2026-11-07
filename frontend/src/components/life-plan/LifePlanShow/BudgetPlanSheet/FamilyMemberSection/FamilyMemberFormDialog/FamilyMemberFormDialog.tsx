import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import { relationships, relationshipLabels } from "@/types/familyMember";
import { useFamilyMemberFormDialog } from "./useFamilyMemberFormDialog";

type Props = {
  lifePlanId: number;
  handleClose: () => void;
};

// MEMO: フォームの初期値はマウント時に決まるため、開くたびにマウントし直す前提で使う
export const FamilyMemberFormDialog: FC<Props> = ({
  lifePlanId,
  handleClose,
}) => {
  const { control, errors, errorMessage, isMutating, close, onSubmit } =
    useFamilyMemberFormDialog(lifePlanId, handleClose);

  return (
    <Dialog open onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>家族メンバーの登録</DialogTitle>
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
                  label="名前"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="relationship"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="続柄"
                  error={!!errors.relationship}
                  helperText={errors.relationship?.message}
                >
                  {relationships.map((relationship) => (
                    <MenuItem key={relationship} value={relationship}>
                      {relationshipLabels[relationship]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              control={control}
              name="birthday"
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="生年月日"
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.birthday}
                  helperText={errors.birthday?.message}
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
            登録する
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
