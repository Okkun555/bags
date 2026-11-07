import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";
import { usePostLifePlan } from "@/repositories/life-plan/lifePlansRepository";
import { paths } from "@/routes/paths";

const YEAR_REGEX = /^\d{4}$/;

// MEMO: 数値入力は文字列で保持し、送信時に数値へ変換する
const schema = z
  .object({
    name: z
      .string()
      .min(1, { message: "タイトルを入力してください" })
      .max(100, { message: "タイトルは100文字以内で入力してください" }),
    startFrom: z
      .string()
      .regex(YEAR_REGEX, { message: "開始年は4桁の西暦で入力してください" }),
    endTo: z
      .string()
      .refine((v) => v === "" || YEAR_REGEX.test(v), {
        message: "終了年は4桁の西暦で入力してください",
      }),
  })
  .refine(
    ({ startFrom, endTo }) =>
      endTo === "" ||
      !YEAR_REGEX.test(startFrom) ||
      !YEAR_REGEX.test(endTo) ||
      Number(endTo) >= Number(startFrom),
    { message: "終了年は開始年以降の年を入力してください", path: ["endTo"] },
  );

export type CreateLifePlanForm = z.infer<typeof schema>;

/** APIのエラー詳細のキー(snake_case) → フォームのフィールド */
const SERVER_ERROR_FIELDS = {
  name: "name",
  start_from: "startFrom",
  end_to: "endTo",
} as const;

type ErrorResponse = {
  error?: {
    message?: string;
    detail?: Record<string, Array<{ message: string }>>;
  };
};

export const useCreateLifePlanDialog = (handleClose: () => void) => {
  const navigate = useNavigate();
  const { createLifePlan, isMutating } = usePostLifePlan();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    reset,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateLifePlanForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      startFrom: String(new Date().getFullYear()),
      endTo: "",
    },
  });

  const close = () => {
    reset();
    setErrorMessage(null);
    handleClose();
  };

  const onSubmit = async (data: CreateLifePlanForm) => {
    setErrorMessage(null);
    try {
      const lifePlan = await createLifePlan({
        lifePlan: {
          name: data.name,
          startFrom: Number(data.startFrom),
          endTo: data.endTo === "" ? null : Number(data.endTo),
        },
      });
      close();
      navigate(paths.lifePlans.show(lifePlan.id));
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
        setErrorMessage(error?.message ?? "ライフプランの作成に失敗しました");
      }
    }
  };

  return {
    control,
    errors,
    errorMessage,
    isMutating,
    close,
    onSubmit: handleSubmit(onSubmit),
  };
};
