import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useFieldArray, useForm, type FieldPath } from "react-hook-form";
import z from "zod";
import {
  usePostIncomes,
  usePutIncome,
  type IncomeParams,
} from "@/repositories/life-plan/incomesRepository";
import type { FamilyMember } from "@/types/familyMember";
import {
  amountTypes,
  incomeTypes,
  type Income,
} from "@/types/income";

const YEAR_REGEX = /^\d{4}$/;
const AMOUNT_REGEX = /^[1-9]\d*$/;

// MEMO: 数値入力は文字列で保持し、送信時に数値へ変換する
const rowSchema = z
  .object({
    familyMemberId: z.string().min(1, { message: "メンバーを選択してください" }),
    incomeType: z.enum(incomeTypes, { message: "収入種別を選択してください" }),
    amount: z
      .string()
      .regex(AMOUNT_REGEX, { message: "金額は1以上の整数で入力してください" }),
    amountType: z.enum(amountTypes),
    startFrom: z
      .string()
      .regex(YEAR_REGEX, { message: "開始年は4桁の西暦で入力してください" }),
    endTo: z.string().refine((v) => v === "" || YEAR_REGEX.test(v), {
      message: "終了年は4桁の西暦で入力してください",
    }),
    memo: z.string().max(400, { message: "備考は400文字以内で入力してください" }),
  })
  .refine(
    ({ startFrom, endTo }) =>
      endTo === "" ||
      !YEAR_REGEX.test(startFrom) ||
      !YEAR_REGEX.test(endTo) ||
      Number(endTo) >= Number(startFrom),
    { message: "終了年は開始年以降の年を入力してください", path: ["endTo"] },
  );

const schema = z.object({
  incomes: z.array(rowSchema).min(1),
});

export type IncomeForm = z.infer<typeof schema>;
export type IncomeRowForm = IncomeForm["incomes"][number];

/** APIのエラー詳細のキー(snake_case) → フォームのフィールド */
const SERVER_ERROR_FIELDS = {
  family_member: "familyMemberId",
  family_member_id: "familyMemberId",
  income_type: "incomeType",
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

const toParams = (row: IncomeRowForm): IncomeParams => ({
  familyMemberId: Number(row.familyMemberId),
  incomeType: row.incomeType,
  amount: Number(row.amount),
  amountType: row.amountType,
  startFrom: Number(row.startFrom),
  endTo: row.endTo === "" ? null : Number(row.endTo),
  memo: row.memo === "" ? null : row.memo,
});

/**
 * @param income 指定した場合は編集(1件ずつ)、未指定の場合は新規登録(複数件を一度に登録できる)
 */
export const useIncomeFormDialog = (
  lifePlanId: number,
  defaultStartFrom: number,
  familyMembers: Array<FamilyMember>,
  handleClose: () => void,
  income?: Income,
) => {
  const { createIncomes, isMutating: isCreating } = usePostIncomes(lifePlanId);
  // MEMO: フックは条件分岐できないため、新規登録時はダミーのidで呼ぶ(triggerは呼ばない)
  const { updateIncome, isMutating: isUpdating } = usePutIncome(
    lifePlanId,
    income?.id ?? 0,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const newRow = (): IncomeRowForm => ({
    familyMemberId:
      familyMembers.length === 1 ? String(familyMembers[0].id) : "",
    incomeType: "salary",
    amount: "",
    amountType: "monthly",
    startFrom: String(defaultStartFrom),
    endTo: "",
    memo: "",
  });

  const {
    reset,
    control,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IncomeForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      incomes: [
        income
          ? {
              familyMemberId: String(income.familyMemberId),
              incomeType: income.incomeType,
              // MEMO: 編集時は保存されている年額で表示する
              amount: String(income.amount),
              amountType: "annual",
              startFrom: String(income.startFrom),
              endTo: income.endTo !== null ? String(income.endTo) : "",
              memo: income.memo ?? "",
            }
          : newRow(),
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "incomes",
  });

  const close = () => {
    reset();
    setErrorMessage(null);
    handleClose();
  };

  const onSubmit = async (data: IncomeForm) => {
    setErrorMessage(null);
    try {
      if (income) {
        await updateIncome({ income: toParams(data.incomes[0]) });
      } else {
        await createIncomes({ incomes: data.incomes.map(toParams) });
      }
      close();
    } catch (e) {
      // MEMO: 入力内容は保持したまま、サーバー側のエラーを行・フィールドごとに表示する
      const error = isAxiosError<ErrorResponse>(e)
        ? e.response?.data?.error
        : undefined;
      let hasFieldError = false;
      for (const [key, messages] of Object.entries(error?.detail ?? {})) {
        // 新規登録は「incomes.<行番号>.<属性>」、更新は「<属性>」がキーになる
        const matched = key.match(/^incomes\.(\d+)\.(.+)$/);
        const index = matched ? Number(matched[1]) : 0;
        const attribute = matched ? matched[2] : key;
        const field =
          SERVER_ERROR_FIELDS[attribute as keyof typeof SERVER_ERROR_FIELDS];
        if (!field || messages.length === 0) continue;
        setError(`incomes.${index}.${field}` as FieldPath<IncomeForm>, {
          message: messages.map((m) => m.message).join("\n"),
        });
        hasFieldError = true;
      }
      if (!hasFieldError) {
        setErrorMessage(
          error?.message ?? `収入の${income ? "更新" : "登録"}に失敗しました`,
        );
      }
    }
  };

  return {
    control,
    watch,
    errors,
    errorMessage,
    isMutating: isCreating || isUpdating,
    fields,
    addRow: () => append(newRow()),
    removeRow: remove,
    close,
    onSubmit: handleSubmit(onSubmit),
  };
};
