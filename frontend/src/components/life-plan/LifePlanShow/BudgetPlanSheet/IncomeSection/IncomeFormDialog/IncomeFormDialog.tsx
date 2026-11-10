import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import {
  relationshipLabels,
  type FamilyMember,
} from "@/types/familyMember";
import {
  amountTypeLabels,
  amountTypes,
  incomeTypeLabels,
  incomeTypes,
  type Income,
} from "@/types/income";
import type { LifePlan } from "@/types/lifePlan";
import { useIncomeFormDialog } from "./useIncomeFormDialog";

type Props = {
  lifePlanId: number;
  lifePlan: LifePlan;
  familyMembers: Array<FamilyMember>;
  /** 指定した場合は編集ダイアログ(1件ずつ)、未指定の場合は複数件を登録できる新規登録ダイアログになる */
  income?: Income;
  handleClose: () => void;
};

/** 年の選択肢は、メンバーが何歳になる年まで選べるようにするか */
const MAX_AGE = 100;

const birthYear = (member: FamilyMember) => dayjs(member.birthday).year();

/** 選択肢の年に、選択中のメンバーがその年に迎える年齢を添える(メンバー未選択・誕生前の場合は年のみ) */
const yearLabel = (year: number, member?: FamilyMember) => {
  if (!member) return `${year}年`;
  const age = year - dayjs(member.birthday).year();
  return age >= 0 ? `${year}年（${age}歳）` : `${year}年`;
};

// MEMO: フォームの初期値はマウント時に決まるため、開くたびにマウントし直す前提で使う
export const IncomeFormDialog: FC<Props> = ({
  lifePlanId,
  lifePlan,
  familyMembers,
  income,
  handleClose,
}) => {
  const {
    control,
    watch,
    errors,
    errorMessage,
    isMutating,
    fields,
    addRow,
    removeRow,
    close,
    onSubmit,
  } = useIncomeFormDialog(
    lifePlanId,
    lifePlan.startFrom,
    familyMembers,
    handleClose,
    income,
  );

  // MEMO: 年の選択肢は「ライフプランの期間」と「メンバーが100歳になる年」の広い方まで。
  // 編集中の収入が範囲外でも選べるよう範囲を広げる。メンバー未選択の場合は全メンバーのうち最も遅い年まで
  const yearsFor = (member?: FamilyMember) => {
    const targets = member ? [member] : familyMembers;
    const first = Math.min(lifePlan.startFrom, income?.startFrom ?? Infinity);
    const last = Math.max(
      lifePlan.endTo ?? lifePlan.startFrom,
      income?.endTo ?? -Infinity,
      ...targets.map((m) => birthYear(m) + MAX_AGE),
    );
    return Array.from({ length: last - first + 1 }, (_, i) => first + i);
  };

  return (
    <Dialog open onClose={close} fullWidth maxWidth="md">
      <DialogTitle>{income ? "収入の編集" : "収入の登録"}</DialogTitle>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {!income && (
              <Alert severity="info">
                手取りの金額を入力することをおすすめします。複数の収入を一度に登録できます。
              </Alert>
            )}

            {fields.map((field, index) => {
              const rowErrors = errors.incomes?.[index];
              const amount = watch(`incomes.${index}.amount`);
              const amountType = watch(`incomes.${index}.amountType`);
              const member = familyMembers.find(
                (m) => String(m.id) === watch(`incomes.${index}.familyMemberId`),
              );
              const years = yearsFor(member);
              const annualPreview =
                amountType === "monthly" && /^[1-9]\d*$/.test(amount)
                  ? `年額 ${(Number(amount) * 12).toLocaleString()}円で保存されます`
                  : undefined;

              return (
                <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Controller
                        control={control}
                        name={`incomes.${index}.familyMemberId`}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="メンバー"
                            error={!!rowErrors?.familyMemberId}
                            helperText={rowErrors?.familyMemberId?.message}
                          >
                            {familyMembers.map((member) => (
                              <MenuItem key={member.id} value={String(member.id)}>
                                {member.name}（
                                {relationshipLabels[member.relationship]}）
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`incomes.${index}.incomeType`}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="種別"
                            error={!!rowErrors?.incomeType}
                            helperText={rowErrors?.incomeType?.message}
                          >
                            {incomeTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {incomeTypeLabels[type]}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Controller
                        control={control}
                        name={`incomes.${index}.amountType`}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="入力区分"
                            sx={{ minWidth: 120 }}
                          >
                            {amountTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {amountTypeLabels[type]}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`incomes.${index}.amount`}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="金額(円)"
                            slotProps={{ htmlInput: { inputMode: "numeric" } }}
                            error={!!rowErrors?.amount}
                            helperText={rowErrors?.amount?.message ?? annualPreview}
                          />
                        )}
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Controller
                        control={control}
                        name={`incomes.${index}.startFrom`}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="開始年"
                            error={!!rowErrors?.startFrom}
                            helperText={
                              rowErrors?.startFrom?.message ??
                              (member
                                ? undefined
                                : "メンバーを選択すると年齢が表示されます")
                            }
                          >
                            {years.map((year) => (
                              <MenuItem key={year} value={String(year)}>
                                {yearLabel(year, member)}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`incomes.${index}.endTo`}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="終了年"
                            slotProps={{
                              inputLabel: { shrink: true },
                              select: { displayEmpty: true },
                            }}
                            error={!!rowErrors?.endTo}
                            helperText={rowErrors?.endTo?.message}
                          >
                            <MenuItem value="">最後まで</MenuItem>
                            {years.map((year) => (
                              <MenuItem key={year} value={String(year)}>
                                {yearLabel(year, member)}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Stack>

                    <Controller
                      control={control}
                      name={`incomes.${index}.memo`}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="備考(任意)"
                          error={!!rowErrors?.memo}
                          helperText={rowErrors?.memo?.message}
                        />
                      )}
                    />

                    {!income && fields.length > 1 && (
                      <Box>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeRow(index)}
                        >
                          この行を削除
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              );
            })}

            {!income && (
              <Box>
                <Button onClick={addRow}>収入を追加する</Button>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={close}>
            キャンセル
          </Button>
          <Button type="submit" variant="contained" disabled={isMutating}>
            {income ? "更新する" : "登録する"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
