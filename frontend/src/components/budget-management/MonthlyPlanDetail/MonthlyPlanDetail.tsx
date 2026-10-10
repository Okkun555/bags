import { useFetchMonthPlanDetail } from "@/repositories/budget-management/monthlyPlansRepository";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import { HouseholdBudgetSection } from "./HouseholdBudgetSection";

export const MonthlyPlanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { monthlyPlanDetail, isLoading } = useFetchMonthPlanDetail(Number(id));

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {monthlyPlanDetail?.title}
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {monthlyPlanDetail && (
          <HouseholdBudgetSection monthlyPlanDetail={monthlyPlanDetail} />
        )}
        {/* <HouseholdBudgetSection monthlyPlanId={monthlyPlanId} /> */}
        {/* 今後: <BudgetItemSection monthlyPlanId={monthlyPlanId} /> */}
        {/* 今後: <SummarySection monthlyPlanId={monthlyPlanId} /> */}
      </Stack>
    </Box>
  );
};
