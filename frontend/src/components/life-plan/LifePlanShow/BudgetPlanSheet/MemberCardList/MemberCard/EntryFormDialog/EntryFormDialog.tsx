import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import { relationshipLabels, type FamilyMember } from "@/types/familyMember";
import type { Income } from "@/types/income";
import type { Investment } from "@/types/investment";
import {
  entryTypeOptions,
  useEntryFormDialog,
  type EntryKind,
} from "./useEntryFormDialog";

type Props = {
  kind: EntryKind;
  lifePlanId: number;
  /** 登録先のメンバー(固定表示。family_member_id はここから渡す) */
  familyMember: FamilyMember;
  /** 指定した場合は編集ダイアログ、未指定の場合は新規登録ダイアログになる */
  entry?: Income | Investment;
  handleClose: () => void;
};

const kindLabels: Record<EntryKind, string> = {
  income: "収入",
  investment: "投資",
};

// MEMO: フォームの初期値はマウント時に決まるため、開くたびにマウントし直す前提で使う
export const EntryFormDialog: FC<Props> = ({
  kind,
  lifePlanId,
  familyMember,
  entry,
  handleClose,
}) => {
  const {
    control,
    errors,
    errorMessage,
    annualAmount,
    years,
    ageAt,
    isMutating,
    setAmountUnit,
    close,
    onSubmit,
  } = useEntryFormDialog(kind, lifePlanId, familyMember, handleClose, entry);
  const label = kindLabels[kind];

  return (
    <Dialog open onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>
        {label}の{entry ? "編集" : "登録"}
      </DialogTitle>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
              label="対象メンバー"
              value={`${familyMember.name}（${relationshipLabels[familyMember.relationship]}）`}
              slotProps={{ input: { readOnly: true } }}
            />

            <Controller
              control={control}
              name="entryType"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="種別"
                  error={!!errors.entryType}
                  helperText={errors.entryType?.message}
                >
                  {entryTypeOptions[kind].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              control={control}
              name="amountUnit"
              render={({ field }) => (
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  color="primary"
                  value={field.value}
                  onChange={(_, value) => value && setAmountUnit(value)}
                  aria-label="金額の入力単位"
                >
                  <ToggleButton value="monthly">月額で入力</ToggleButton>
                  <ToggleButton value="yearly">年額で入力</ToggleButton>
                </ToggleButtonGroup>
              )}
            />

            <Stack spacing={0.5}>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="金額"
                    inputMode="numeric"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">円</InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              {annualAmount !== null && (
                <Typography variant="body2" color="text.secondary">
                  年額 {annualAmount.toLocaleString("ja-JP")}円 として保存されます
                </Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={2}>
              <Stack direction="row" spacing={1} sx={{ flex: 1, alignItems: "center" }}>
                <Controller
                  control={control}
                  name="startFrom"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="開始年"
                      fullWidth
                      error={!!errors.startFrom}
                      helperText={errors.startFrom?.message}
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={String(year)}>
                          {year}年（{ageAt(year)}歳）
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ flex: 1, alignItems: "center" }}>
                <Controller
                  control={control}
                  name="endTo"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="終了年（空欄＝最後まで）"
                      fullWidth
                      error={!!errors.endTo}
                      helperText={errors.endTo?.message}
                      slotProps={{
                        select: { displayEmpty: true },
                        // MEMO: 値が空(最後まで)でもラベルと表示が重ならないよう常に縮小する
                        inputLabel: { shrink: true },
                      }}
                    >
                      <MenuItem value="">最後まで</MenuItem>
                      {years.map((year) => (
                        <MenuItem key={year} value={String(year)}>
                          {year}年（{ageAt(year)}歳）
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>
            </Stack>

            <Controller
              control={control}
              name="memo"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="メモ（任意）"
                  multiline
                  minRows={2}
                  error={!!errors.memo}
                  helperText={errors.memo?.message}
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
            {entry ? "更新する" : "登録する"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
