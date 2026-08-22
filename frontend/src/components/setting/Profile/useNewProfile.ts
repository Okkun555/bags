import { usePostProfile } from "@/repositories/profile/useProfile";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "react-hook-form";
import z from "zod";

export type NewProfileForm = z.infer<typeof schema>;
export type NewProfileRequest = {
  name: string;
  dateOfBirth: string | null;
  gender: (typeof GENDER_VALUES)[number];
  maritalStatus: (typeof MARITAL_STATUS_VALUES)[number];
  income: (typeof INCOME_VALUES)[number];
};

export const useNewProfile = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProfileForm>({
    defaultValues: {
      name: "",
      dateOfBirth: null,
      gender: "male",
      maritalStatus: "single",
      income: "under_200",
      occupation: null,
    },
  });

  const { postCreateProfile } = usePostProfile();
  const onSubmit = (data: NewProfileForm) => {
    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth?.format("YYYY-MM-DD") ?? null,
    };
    postCreateProfile(payload);
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
};

const GENDER_VALUES = ["male", "female", "other"] as const;
const MARITAL_STATUS_VALUES = [
  "single",
  "married",
  "living_with_parents",
  "other",
] as const;
const INCOME_VALUES = [
  "under_200",
  "from_200_to_400",
  "from_400_to_600",
  "from_600_to_800",
  "from_800_to_1000",
  "from_1000_to_1500",
  "from_1500_to_2000",
  "over_2000",
] as const;

const MIN_BIRTH_DATE = dayjs().subtract(120, "year");

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "アカウント名を入力してください" })
    .max(100, { message: "アカウント名は100文字以内で入力してください" }),
  dateOfBirth: z
    .custom<Dayjs>((val) => dayjs.isDayjs(val), {
      message: "生年月日を入力してください",
    })
    .nullable()
    .refine((val): boolean => val !== null, {
      message: "生年月日を入力してください",
    })
    .refine((val): boolean => !val || !val.isAfter(dayjs(), "day"), {
      message: "生年月日は未来の日付にできません",
    })
    .refine((val): boolean => !val || !val.isBefore(MIN_BIRTH_DATE, "day"), {
      message: "生年月日を正しく入力してください",
    }),
  gender: z.enum(GENDER_VALUES, {
    message: "性別を選択してください",
  }),
  prefecture: z.number().nullable(),
  maritalStatus: z.enum(MARITAL_STATUS_VALUES, {
    message: "婚姻状況を選択してください",
  }),
  occupation: z.number().nullable(),
  income: z.enum(INCOME_VALUES, {
    message: "年収を選択してください",
  }),
});
