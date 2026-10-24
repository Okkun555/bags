import { useFetchMonthPlanDetail } from "@/repositories/budget-management/monthlyPlansRepository";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router";
import { HouseholdBudgetSection } from "./HouseholdBudgetSection";
import { MonthlyPlanDetailSection } from "./MonthlyPlanDetailSection";
import { paths } from "@/components/routes/paths";

export const MonthlyPlanShow = () => {
  const { id } = useParams<{ id: string }>();
  const { monthlyPlanShow, isLoading } = useFetchMonthPlanDetail(Number(id));

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={1}>
        <Link to={paths.budgetManagement.monthlyPlans}>← 一覧へ戻る</Link>

        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {monthlyPlanShow?.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {monthlyPlanShow?.description}
        </Typography>
      </Stack>

      <Divider sx={{ mt: 3, mb: 4 }} />

      {monthlyPlanShow && (
        <Stack spacing={4}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <HouseholdBudgetSection monthlyPlanShow={monthlyPlanShow} />
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <MonthlyPlanDetailSection monthlyPlanShow={monthlyPlanShow} />
            </Grid>
          </Grid>
        </Stack>
      )}
    </Box>
  );
};
