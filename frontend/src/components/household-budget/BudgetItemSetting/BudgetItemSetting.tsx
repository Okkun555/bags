import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useBudgetItems } from "@/repositories/household-budget/useBudgetItem";
import { useState } from "react";
import { AddBudgetItemDialog } from "../AddBudgetItemDialog";

export const BudgetItemSetting = () => {
  const { budgetItems, isLoading } = useBudgetItems();

  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">予算項目設定</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={() => setIsOpenCreateDialog(true)}
        >
          項目を追加
        </Button>
      </Stack>

      <List sx={{ border: 1, borderColor: "divider", borderRadius: 1, py: 0 }}>
        {budgetItems?.map((budgetItem, index) => (
          <ListItem
            key={budgetItem.id}
            divider={index < budgetItems.length - 1}
            secondaryAction={
              budgetItem.operable ? (
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    edge="end"
                    aria-label="編集"
                    onClick={() => console.log("ダイアログを開く")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="削除"
                    onClick={() => console.log("ダイアログを開く")}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ) : (
                <Tooltip title="標準項目は編集・削除できません">
                  <span>
                    <IconButton edge="end" disabled>
                      <LockIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )
            }
          >
            <ListItemText
              primary={
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Chip
                    label={budgetItem.type === "fixed" ? "固定費" : "変動費"}
                    color={
                      budgetItem.type === "fixed" ? "primary" : "secondary"
                    }
                    variant="filled"
                    size="small"
                  />
                  <Typography>{budgetItem.name}</Typography>
                </Stack>
              }
            />
          </ListItem>
        ))}

        {budgetItems?.length === 0 && (
          <ListItem>
            <ListItemText primary="項目がありません" />
          </ListItem>
        )}
      </List>

      <AddBudgetItemDialog
        isOpen={isOpenCreateDialog}
        handleClose={() => setIsOpenCreateDialog(false)}
      />
    </Box>
  );
};
