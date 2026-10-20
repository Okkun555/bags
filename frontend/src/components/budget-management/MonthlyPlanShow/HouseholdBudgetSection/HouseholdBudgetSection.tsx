import {
  RELATIONSHIP_LABEL,
  type MonthlyPlanShow,
} from "@/types/budgetManagement";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useState, type FC } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { HouseholdBudgetEditDialog } from "../HouseholdBudgetEditDialog";

type Props = {
  monthlyPlanShow: MonthlyPlanShow;
};

export const HouseholdBudgetSection: FC<Props> = ({ monthlyPlanShow }) => {
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);

  const householdBudgets = monthlyPlanShow.householdBudgets;
  const totalIncome = householdBudgets.reduce(
    (total, budget) => total + budget.income,
    0,
  );

  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("ja-JP")}円`;

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
            世帯収入
          </Typography>

          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon fontSize="small" />}
            onClick={() => setIsOpenEditDialog(true)}
          >
            編集
          </Button>
        </Stack>

        {householdBudgets.length === 0 ? (
          <Empty />
        ) : (
          <>
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                合計
              </Typography>

              <Typography
                variant="h4"
                component="p"
                sx={{
                  fontSize: {
                    xs: "1.75rem",
                    sm: "2.125rem",
                    fontWeight: "bold",
                  },
                }}
              >
                {formatCurrency(totalIncome)}
              </Typography>
            </Box>

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
              {householdBudgets.map((budget) => (
                <Stack
                  key={budget.id}
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.5,
                  }}
                >
                  <Typography variant="body1">
                    {RELATIONSHIP_LABEL[budget.relationship]}
                  </Typography>

                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatCurrency(budget.income)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </Paper>

      <HouseholdBudgetEditDialog
        isOpen={isOpenEditDialog}
        handleClose={() => setIsOpenEditDialog(false)}
        monthlyPlanShow={monthlyPlanShow}
      />
    </>
  );
};

const Empty: FC = () => (
  <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
    <Typography color="text.secondary">世帯収入の登録はありません。</Typography>
  </Box>
);
