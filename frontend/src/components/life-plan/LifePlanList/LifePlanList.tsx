import { WithHeaderLayout } from "@/components/layouts/WithHeaderLayout";
import AddIcon from "@mui/icons-material/Add";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { CreateLifePlanDialog } from "./CreateLifePlanDialog";
import { LifePlanTable } from "./LifePlanTable";

export const LifePlanList = () => {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);

  return (
    <WithHeaderLayout pageTitle="ライフプラン">
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="body1">
            作成したライフプランの一覧です。収入や投資の予算計画を管理できます。
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => setIsOpenCreateDialog(true)}
          >
            新規作成
          </Button>
        </Stack>

        <LifePlanTable />
      </Stack>

      <CreateLifePlanDialog
        isOpen={isOpenCreateDialog}
        handleClose={() => setIsOpenCreateDialog(false)}
      />
    </WithHeaderLayout>
  );
};
