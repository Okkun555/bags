import { VerticalTable } from "@/components/shared/VerticalTable";
import type { BudgetItem, BudgetItems } from "@/types/budgetManagement";
import {
  Button,
  Chip,
  Menu,
  MenuItem,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useState, type FC, type MouseEvent } from "react";

type Props = {
  budgetItems: BudgetItems;
  handleOpenDeleteDialog: (target: BudgetItem) => void;
};

export const BudgetItemTable: FC<Props> = ({
  budgetItems,
  handleOpenDeleteDialog,
}) => {
  const [menuState, setMenuState] = useState<{
    anchorEl: HTMLElement;
    budgetItemId: number;
  } | null>(null);

  const handleClick = (e: MouseEvent<HTMLElement>, budgetItemId: number) =>
    setMenuState({ anchorEl: e.currentTarget, budgetItemId });
  const handleMenuClose = () => setMenuState(null);

  return (
    <TableContainer component={Paper}>
      <VerticalTable>
        <TableHead
          sx={{
            backgroundColor: "#F5F5F5",
            "& .MuiTableCell-root": {
              fontWeight: 600,
              color: "text.secondary",
            },
          }}
        >
          <TableRow>
            <TableCell width={20}>種別</TableCell>
            <TableCell>項目名</TableCell>
            <TableCell width={15}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {budgetItems.map((budgetItem) => (
            <TableRow key={budgetItem.id}>
              <TableCell>
                {budgetItem.type === "fixed" && (
                  <Chip label="固定費" color="info" />
                )}
                {budgetItem.type === "variable" && (
                  <Chip label="変動費" color="secondary" />
                )}
              </TableCell>
              <TableCell>{budgetItem.name}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => handleClick(e, budgetItem.id)}
                  color="inherit"
                >
                  操作
                </Button>
                <Menu
                  anchorEl={menuState?.anchorEl}
                  open={menuState?.budgetItemId === budgetItem.id}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                    }}
                  >
                    編集
                  </MenuItem>
                  <Tooltip
                    title={
                      budgetItem.operable ? "" : "標準項目は削除できません"
                    }
                  >
                    <span style={{ display: "block" }}>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          handleOpenDeleteDialog(budgetItem);
                        }}
                        disabled={!budgetItem.operable}
                      >
                        削除
                      </MenuItem>
                    </span>
                  </Tooltip>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </VerticalTable>
    </TableContainer>
  );
};
