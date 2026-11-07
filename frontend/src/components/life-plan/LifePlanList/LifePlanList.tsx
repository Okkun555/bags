import { WithHeaderLayout } from "@/components/layouts/WithHeaderLayout";
import { Stack, Typography } from "@mui/material";
import { LifePlanTable } from "./LifePlanTable";

export const LifePlanList = () => (
  <WithHeaderLayout pageTitle="ライフプラン">
    <Stack spacing={2}>
      <Typography variant="body1">
        作成したライフプランの一覧です。収入や投資の予算計画を管理できます。
      </Typography>

      <LifePlanTable />
    </Stack>
  </WithHeaderLayout>
);
