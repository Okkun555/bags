import { WithHeaderLayout } from "@/components/layouts/WithHeaderLayout";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useNewProfile } from "./useNewProfile";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const GENDER_OPTIONS = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
] as const;

const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "未婚" },
  { value: "married", label: "既婚" },
  { value: "living_with_parents", label: "実家暮らし" },
  { value: "other", label: "その他" },
] as const;

const INCOME_OPTIONS = [
  { value: "under_200", label: "200万円未満" },
  { value: "from_200_to_400", label: "200〜400万円未満" },
  { value: "from_400_to_600", label: "400〜600万円未満" },
  { value: "from_600_to_800", label: "600〜800万円未満" },
  { value: "from_800_to_1000", label: "800〜1000万円未満" },
  { value: "from_1000_to_1500", label: "1000〜1500万円未満" },
  { value: "from_1500_to_2000", label: "1500〜2000万円未満" },
  { value: "over_2000", label: "2000万円以上" },
] as const;

export const NewProfile = () => {
  const { control, handleSubmit, errors, onSubmit } = useNewProfile();

  return (
    <WithHeaderLayout pageTitle="プロフィール設定">
      <Container maxWidth="md">
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="アカウント名"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <DatePicker
                  {...rest}
                  label="生年月日"
                  value={value}
                  onChange={(newValue) => onChange(newValue)}
                  format="YYYY/MM/DD"
                  maxDate={dayjs()}
                  minDate={dayjs().subtract(120, "year")}
                  slotProps={{
                    textField: {
                      inputRef: ref,
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth?.message,
                    },
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <FormControl error={!!errors.gender}>
                  <InputLabel id="gender-label">性別</InputLabel>
                  <Select {...field} labelId="gender-label" label="性別">
                    {GENDER_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.gender?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="maritalStatus"
              render={({ field }) => (
                <FormControl error={!!errors.maritalStatus}>
                  <InputLabel id="marital-status-label">婚姻状況</InputLabel>
                  <Select
                    {...field}
                    labelId="marital-status-label"
                    label="婚姻状況"
                  >
                    {MARITAL_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.maritalStatus?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="income"
              render={({ field }) => (
                <FormControl error={!!errors.income}>
                  <InputLabel id="income-label">年収</InputLabel>
                  <Select {...field} labelId="income-label" label="年収">
                    {INCOME_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.income?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Button type="submit" variant="contained">
              作成
            </Button>
          </Stack>
        </Box>
      </Container>
    </WithHeaderLayout>
  );
};
