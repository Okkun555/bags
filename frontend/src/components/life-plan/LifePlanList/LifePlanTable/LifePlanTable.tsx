import { VerticalTable } from "@/components/shared/VerticalTable";
import { useFetchLifePlans } from "@/repositories/life-plan/lifePlansRepository";
import { paths } from "@/routes/paths";
import type { LifePlan } from "@/types/lifePlan";
import {
  Button,
  CircularProgress,
  Link,
  Menu,
  MenuItem,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { DeleteLifePlanDialog } from "../DeleteLifePlanDialog";
import { LifePlanFormDialog } from "../LifePlanFormDialog";

export const LifePlanTable = () => {
  const { lifePlans, isLoading } = useFetchLifePlans();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [menuTarget, setMenuTarget] = useState<LifePlan | null>(null);
  const [editTarget, setEditTarget] = useState<LifePlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LifePlan | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    lifePlan: LifePlan,
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuTarget(lifePlan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTarget(null);
  };

  if (isLoading) {
    return <CircularProgress size={32} />;
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
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
              <TableCell>タイトル</TableCell>
              <TableCell>開始年</TableCell>
              <TableCell>終了年</TableCell>
              <TableCell align="center" width={100}>
                操作
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(!lifePlans || lifePlans.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    ライフプランがまだありません。新しいライフプランを作成してください。
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {lifePlans?.map((lifePlan) => (
              <TableRow key={lifePlan.id} hover>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={paths.lifePlans.show(lifePlan.id)}
                  >
                    {lifePlan.name}
                  </Link>
                </TableCell>
                <TableCell>{lifePlan.startFrom}年</TableCell>
                <TableCell>
                  {lifePlan.endTo !== null ? `${lifePlan.endTo}年` : "未設定"}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    color="inherit"
                    onClick={(event) => handleMenuOpen(event, lifePlan)}
                  >
                    操作
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </VerticalTable>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setEditTarget(menuTarget);
            handleMenuClose();
          }}
        >
          編集
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            setDeleteTarget(menuTarget);
            handleMenuClose();
          }}
        >
          削除
        </MenuItem>
      </Menu>

      {editTarget && (
        <LifePlanFormDialog
          lifePlan={editTarget}
          handleClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteLifePlanDialog
          lifePlan={deleteTarget}
          handleClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};
