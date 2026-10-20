import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { MonthlyPlanShow } from "@/types/budgetManagement";
import type { FC } from "react";

type Props = {
  monthlyPlanShow: MonthlyPlanShow;
};

export const MonthlyPlanDetailSection: FC<Props> = ({ monthlyPlanShow }) => {
  const monthlyPlanDetails = monthlyPlanShow.monthlyPlanDetails;

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            項目別の予算
          </Typography>

          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon fontSize="small" />}
          >
            編集
          </Button>
        </Stack>

        <Box sx={{ mb: 2.5 }}>
          <Stack
            divider={
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              />
            }
          >
            {monthlyPlanDetails.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                }}
              >
                <Typography variant="body1">{item.budgetItem.name}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.amount}円
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Paper>
    </>
  );
};
