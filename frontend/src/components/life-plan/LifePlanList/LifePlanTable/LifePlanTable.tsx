import { VerticalTable } from "@/components/shared/VerticalTable";
import { useFetchLifePlans } from "@/repositories/life-plan/lifePlansRepository";
import { paths } from "@/routes/paths";
import {
  Button,
  CircularProgress,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router";

export const LifePlanTable = () => {
  const { lifePlans, isLoading } = useFetchLifePlans();

  if (isLoading) {
    return <CircularProgress size={32} />;
  }

  return (
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
            <TableCell>名前</TableCell>
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
              <TableCell>{lifePlan.name}</TableCell>
              <TableCell>{lifePlan.startFrom}年</TableCell>
              <TableCell>
                {lifePlan.endTo !== null ? `${lifePlan.endTo}年` : "未設定"}
              </TableCell>
              <TableCell align="center">
                <Button
                  size="small"
                  variant="contained"
                  color="inherit"
                  component={RouterLink}
                  to={paths.lifePlans.show(lifePlan.id)}
                >
                  詳細
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </VerticalTable>
    </TableContainer>
  );
};
