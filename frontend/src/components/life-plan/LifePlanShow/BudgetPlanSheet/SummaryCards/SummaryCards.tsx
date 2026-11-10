import { Box, Paper, Stack, Typography } from "@mui/material";
import type { FC } from "react";

type Props = {
  /** 世帯の年間収入合計 */
  incomeTotal: number;
  /** 世帯の年間投資合計 */
  investmentTotal: number;
};

type CardProps = {
  label: string;
  color: string;
  value: number;
};

const SummaryCard: FC<CardProps> = ({ label, color, value }) => (
  <Paper variant="outlined" sx={{ p: 2.5, flex: 1, borderRadius: 3 }}>
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
    <Typography component="div" variant="h4" sx={{ fontWeight: 700 }}>
      {value.toLocaleString("ja-JP")}
      <Typography component="span" variant="body2" color="text.secondary">
        {" "}
        円
      </Typography>
    </Typography>
  </Paper>
);

/** 世帯全体の年間収入・投資の合計 */
export const SummaryCards: FC<Props> = ({ incomeTotal, investmentTotal }) => (
  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%" }}>
    <SummaryCard label="世帯の収入（年）" color="success.main" value={incomeTotal} />
    <SummaryCard label="世帯の投資（年）" color="primary.main" value={investmentTotal} />
  </Stack>
);
