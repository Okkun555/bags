import { Box, ListItemIcon } from "@mui/material";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { WithHeaderLayout } from "../layouts/WithHeaderLayout";
import { useState } from "react";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { BudgetList } from "./BudgetList";
import { BudgetItemSetting } from "./BudgetItemSetting";

const MENU_ITEMS = [
  { label: "予算一覧", value: "list", icon: <FormatListBulletedIcon /> },
  { label: "家計予算", value: "plan", icon: <FamilyRestroomIcon /> },
  { label: "予算項目設定", value: "item", icon: <SettingsIcon /> },
] as const;

export const HouseholdBudget = () => {
  const [selected, setSelected] =
    useState<(typeof MENU_ITEMS)[number]["value"]>("list");

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
                key={item.value}
                selected={selected === item.value}
                onClick={() => setSelected(item.value)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box sx={{ flexGrow: 1, ml: 3, mt: 1 }}>
          {selected === "list" && <BudgetList />}
          {selected === "item" && <BudgetItemSetting />}
        </Box>
      </Box>
    </WithHeaderLayout>
  );
};
