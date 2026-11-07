import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { usePostFamilyMember } from "@/repositories/life-plan/familyMembersRepository";
import { relationships } from "@/types/familyMember";

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "名前を入力してください" })
    .max(100, { message: "名前は100文字以内で入力してください" }),
  relationship: z.enum(relationships, { message: "続柄を選択してください" }),
  birthday: z
    .string()
    .min(1, { message: "生年月日を入力してください" })
    .refine((v) => dayjs(v, "YYYY-MM-DD", true).isValid(), {
      message: "生年月日を正しい日付で入力してください",
    })
    .refine((v) => !dayjs(v).isAfter(dayjs(), "day"), {
      message: "生年月日は今日以前の日付を入力してください",
    }),
});

export type FamilyMemberForm = z.infer<typeof schema>;

/** APIのエラー詳細のキー(snake_case) → フォームのフィールド */
const SERVER_ERROR_FIELDS = {
  name: "name",
  relationship: "relationship",
  birthday: "birthday",
} as const;

type ErrorResponse = {
  error?: {
    message?: string;
    detail?: Record<string, Array<{ message: string }>>;
  };
};

export const useFamilyMemberFormDialog = (
  lifePlanId: number,
  handleClose: () => void,
) => {
  const { createFamilyMember, isMutating } = usePostFamilyMember(lifePlanId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    reset,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FamilyMemberForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      // MEMO: 最初の1人は本人であることが多いので、本人を初期値にする
      relationship: "me",
      birthday: "",
    },
  });

  const close = () => {
    reset();
    setErrorMessage(null);
    handleClose();
  };

  const onSubmit = async (data: FamilyMemberForm) => {
    setErrorMessage(null);
    try {
      await createFamilyMember({ familyMember: data });
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
        setErrorMessage(error?.message ?? "家族メンバーの登録に失敗しました");
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
