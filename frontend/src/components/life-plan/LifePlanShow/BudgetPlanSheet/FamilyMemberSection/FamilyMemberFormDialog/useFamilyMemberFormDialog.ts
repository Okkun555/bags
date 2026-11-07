import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  usePostFamilyMember,
  usePutFamilyMember,
} from "@/repositories/life-plan/familyMembersRepository";
import { relationships, type FamilyMember } from "@/types/familyMember";

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

/**
 * @param familyMember 指定した場合は編集、未指定の場合は新規登録
 */
export const useFamilyMemberFormDialog = (
  lifePlanId: number,
  handleClose: () => void,
  familyMember?: FamilyMember,
) => {
  const { createFamilyMember, isMutating: isCreating } =
    usePostFamilyMember(lifePlanId);
  // MEMO: フックは条件分岐できないため、新規登録時はダミーのidで呼ぶ(triggerは呼ばない)
  const { updateFamilyMember, isMutating: isUpdating } = usePutFamilyMember(
    lifePlanId,
    familyMember?.id ?? 0,
  );
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
      name: familyMember?.name ?? "",
      // MEMO: 最初の1人は本人であることが多いので、新規登録時は本人を初期値にする
      relationship: familyMember?.relationship ?? "me",
      birthday: familyMember?.birthday ?? "",
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
      if (familyMember) {
        await updateFamilyMember({ familyMember: data });
      } else {
        await createFamilyMember({ familyMember: data });
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
            `家族メンバーの${familyMember ? "更新" : "登録"}に失敗しました`,
        );
      }
    }
  };

  return {
    control,
    errors,
    errorMessage,
    isMutating: isCreating || isUpdating,
    close,
    onSubmit: handleSubmit(onSubmit),
  };
};
