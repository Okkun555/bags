import { WithHeaderLayout } from "@/components/layouts/WithHeaderLayout";
import { useFetchLifePlan } from "@/repositories/life-plan/lifePlansRepository";
import { paths } from "@/routes/paths";
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router";
import { BudgetPlanSheet } from "./BudgetPlanSheet";

const sheets = [
  { key: "budgetPlan", label: "予算計画" },
  { key: "annualBudget", label: "年間予算" },
  { key: "lifePlan", label: "ライフプラン" },
] as const;

type SheetKey = (typeof sheets)[number]["key"];

export const LifePlanShow = () => {
  const { id } = useParams<{ id: string }>();
  const { lifePlan, isLoading, error } = useFetchLifePlan(Number(id));
  const [sheet, setSheet] = useState<SheetKey>("budgetPlan");

  if (isLoading) {
    return (
      <WithHeaderLayout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      </WithHeaderLayout>
    );
  }

  if (error || !lifePlan) {
    return (
      <WithHeaderLayout>
        <Stack spacing={2}>
          <Typography>ライフプランが見つかりません。</Typography>
          <Link component={RouterLink} to={paths.lifePlans.index}>
            ← 一覧へ戻る
          </Link>
        </Stack>
      </WithHeaderLayout>
    );
  }

  return (
    <WithHeaderLayout>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Breadcrumbs separator="›">
            <Link
              component={RouterLink}
              to={paths.lifePlans.index}
              underline="hover"
            >
              ライフプラン
            </Link>
            <Typography
              component="span"
              variant="h5"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {lifePlan.name}
            </Typography>
          </Breadcrumbs>
          <Typography variant="body2" color="text.secondary">
            開始年：{lifePlan.startFrom}年　終了年：
            {lifePlan.endTo !== null ? `${lifePlan.endTo}年` : "未設定"}
          </Typography>
        </Stack>

        <Tabs
          value={sheet}
          onChange={(_, value: SheetKey) => setSheet(value)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {sheets.map(({ key, label }) => (
            <Tab key={key} value={key} label={label} />
          ))}
        </Tabs>

        {sheet === "budgetPlan" && <BudgetPlanSheet lifePlanId={lifePlan.id} />}
        {sheet === "annualBudget" && (
          <Typography color="text.secondary">準備中</Typography>
        )}
        {sheet === "lifePlan" && (
          <Typography color="text.secondary">準備中</Typography>
        )}
      </Stack>
    </WithHeaderLayout>
  );
};
