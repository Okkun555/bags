import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { AddMonthlyPlanDialog } from "./AddMonthlyPlanDialog";

export const MonthlyPlanList = () => {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);

  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          計画一覧
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
            今まで計画した、1ヶ月の家計予算を管理できます。
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => setIsOpenCreateDialog(true)}
          >
            新規作成
          </Button>
        </Stack>
      </Box>
      <AddMonthlyPlanDialog
        isOpen={isOpenCreateDialog}
        handleClose={() => setIsOpenCreateDialog(false)}
      />
    </>
  );
};
