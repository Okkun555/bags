import { FormattedDay } from "@/components/shared/FormattedDay";
import { VerticalTable } from "@/components/shared/VerticalTable";
import {
  useDeleteMonthlyPlan,
  useFetchMonthlyPlans,
} from "@/repositories/budget-management/monthlyPlansRepository";
import { paths } from "@/routes/paths";
import {
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { useState } from "react";

export const MonthlyPlanTable = () => {
  const { monthlyPlans, isLoading } = useFetchMonthlyPlans();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    planId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlanId(planId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlanId(null);
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
              <TableCell>作成日時</TableCell>
              <TableCell>編集日時</TableCell>
              <TableCell align="center" width={100}>
                操作
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {monthlyPlans?.map((monthlyPlan) => (
              <TableRow key={monthlyPlan.id} hover>
                <TableCell>{monthlyPlan.title}</TableCell>

                <TableCell>
                  <FormattedDay value={monthlyPlan.createdAt} />
                </TableCell>

                <TableCell>
                  <FormattedDay value={monthlyPlan.updatedAt} />
                </TableCell>

                <TableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    color="inherit"
                    onClick={(event) => handleMenuOpen(event, monthlyPlan.id)}
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
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          component={RouterLink}
          to={
            selectedPlanId !== null
              ? paths.budgetManagement.monthlyPlanShow(selectedPlanId)
              : "#"
          }
          onClick={handleMenuClose}
        >
          編集
        </MenuItem>

        {selectedPlanId !== null && (
          <DeleteMonthlyPlanMenuItem
            id={selectedPlanId}
            onClose={handleMenuClose}
          />
        )}
      </Menu>
    </>
  );
};

type Props = {
  id: number;
  onClose: () => void;
};

const DeleteMonthlyPlanMenuItem = ({ id, onClose }: Props) => {
  const { deleteMonthlyPlan, isMutating } = useDeleteMonthlyPlan(id);

  const handleDelete = async () => {
    await deleteMonthlyPlan();
    onClose();
  };

  return (
    <MenuItem
      disabled={isMutating}
      onClick={handleDelete}
      sx={{ color: "error.main" }}
    >
      削除
    </MenuItem>
  );
};
