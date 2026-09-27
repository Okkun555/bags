import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import {
  BUDGET_ITEM_TYPE,
  useAddBudgetItem,
  type AddBudgetItemForm,
} from "./useAddBudgetItem";
import { usePostBudgetItem } from "@/repositories/household-budget/useBudgetItem";

type AddBudgetItemDialogProps = {
  isOpen: boolean;
  handleClose: () => void;
};

export const AddBudgetItemDialog: FC<AddBudgetItemDialogProps> = ({
  isOpen,
  handleClose,
}) => {
  const { control, handleSubmit, errors } = useAddBudgetItem();

  const { postBudgetItem } = usePostBudgetItem();
  const onSubmit = async (data: AddBudgetItemForm) => {
    await postBudgetItem(data);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>カスタム予算項目の追加</DialogTitle>
      <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            標準項目以外で管理したい家計予算の項目をカスタムできます。
          </DialogContentText>
          <Stack spacing={3}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="項目名"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <FormControl error={!!errors.type}>
                  <InputLabel id="type-label">分類</InputLabel>
                  <Select {...field} id="type-label" label="分類">
                    {BUDGET_ITEM_TYPE.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type === "fixed" ? "固定費" : "変動費"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            キャンセル
          </Button>
          <Button type="submit" variant="contained">
            追加
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
