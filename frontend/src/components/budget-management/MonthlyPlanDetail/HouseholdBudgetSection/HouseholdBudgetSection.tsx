import {
  RELATIONSHIP_LABEL,
  type MonthlyPlanDetail,
} from "@/types/budgetManagement";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useState, type FC } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { HouseholdBudgetEditDialog } from "../HouseholdBudgetEditDialog";

type Props = {
  monthlyPlanDetail: MonthlyPlanDetail;
};

export const HouseholdBudgetSection: FC<Props> = ({ monthlyPlanDetail }) => {
  const [isOpenEditDialog, setIsOpenEditDialog] = useState<boolean>(false);

  return (
    <>
      <Paper variant="outlined" sx={{ borderRadius: "12px", p: 2.5 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
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

        {monthlyPlanDetail.householdBudgets.length === 0 ? (
          <Stack
            divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}
          >
            <Empty />
          </Stack>
        ) : (
          <Stack
            divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}
          >
            {monthlyPlanDetail.householdBudgets?.map((budget) => (
              <Stack
                key={budget.id}
                direction="row"
                sx={{ justifyContent: "space-between", py: 1 }}
              >
                <Typography variant="body2">
                  {RELATIONSHIP_LABEL[budget.relationship]}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>

      <HouseholdBudgetEditDialog
        isOpen={isOpenEditDialog}
        handleClose={() => setIsOpenEditDialog(false)}
        monthlyPlanDetail={monthlyPlanDetail}
      />
    </>
  );
};

const Empty = () => (
  <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
    <Typography>世帯収入の登録はありません。</Typography>
  </Box>
);
