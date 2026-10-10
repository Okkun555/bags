import {
  RELATIONSHIP_LABEL,
  RELATIONSHIP_OPTIONS,
  type MonthlyPlanDetail,
} from "@/types/budgetManagement";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { FC } from "react";
import {
  useHouseholdBudgetEditDialog,
  type HouseholdBudgetFormValues,
} from "./useHouseholdBudgetEditDialog";
import { Controller } from "react-hook-form";
import { usePutHouseholdBudgets } from "@/repositories/budget-management/householdBudgetsRepository";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  monthlyPlanDetail: MonthlyPlanDetail;
};

export const HouseholdBudgetEditDialog: FC<Props> = ({
  isOpen,
  handleClose,
  monthlyPlanDetail,
}) => {
  const { control, register, fields, addRow, removeRow, handleSubmit, errors } =
    useHouseholdBudgetEditDialog(monthlyPlanDetail.householdBudgets, isOpen);

  const { putHouseholdBudget } = usePutHouseholdBudgets(monthlyPlanDetail.id);

  const onSubmit = async (value: HouseholdBudgetFormValues) => {
    await putHouseholdBudget(value);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>世帯収入の編集</DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {errors.root && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.root.message}
            </Alert>
          )}
          {errors.householdBudgets?.root && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.householdBudgets.root.message}
            </Alert>
          )}

          <Stack spacing={3}>
            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={1}>
                <Controller
                  control={control}
                  name={`householdBudgets.${index}.relationship`}
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      select
                      label="続柄"
                      sx={{ width: 140 }}
                    >
                      {RELATIONSHIP_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {RELATIONSHIP_LABEL[option]}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <TextField
                  label="収入(円)"
                  type="number"
                  fullWidth
                  error={!!errors.householdBudgets?.[index]?.income}
                  helperText={errors.householdBudgets?.[index]?.income?.message}
                  {...register(`householdBudgets.${index}.income`, {
                    valueAsNumber: true,
                  })}
                />

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => removeRow(index)}
                >
                  削除
                </Button>
              </Stack>
            ))}
          </Stack>

          <Button startIcon={<AddIcon />} onClick={addRow} sx={{ mt: 2 }}>
            収入者を追加
          </Button>
        </DialogContent>

        <DialogActions sx={{ mb: 1 }}>
          <Button
            size="large"
            variant="contained"
            color="inherit"
            onClick={handleClose}
          >
            キャンセル
          </Button>
          <Button size="large" variant="contained" type="submit">
            保存
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
