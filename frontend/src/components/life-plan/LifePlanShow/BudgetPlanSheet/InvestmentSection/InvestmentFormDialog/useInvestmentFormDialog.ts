import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useFieldArray, useForm, type FieldPath } from "react-hook-form";
import z from "zod";
import {
  usePostInvestments,
  usePutInvestment,
  type InvestmentParams,
} from "@/repositories/life-plan/investmentsRepository";
import type { FamilyMember } from "@/types/familyMember";
import { amountTypes } from "@/types/amountType";
import { investmentTypes, type Investment } from "@/types/investment";

const YEAR_REGEX = /^\d{4}$/;
const AMOUNT_REGEX = /^[1-9]\d*$/;

// MEMO: 数値入力は文字列で保持し、送信時に数値へ変換する
const rowSchema = z
  .object({
    familyMemberId: z.string().min(1, { message: "メンバーを選択してください" }),
    investmentType: z.enum(investmentTypes, { message: "投資種別を選択してください" }),
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
  investments: z.array(rowSchema).min(1),
});

export type InvestmentForm = z.infer<typeof schema>;
export type InvestmentRowForm = InvestmentForm["investments"][number];

/** APIのエラー詳細のキー(snake_case) → フォームのフィールド */
const SERVER_ERROR_FIELDS = {
  family_member: "familyMemberId",
  family_member_id: "familyMemberId",
  investment_type: "investmentType",
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

const toParams = (row: InvestmentRowForm): InvestmentParams => ({
  familyMemberId: Number(row.familyMemberId),
  investmentType: row.investmentType,
  amount: Number(row.amount),
  amountType: row.amountType,
  startFrom: Number(row.startFrom),
  endTo: row.endTo === "" ? null : Number(row.endTo),
  memo: row.memo === "" ? null : row.memo,
});

/**
 * @param investment 指定した場合は編集(1件ずつ)、未指定の場合は新規登録(複数件を一度に登録できる)
 */
export const useInvestmentFormDialog = (
  lifePlanId: number,
  defaultStartFrom: number,
  familyMembers: Array<FamilyMember>,
  handleClose: () => void,
  investment?: Investment,
) => {
  const { createInvestments, isMutating: isCreating } = usePostInvestments(lifePlanId);
  // MEMO: フックは条件分岐できないため、新規登録時はダミーのidで呼ぶ(triggerは呼ばない)
  const { updateInvestment, isMutating: isUpdating } = usePutInvestment(
    lifePlanId,
    investment?.id ?? 0,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const newRow = (): InvestmentRowForm => ({
    familyMemberId:
      familyMembers.length === 1 ? String(familyMembers[0].id) : "",
    investmentType: "stock",
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
  } = useForm<InvestmentForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      investments: [
        investment
          ? {
              familyMemberId: String(investment.familyMemberId),
              investmentType: investment.investmentType,
              // MEMO: 編集時は保存されている年額で表示する
              amount: String(investment.amount),
              amountType: "annual",
              startFrom: String(investment.startFrom),
              endTo: investment.endTo !== null ? String(investment.endTo) : "",
              memo: investment.memo ?? "",
            }
          : newRow(),
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "investments",
  });

  const close = () => {
    reset();
    setErrorMessage(null);
    handleClose();
  };

  const onSubmit = async (data: InvestmentForm) => {
    setErrorMessage(null);
    try {
      if (investment) {
        await updateInvestment({ investment: toParams(data.investments[0]) });
      } else {
        await createInvestments({ investments: data.investments.map(toParams) });
      }
      close();
    } catch (e) {
      // MEMO: 入力内容は保持したまま、サーバー側のエラーを行・フィールドごとに表示する
      const error = isAxiosError<ErrorResponse>(e)
        ? e.response?.data?.error
        : undefined;
      let hasFieldError = false;
      for (const [key, messages] of Object.entries(error?.detail ?? {})) {
        // 新規登録は「investments.<行番号>.<属性>」、更新は「<属性>」がキーになる
        const matched = key.match(/^investments\.(\d+)\.(.+)$/);
        const index = matched ? Number(matched[1]) : 0;
        const attribute = matched ? matched[2] : key;
        const field =
          SERVER_ERROR_FIELDS[attribute as keyof typeof SERVER_ERROR_FIELDS];
        if (!field || messages.length === 0) continue;
        setError(`investments.${index}.${field}` as FieldPath<InvestmentForm>, {
          message: messages.map((m) => m.message).join("\n"),
        });
        hasFieldError = true;
      }
      if (!hasFieldError) {
        setErrorMessage(
          error?.message ?? `投資の${investment ? "更新" : "登録"}に失敗しました`,
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
