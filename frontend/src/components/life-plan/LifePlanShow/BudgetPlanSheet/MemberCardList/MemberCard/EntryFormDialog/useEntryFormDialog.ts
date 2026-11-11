import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import {
  usePostIncome,
  usePutIncome,
} from "@/repositories/life-plan/incomesRepository";
import {
  usePostInvestment,
  usePutInvestment,
} from "@/repositories/life-plan/investmentsRepository";
import { incomeTypeLabels, type Income } from "@/types/income";
import type { FamilyMember } from "@/types/familyMember";
import { investmentTypeLabels, type Investment } from "@/types/investment";

export type EntryKind = "income" | "investment";

/** 金額の入力単位 */
export const amountUnits = ["monthly", "yearly"] as const;
export type AmountUnit = (typeof amountUnits)[number];

const MONTHS_PER_YEAR = 12;

/** 種別の選択肢(APIの値とラベル) */
export const entryTypeOptions: Record<
  EntryKind,
  Array<{ value: string; label: string }>
> = {
  income: Object.entries(incomeTypeLabels).map(([value, label]) => ({
    value,
    label,
  })),
  investment: Object.entries(investmentTypeLabels).map(([value, label]) => ({
    value,
    label,
  })),
};

const yearField = (label: string) =>
  z
    .string()
    .min(1, { message: `${label}を入力してください` })
    .regex(/^\d{4}$/, { message: `${label}は西暦4桁で入力してください` });

const schema = z
  .object({
    entryType: z.string().min(1, { message: "種別を選択してください" }),
    amountUnit: z.enum(amountUnits),
    amount: z
      .string()
      .min(1, { message: "金額を入力してください" })
      .regex(/^\d+$/, { message: "金額は半角数字で入力してください" })
      .refine((v) => Number(v) > 0, {
        message: "金額は1円以上で入力してください",
      }),
    startFrom: yearField("開始年"),
    // MEMO: 空欄＝最後まで(NULLで保存)
    endTo: z
      .string()
      .regex(/^(\d{4})?$/, { message: "終了年は西暦4桁で入力してください" }),
    memo: z.string().max(400, { message: "メモは400文字以内で入力してください" }),
  })
  .refine((v) => v.endTo === "" || Number(v.endTo) >= Number(v.startFrom), {
    message: "終了年は開始年以降にしてください",
    path: ["endTo"],
  });

export type EntryForm = z.infer<typeof schema>;

/** 入力値(月額／年額)から保存する年額を求める。未入力・不正な場合は null */
export const toAnnualAmount = (amount: string, unit: AmountUnit) => {
  if (!/^\d+$/.test(amount) || Number(amount) <= 0) return null;
  return unit === "monthly" ? Number(amount) * MONTHS_PER_YEAR : Number(amount);
};

/** APIのエラー詳細のキー(snake_case) → フォームのフィールド */
const SERVER_ERROR_FIELDS = {
  income_type: "entryType",
  investment_type: "entryType",
  amount: "amount",
  start_from: "startFrom",
  end_to: "endTo",
  memo: "memo",
} as const;

type ErrorResponse = {
  error?: {
    message?: string;
    detail?: Record<string, Array<{ message: string }>>;
  };
};

/**
 * @param entry 指定した場合は編集、未指定の場合は新規登録
 */
export const useEntryFormDialog = (
  kind: EntryKind,
  lifePlanId: number,
  familyMember: FamilyMember,
  handleClose: () => void,
  entry?: Income | Investment,
) => {
  const { createIncome, isMutating: isCreatingIncome } =
    usePostIncome(lifePlanId);
  const { createInvestment, isMutating: isCreatingInvestment } =
    usePostInvestment(lifePlanId);
  // MEMO: フックは条件分岐できないため、新規登録時はダミーのidで呼ぶ(triggerは呼ばない)
  const { updateIncome, isMutating: isUpdatingIncome } = usePutIncome(
    lifePlanId,
    entry?.id ?? 0,
  );
  const { updateInvestment, isMutating: isUpdatingInvestment } =
    usePutInvestment(lifePlanId, entry?.id ?? 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    reset,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<EntryForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      entryType: entry
        ? "incomeType" in entry
          ? entry.incomeType
          : entry.investmentType
        : "",
      // MEMO: 編集時は保存されている年額をそのまま表示する
      amountUnit: entry ? "yearly" : "monthly",
      amount: entry ? String(entry.amount) : "",
      startFrom: entry ? String(entry.startFrom) : "",
      endTo: entry?.endTo ? String(entry.endTo) : "",
      memo: entry?.memo ?? "",
    },
  });

  const [amount, amountUnit] = useWatch({
    control,
    name: ["amount", "amountUnit"],
  });
  const annualAmount = toAnnualAmount(amount, amountUnit);

  const birthYear = dayjs(familyMember.birthday).year();
  // MEMO: 選択肢は「10年前〜100歳になる年」。編集時は保存済みの年が範囲外でも選べるようにする
  const thisYear = dayjs().year();
  const years = [
    ...new Set([
      ...Array.from(
        { length: Math.max(birthYear + 100, thisYear + 1) - (thisYear - 10) + 1 },
        (_, i) => thisYear - 10 + i,
      ),
      ...(entry ? [entry.startFrom, ...(entry.endTo ? [entry.endTo] : [])] : []),
    ]),
  ].sort((a, b) => a - b);
  /** 指定した年(西暦)のメンバーの年齢 */
  const ageAt = (year: number) => year - birthYear;

  const close = () => {
    reset();
    setErrorMessage(null);
    handleClose();
  };

  const onSubmit = async (data: EntryForm) => {
    setErrorMessage(null);
    const base = {
      familyMemberId: familyMember.id,
      amount: toAnnualAmount(data.amount, data.amountUnit) ?? 0,
      startFrom: Number(data.startFrom),
      endTo: data.endTo === "" ? null : Number(data.endTo),
      memo: data.memo === "" ? null : data.memo,
    };
    try {
      if (kind === "income") {
        const params = {
          income: { ...base, incomeType: data.entryType as Income["incomeType"] },
        };
        if (entry) await updateIncome(params);
        else await createIncome(params);
      } else {
        const params = {
          investment: {
            ...base,
            investmentType: data.entryType as Investment["investmentType"],
          },
        };
        if (entry) await updateInvestment(params);
        else await createInvestment(params);
      }
      close();
    } catch (e) {
      // MEMO: 入力内容は保持したまま、サーバー側のエラーをフィールドごとに表示する
      const error = isAxiosError<ErrorResponse>(e)
        ? e.response?.data?.error
        : undefined;
      const detail = error?.detail;
      let hasFieldError = false;
      if (detail) {
        for (const [key, field] of Object.entries(SERVER_ERROR_FIELDS)) {
          const messages = detail[key]?.map((d) => d.message);
          if (messages?.length) {
            setError(field, { message: messages.join("\n") });
            hasFieldError = true;
          }
        }
      }
      if (!hasFieldError) {
        setErrorMessage(
          error?.message ??
            `${kind === "income" ? "収入" : "投資"}の${entry ? "更新" : "登録"}に失敗しました`,
        );
      }
    }
  };

  return {
    control,
    errors,
    errorMessage,
    annualAmount,
    years,
    ageAt,
    isMutating:
      isCreatingIncome ||
      isCreatingInvestment ||
      isUpdatingIncome ||
      isUpdatingInvestment,
    setAmountUnit: (unit: AmountUnit) => setValue("amountUnit", unit),
    close,
    onSubmit: handleSubmit(onSubmit),
  };
};
