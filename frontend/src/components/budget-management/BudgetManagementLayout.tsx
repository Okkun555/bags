import { Link, Outlet, useLocation } from "react-router";
import { WithHeaderLayout } from "../layouts/WithHeaderLayout";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import { paths } from "../routes/paths";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";

const MENU_ITEMS = [
  {
    label: "予算計画",
    value: "plan",
    to: paths.budgetManagement.monthlyPlans,
    icon: <FormatListBulletedIcon />,
  },
  {
    label: "項目設定",
    value: "setting",
    to: paths.budgetManagement.budgetItem,
    icon: <SettingsIcon />,
  },
] as const;

export const BudgetManagementLayout = () => {
  const [tab, setTab] = useState("plan");

  return (
    <WithHeaderLayout pageTitle="家計管理">
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
