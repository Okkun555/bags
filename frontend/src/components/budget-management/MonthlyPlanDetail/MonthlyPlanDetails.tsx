import { useFetchMonthPlanDetail } from "@/repositories/budget-management/monthlyPlansRepository";
import { Box, CircularProgress } from "@mui/material";
import { useParams } from "react-router";

export const MonthlyPlanDetail = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    // TODO: 404ページへ遷移させる
    return;
  }
  const { monthlyPlanDetail, isLoading } = useFetchMonthPlanDetail(
    parseInt(id),
  );

  if (isLoading) {
    return <CircularProgress size={32} />;
  }

  return (
    <Box>
      <div>{monthlyPlanDetail?.title}</div>
    </Box>
  );
};
