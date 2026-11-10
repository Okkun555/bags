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
import { amountTypeLabels, amountTypes } from "@/types/amountType";
import {
  investmentTypeLabels,
  investmentTypes,
  type Investment,
} from "@/types/investment";
import type { LifePlan } from "@/types/lifePlan";
import { useInvestmentFormDialog } from "./useInvestmentFormDialog";

type Props = {
  lifePlanId: number;
  lifePlan: LifePlan;
  familyMembers: Array<FamilyMember>;
  /** 指定した場合は編集ダイアログ(1件ずつ)、未指定の場合は複数件を登録できる新規登録ダイアログになる */
  investment?: Investment;
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
export const InvestmentFormDialog: FC<Props> = ({
  lifePlanId,
  lifePlan,
  familyMembers,
  investment,
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
  } = useInvestmentFormDialog(
    lifePlanId,
    lifePlan.startFrom,
    familyMembers,
    handleClose,
    investment,
  );

  // MEMO: 年の選択肢は「ライフプランの期間」と「メンバーが100歳になる年」の広い方まで。
  // 編集中の投資が範囲外でも選べるよう範囲を広げる。メンバー未選択の場合は全メンバーのうち最も遅い年まで
  const yearsFor = (member?: FamilyMember) => {
    const targets = member ? [member] : familyMembers;
    const first = Math.min(lifePlan.startFrom, investment?.startFrom ?? Infinity);
    const last = Math.max(
      lifePlan.endTo ?? lifePlan.startFrom,
      investment?.endTo ?? -Infinity,
      ...targets.map((m) => birthYear(m) + MAX_AGE),
    );
    return Array.from({ length: last - first + 1 }, (_, i) => first + i);
  };

  return (
    <Dialog open onClose={close} fullWidth maxWidth="md">
      <DialogTitle>{investment ? "投資の編集" : "投資の登録"}</DialogTitle>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {!investment && (
              <Alert severity="info">
                複数の投資を一度に登録できます。
              </Alert>
            )}

            {fields.map((field, index) => {
              const rowErrors = errors.investments?.[index];
              const amount = watch(`investments.${index}.amount`);
              const amountType = watch(`investments.${index}.amountType`);
              const member = familyMembers.find(
                (m) => String(m.id) === watch(`investments.${index}.familyMemberId`),
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
                        name={`investments.${index}.familyMemberId`}
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
                        name={`investments.${index}.investmentType`}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="種別"
                            error={!!rowErrors?.investmentType}
                            helperText={rowErrors?.investmentType?.message}
                          >
                            {investmentTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {investmentTypeLabels[type]}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Controller
                        control={control}
                        name={`investments.${index}.amountType`}
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
                        name={`investments.${index}.amount`}
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
                        name={`investments.${index}.startFrom`}
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
                        name={`investments.${index}.endTo`}
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
                      name={`investments.${index}.memo`}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="備考(任意)"
                          error={!!rowErrors?.memo}
                          helperText={rowErrors?.memo?.message}
                        />
                      )}
                    />

                    {!investment && fields.length > 1 && (
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

            {!investment && (
              <Box>
                <Button onClick={addRow}>投資を追加する</Button>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={close}>
            キャンセル
          </Button>
          <Button type="submit" variant="contained" disabled={isMutating}>
            {investment ? "更新する" : "登録する"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
