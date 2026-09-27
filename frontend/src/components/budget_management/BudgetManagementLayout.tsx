import { Box, ListItemIcon } from "@mui/material";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { WithHeaderLayout } from "../layouts/WithHeaderLayout";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Link, Outlet, useLocation } from "react-router";
import { paths } from "../routes/paths";

const MENU_ITEMS = [
  {
    label: "月次予算計画",
    to: paths.budgetManagement.monthlyPlans,
    icon: <FormatListBulletedIcon />,
  },
  {
    label: "予算項目設定",
    to: paths.budgetManagement.budgetItem,
    icon: <SettingsIcon />,
  },
] as const;

export const HouseholdBudgetLayout = () => {
  const { pathname } = useLocation();

  return (
    <WithHeaderLayout pageTitle="家計管理">
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
                selected={pathname.startsWith(item.to)}
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
