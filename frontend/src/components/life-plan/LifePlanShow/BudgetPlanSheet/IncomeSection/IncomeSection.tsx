import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { FC } from "react";
import { useFetchFamilyMembers } from "@/repositories/life-plan/familyMembersRepository";
import { useFetchIncomes } from "@/repositories/life-plan/incomesRepository";
import { relationshipLabels } from "@/types/familyMember";
import { incomeTypeLabels, type Income } from "@/types/income";
import type { LifePlan } from "@/types/lifePlan";
import { SectionFrame } from "../../SectionFrame";
import { DeleteIncomeDialog } from "./DeleteIncomeDialog";
import { IncomeFormDialog } from "./IncomeFormDialog";

type Props = {
  lifePlan: LifePlan;
};

const formatPeriod = (income: Income) =>
  `${income.startFrom}年〜${income.endTo !== null ? `${income.endTo}年` : "最後まで"}`;

/** 収入セクション(メンバーごとの一覧・登録・編集・削除) */
export const IncomeSection: FC<Props> = ({ lifePlan }) => {
  const { familyMembers, isLoading: isLoadingMembers } = useFetchFamilyMembers(
    lifePlan.id,
  );
  const { incomes, isLoading: isLoadingIncomes } = useFetchIncomes(lifePlan.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Income | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Income | null>(null);

  const renderBody = () => {
    if (isLoadingMembers || isLoadingIncomes || !familyMembers || !incomes) {
      return <CircularProgress size={24} />;
    }

    if (familyMembers.length === 0) {
      return (
        <Alert severity="info">
          収入はメンバーごとに記録します。先に家族メンバーを登録してください。
        </Alert>
      );
    }

    return (
      <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
        <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
          収入を登録
        </Button>

        {familyMembers.map((member) => {
          const memberIncomes = incomes.filter(
            (income) => income.familyMemberId === member.id,
          );

          return (
            <Box key={member.id} sx={{ width: "100%" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {member.name}（{relationshipLabels[member.relationship]}）
              </Typography>
              {memberIncomes.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  収入が登録されていません。
                </Typography>
              ) : (
                // MEMO: 備考以外は幅を固定し、余った幅を備考に割り当てる
                <Table size="small" sx={{ tableLayout: "fixed" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell width={100}>種別</TableCell>
                      <TableCell align="right" width={160}>
                        金額(年額)
                      </TableCell>
                      <TableCell width={200}>期間</TableCell>
                      <TableCell>備考</TableCell>
                      <TableCell align="center" width={100}>
                        編集
                      </TableCell>
                      <TableCell align="center" width={100}>
                        削除
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {memberIncomes.map((income) => (
                      <TableRow key={income.id}>
                        <TableCell>{incomeTypeLabels[income.incomeType]}</TableCell>
                        <TableCell align="right">
                          {income.amount.toLocaleString()}円
                        </TableCell>
                        <TableCell>{formatPeriod(income)}</TableCell>
                        <TableCell sx={{ wordBreak: "break-all" }}>{income.memo}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="contained"
                            color="inherit"
                            onClick={() => setEditTarget(income)}
                          >
                            編集
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => setDeleteTarget(income)}
                          >
                            削除
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          );
        })}
      </Stack>
    );
  };

  return (
    <>
      <SectionFrame title="収入">{renderBody()}</SectionFrame>

      {isDialogOpen && familyMembers && (
        <IncomeFormDialog
          lifePlanId={lifePlan.id}
          lifePlan={lifePlan}
          familyMembers={familyMembers}
          handleClose={() => setIsDialogOpen(false)}
        />
      )}

      {editTarget && familyMembers && (
        <IncomeFormDialog
          lifePlanId={lifePlan.id}
          lifePlan={lifePlan}
          familyMembers={familyMembers}
          income={editTarget}
          handleClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteIncomeDialog
          lifePlanId={lifePlan.id}
          income={deleteTarget}
          handleClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};
