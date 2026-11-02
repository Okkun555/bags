import { Box, Tab, Tabs } from "@mui/material";
import { WithHeaderLayout } from "../layouts/WithHeaderLayout";
import { Link, Outlet } from "react-router";

import React, { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { paths } from "@/routes/paths";

const MENU_ITEMS = [
  {
    label: "ダッシュボード",
    value: "dashboard",
    to: paths.assetManagement.dashboard,
    icon: <DashboardIcon />,
  },
  {
    label: "口座マスター",
    value: "master",
    to: paths.assetManagement.accountMaster,
    icon: <SettingsIcon />,
  },
];

export const AssetManagementLayout = () => {
  const [tab, setTab] = useState("dashboard");

  return (
    <WithHeaderLayout pageTitle="資産管理">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_e: React.SyntheticEvent, newValue: string) =>
            setTab(newValue)
          }
        >
          {MENU_ITEMS.map((item) => (
            <Tab
              label={item.label}
              value={item.value}
              icon={item.icon}
              iconPosition="start"
              component={Link}
              to={item.to}
              sx={{
                minHeight: 40,
                py: 1,
              }}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </WithHeaderLayout>
  );
};
