import { useState } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { AddMonthlyPlanDialog } from "./AddMonthlyPlanDialog";
import { MonthlyPlanTable } from "./MonthlyPlanTable";

export const MonthlyPlanList = () => {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);

  const handleOpenDialog = () => setIsOpenCreateDialog(true);
  const handleCloseDialog = () => setIsOpenCreateDialog(false);

  return (
    <>
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">
            今まで作成した月毎の家計予算を管理し、支出管理に活用できます。
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={handleOpenDialog}
          >
            新規作成
          </Button>
        </Stack>

        <MonthlyPlanTable />
      </Stack>

      <AddMonthlyPlanDialog
        isOpen={isOpenCreateDialog}
        handleClose={handleCloseDialog}
      />
    </>
  );
};
