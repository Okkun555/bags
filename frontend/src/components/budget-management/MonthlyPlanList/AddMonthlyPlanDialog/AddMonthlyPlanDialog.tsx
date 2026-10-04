import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import { usePostMonthlyPlan } from "@/repositories/budget-management/monthlyPlansRepository";
import type { FC } from "react";
import {
  useAddMonthlyPlanDialog,
  type AddMonthlyPlanForm,
} from "./useAddMonthlyPlanDialog";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { paths } from "@/routes/paths";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

export const AddMonthlyPlanDialog: FC<Props> = ({ isOpen, handleClose }) => {
  const { reset, control, handleSubmit, errors } = useAddMonthlyPlanDialog();
  const { postMonthlyPlan } = usePostMonthlyPlan();
  const navigate = useNavigate();

  const onSubmit = async (data: AddMonthlyPlanForm) => {
    const monthlyPlan = await postMonthlyPlan(data);
    if (monthlyPlan) {
      reset();
      handleClose();
      navigate(paths.budgetManagement.monthlyPlanDetail(monthlyPlan.id));
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>月次計画の新規作成</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="計画名"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="説明"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  multiline
                  rows={6}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => {
              reset();
              handleClose();
            }}
          >
            キャンセル
          </Button>
          <Button type="submit" variant="contained">
            作成する
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
