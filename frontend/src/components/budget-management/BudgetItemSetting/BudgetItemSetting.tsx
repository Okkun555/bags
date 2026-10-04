import { useFetchBudgetItems } from "@/repositories/budget-management/budgetItemsRepository";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import type { BudgetItem } from "@/types/budgetManagement";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { AddBudgetItemDialog } from "./AddBudgetItemDialog/AddBudgetItemDialog";
import { BudgetItemTable } from "./BudgetItemTable";

export const BudgetItemSetting = () => {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false);
  const [targetBudgetItem, setTargetBudgetItem] = useState<BudgetItem | null>(
    null,
  );

  const handleOpenDeleteDialog = (target: BudgetItem) => {
    setTargetBudgetItem(target);
    setIsOpenDeleteDialog(true);
  };

  const { budgetItems, isLoading } = useFetchBudgetItems();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          予算項目設定
        </Typography>
        <Stack
          direction="row"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
            mb: 2,
          }}
        >
          <Typography variant="body1">
            家計予算を計画する際に利用する「項目マスター」を管理します。
            <br />
            デフォルト項目に加えて、あなたのライフスタイルに沿ったカスタム項目を追加することが可能です。
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => setIsOpenCreateDialog(true)}
          >
            項目を追加
          </Button>
        </Stack>
      </Box>

      <BudgetItemTable
        budgetItems={budgetItems ?? []}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
      />

      <AddBudgetItemDialog
        isOpen={isOpenCreateDialog}
        handleClose={() => setIsOpenCreateDialog(false)}
      />

      <DeleteConfirmDialog
        target={targetBudgetItem}
        isOpen={isOpenDeleteDialog}
        handleClose={() => setIsOpenDeleteDialog(false)}
      />
    </>
  );
};
