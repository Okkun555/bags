import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import type { FC } from "react";
import type { MonthlyPlanShow } from "@/types/budgetManagement";

type Props = {
  monthlyPlanShow: MonthlyPlanShow;
};

export const MonthlyPlanDetailSection: FC<Props> = ({ monthlyPlanShow }) => {
  const monthlyPlanDetails = monthlyPlanShow.monthlyPlanDetails;

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          項目別予算
        </Typography>

        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          // onClick={() => setIsOpenEditDialog(true)}
        >
          編集
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "grey.50",
                "& th": {
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: 13,
                  py: 1.5,
                },
              }}
            >
              <TableCell>予算項目</TableCell>
              <TableCell align="right" sx={{ width: 220 }}>
                毎月の予算
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {monthlyPlanDetails.map((detail) => (
              <TableRow
                key={detail.id}
                hover
                sx={{
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                  "& td": {
                    py: 1.5,
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body2">
                    {detail.budgetItem.name}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {detail.amount.toLocaleString("ja-JP")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      円
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
