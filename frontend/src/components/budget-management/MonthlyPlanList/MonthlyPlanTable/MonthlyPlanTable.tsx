import { FormattedDay } from "@/components/shared/FormattedDay";
import { VerticalTable } from "@/components/shared/VerticalTable";
import { useFetchMonthlyPlans } from "@/repositories/budget-management/monthlyPlansRepository";
import { paths } from "@/routes/paths";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link as RouterLink } from "react-router";

export const MonthlyPlanTable = () => {
  const { monthlyPlans, isLoading } = useFetchMonthlyPlans();

  if (isLoading) {
    return <CircularProgress size={32} />;
  }

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
            <TableCell>タイトル</TableCell>
            <TableCell>作成日時</TableCell>
            <TableCell>編集日時</TableCell>
            <TableCell width={20}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {monthlyPlans?.map((monthlyPlan) => (
            <TableRow>
              <TableCell>{monthlyPlan.title}</TableCell>
              <TableCell>
                <FormattedDay value={monthlyPlan.createdAt} />
              </TableCell>
              <TableCell>
                <FormattedDay value={monthlyPlan.updatedAt} />
              </TableCell>
              <TableCell>
                <Button
                  size={"small"}
                  component={RouterLink}
                  to={paths.budgetManagement.monthlyPlanShow(monthlyPlan.id)}
                  variant="contained"
                  color="inherit"
                >
                  編集
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </VerticalTable>
    </TableContainer>
  );
};
