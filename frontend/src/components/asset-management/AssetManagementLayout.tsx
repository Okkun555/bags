import { Box, Stack } from "@mui/material";
import { WithHeaderLayout } from "../layouts/WithHeaderLayout";
import { Outlet } from "react-router";

export const AssetManagementLayout = () => {
  return (
    <WithHeaderLayout pageTitle="資産管理">
      <Stack>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}></Box>
        <Outlet />
      </Stack>
    </WithHeaderLayout>
  );
};
