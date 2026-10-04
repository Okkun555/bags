import { Link, Outlet, useLocation } from "react-router";
import { WithHeaderLayout } from "../layouts/WithHeaderLayout";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { paths } from "../routes/paths";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SettingsIcon from "@mui/icons-material/Settings";

const MENU_ITEMS = [
  {
    label: "計画一覧",
    to: paths.budgetManagement.monthlyPlans,
    icon: <FormatListBulletedIcon />,
  },
  {
    label: "項目設定",
    to: paths.budgetManagement.budgetItem,
    icon: <SettingsIcon />,
  },
] as const;

export const BudgetManagementLayout = () => {
  const location = useLocation();

  return (
    <WithHeaderLayout pageTitle="予算計画の管理">
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: 200,
            flexShrink: 0,
            border: 1,
            borderColor: "divider",
          }}
        >
          <List component="nav">
            {MENU_ITEMS.map((item) => (
              <ListItemButton
                key={item.to}
                component={Link}
                to={item.to}
                selected={location.pathname.startsWith(item.to)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box sx={{ flexGrow: 1, ml: 3, mt: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </WithHeaderLayout>
  );
};
